import api from './axios';

/**
 * Service to handle Gemini-powered AI Assistant interactions.
 * Real implementation will call FastAPI /api/ai/chat
 */
export const chatService = {
  sendMessage: async (message, history = []) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    // const response = await api.post('/ai/chat', { message, history });
    // return response.data;
    return {
      reply: null, // Placeholder as requested, no hardcoded responses
      timestamp: new Date().toISOString(),
    };
  },

  getHistory: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // const response = await api.get('/ai/chat/history');
    // return response.data;
    return [];
  },

  clearHistory: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    // await api.delete('/ai/chat/history');
    return { success: true };
  }
};
