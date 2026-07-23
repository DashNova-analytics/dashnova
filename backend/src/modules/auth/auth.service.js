import bcrypt from "bcryptjs";
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

export async function syncClerkUser(payload) {
  const { clerkUserId, name, email, organizationId } = payload;
  if (!clerkUserId || !email) {
    const error = new Error("Clerk user ID and email are required");
    error.status = 400;
    throw error;
  }

  const existingByClerk = await getUserByClerkId(clerkUserId);
  if (existingByClerk) {
    return updateUser(existingByClerk.id, { name, email, organizationId });
  }

  const existingByEmail = await getUserByEmail(email);
  const hashedPassword = await bcrypt.hash(`${clerkUserId}@clerk`, 10);

  if (existingByEmail) {
    return updateUser(existingByEmail.id, {
      clerkUserId,
      name,
      organizationId,
    });
  }

  return createUser({
    clerkUserId,
    name,
    email,
    password: hashedPassword,
    organizationId,
  });
}

