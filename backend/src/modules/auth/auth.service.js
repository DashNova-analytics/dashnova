import bcrypt from "bcryptjs";
import prisma from "../../config/prisma.js";
import { createUser, getUserByEmail, getUserByClerkId, updateUser } from "./auth.repository.js";

export async function registerUser(payload) {
  const { name, email, password, organizationId } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);
  return createUser({ name, email, password: hashedPassword, organizationId });
}

export async function loginUser(payload) {
  const { email, password } = payload;
  const user = await getUserByEmail(email);
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid login credentials");
    error.status = 401;
    throw error;
  }
  return { userId: user.id, email: user.email };
}

export async function syncUser(payload = {}) {
  const clerkId = payload.clerkId || payload.clerkUserId || payload.userId || payload.id;
  const rawEmail = payload.email || payload.emailAddress;

  if (!rawEmail) {
    const error = new Error("Email is required for user synchronization");
    error.status = 400;
    throw error;
  }

  const email = rawEmail.trim().toLowerCase();
  const name = payload.name ? payload.name.trim() : null;
  const providedOrgId = payload.organizationId || payload.orgId || null;
  const orgName = payload.organizationName || payload.orgName || payload.organization || "Default Organization";

  // 1. Organization upsert logic (kept unchanged)
  let organization = null;
  if (providedOrgId) {
    organization = await prisma.organization.findUnique({
      where: { id: providedOrgId },
    });
  }

  if (!organization) {
    try {
      organization = await prisma.organization.upsert({
        where: { name: orgName },
        update: {},
        create: { name: orgName },
      });
    } catch (e) {
      console.warn("Failed to upsert organization, using default:", e.message);
    }
  }

  if (!organization) {
    organization = { id: providedOrgId || "default_org", name: orgName };
  }

  const organizationId = organization.id;

  // 2. User Sync Algorithm
  // Step A: First find user by clerkId
  let user = null;
  if (clerkId) {
    user = await getUserByClerkId(clerkId);
  }

  if (user) {
    // If found, update email, name and organizationId
    if (user.email !== email) {
      const existingWithTargetEmail = await getUserByEmail(email);
      if (existingWithTargetEmail && existingWithTargetEmail.id !== user.id) {
        // An existing user record has this email; update that record with Clerk ID to preserve record
        user = await updateUser(existingWithTargetEmail.id, {
          clerkUserId: clerkId,
          clerkId: clerkId,
          ...(name ? { name } : {}),
          organizationId,
        });
      } else {
        user = await updateUser(user.id, {
          email,
          ...(name ? { name } : {}),
          organizationId,
        });
      }
    } else {
      user = await updateUser(user.id, {
        ...(name ? { name } : {}),
        organizationId,
      });
    }
  } else {
    // Step B: If not found by clerkId, search by email
    const existingByEmail = await getUserByEmail(email);

    if (existingByEmail) {
      // If a user with that email exists, update that record with Clerk ID and organizationId
      user = await updateUser(existingByEmail.id, {
        ...(clerkId ? { clerkUserId: clerkId, clerkId } : {}),
        ...(name ? { name } : {}),
        organizationId,
      });
    } else {
      // Step C: Otherwise create a new user
      const hashedPassword = await bcrypt.hash(`${clerkId || email}@clerk`, 10);
      user = await createUser({
        email,
        name: name || null,
        password: hashedPassword,
        ...(clerkId ? { clerkUserId: clerkId, clerkId } : {}),
        organizationId,
      });
    }
  }

  return {
    user,
    organization,
  };
}

export async function syncClerkUser(payload) {
  return syncUser(payload);
}
