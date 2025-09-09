const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const requestUrl = req.originalUrl;
  const clientIp = req.ip;

  console.log(`[${timestamp}] ${method} request to ${requestUrl} from IP: ${clientIp}`);
  next();
};

module.exports = requestLogger;