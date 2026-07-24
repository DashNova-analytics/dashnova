import { getCounts } from "./analytics.repository.js";
export function getAnalyticsData() {
  return getCounts();
}

