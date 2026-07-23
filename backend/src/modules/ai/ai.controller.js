import { fetchAIInsight } from "./ai.service.js";

export async function getAIResponse(req, res, next) {
  try {
    const insight = await fetchAIInsight();
    res.json(insight);
  } catch (error) {
    next(error);
  }
}

