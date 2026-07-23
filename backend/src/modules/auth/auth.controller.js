import { registerUser, loginUser, syncClerkUser } from "./auth.service.js";

export async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const token = await loginUser(req.body);
    res.json({ token });
  } catch (error) {
    next(error);
  }
}

export async function syncUser(req, res, next) {
  try {
    console.log('Clerk sync payload:', req.body);
    const user = await syncClerkUser(req.body);
    console.log('Clerk sync result:', user);
    res.json(user);
  } catch (error) {
    console.error('Clerk sync error:', error);
    next(error);
  }
}

