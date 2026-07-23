import api from './axios';

export const forecastService = {
  getForecast: async (metric = 'revenue', horizonMonths = 6) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      metric,
      horizon: horizonMonths,
      historical: [],
      predicted: [],
    };
  }
};
