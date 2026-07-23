import { getAnalyticsData } from "./analytics.service.js";

export async function getAnalytics(req, res, next) {
  try {
    const results = await getAnalyticsData();
    res.json(results);
  } catch (error) {
    next(error);
  }
}

