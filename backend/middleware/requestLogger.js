const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  // Log the request
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

  // Log request body for POST/PUT/PATCH requests (be careful with sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    const body = { ...req.body };
    // Remove sensitive fields from logging
    if (body.password) body.password = '[REDACTED]';
    if (body.confirmPassword) body.confirmPassword = '[REDACTED]';
    console.log(`[${timestamp}] Request Body:`, JSON.stringify(body, null, 2));
  }

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    console.log(`[${timestamp}] Response Status: ${res.statusCode}`);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${timestamp}] Response Data:`, JSON.stringify(data, null, 2));
    }
    return originalJson.call(this, data);
  };

  next();
};

module.exports = requestLogger;
