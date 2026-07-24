import { fetchAIInsight, generateAIChatResponse } from "./ai.service.js";

export async function getAIResponse(req, res, next) {
  try {
    const insight = await fetchAIInsight();
    res.json(insight);
  } catch (error) {
    next(error);
  }
}

export async function postAIChat(req, res, next) {
  try {
    const { message, history, contextData } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message parameter is required" });
    }
    const result = await generateAIChatResponse(message, history, contextData);
    res.json(result);
  } catch (error) {
    next(error);
  }
}


