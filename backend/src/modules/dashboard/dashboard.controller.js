import { getDashboardData } from "./dashboard.service.js";

export async function getDashboard(req, res, next) {
  try {
    const data = await getDashboardData();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

