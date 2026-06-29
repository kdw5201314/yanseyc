// 内存数据存储 - 兼容 Cloudflare Workers 环境
// 注意：数据在部署后会重置，后续可接入 Cloudflare KV 实现持久化

interface AnalyticsData {
  events: any[];
  feedbacks: any[];
}

// 使用全局变量保持数据在 Worker 实例存活期间不丢失
declare global {
  var __ycData: AnalyticsData | undefined;
}

function getData(): AnalyticsData {
  if (!globalThis.__ycData) {
    globalThis.__ycData = { events: [], feedbacks: [] };
  }
  return globalThis.__ycData;
}

export function readData(): AnalyticsData {
  return getData();
}

export function saveData(data: AnalyticsData): void {
  globalThis.__ycData = data;
}

export function appendEvent(event: any): void {
  const data = getData();
  // Keep last 5000 events max
  if (data.events.length > 5000) data.events = data.events.slice(-4000);
  data.events.push(event);
  saveData(data);
}

export function appendFeedback(feedback: any): void {
  const data = getData();
  data.feedbacks.push(feedback);
  if (data.feedbacks.length > 500) data.feedbacks = data.feedbacks.slice(-400);
  saveData(data);
}
