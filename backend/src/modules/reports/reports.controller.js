import { getReportsData } from "./reports.service.js";

export async function getReports(req, res, next) {
  try {
    const results = await getReportsData();
    res.json(results);
  } catch (error) {
    next(error);
  }
}

