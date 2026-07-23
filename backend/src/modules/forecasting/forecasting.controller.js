import { getForecastData } from "./forecasting.service.js";

export async function getForecast(req, res, next) {
  try {
    const results = await getForecastData();
    res.json(results);
  } catch (error) {
    next(error);
  }
}

