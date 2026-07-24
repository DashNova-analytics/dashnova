const requests = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5000; // Scalable high capacity for dashboards & real-time polling

// Periodic garbage collection every 5 minutes to keep memory usage low
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requests.entries()) {
    if (now - record.start > WINDOW_MS * 2) {
      requests.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimiter(req, res, next) {
  // Extract true client identity across proxies / load balancers
  const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
  const authHeader = req.headers['authorization'] || '';
  const key = authHeader ? `${clientIp}_${authHeader.slice(-10)}` : clientIp;

  const now = Date.now();
  let record = requests.get(key);

  if (!record || (now - record.start > WINDOW_MS)) {
    record = { count: 0, start: now };
  }

  record.count += 1;
  requests.set(key, record);

  // Set standard rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - record.count));

  if (record.count > MAX_REQUESTS) {
    res.setHeader('Retry-After', Math.ceil((record.start + WINDOW_MS - now) / 1000));
    return res.status(429).json({
      success: false,
      error: "Too many requests, please slow down and try again shortly.",
      message: "Rate limit exceeded"
    });
  }

  next();
}

