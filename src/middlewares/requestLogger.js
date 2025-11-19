// Request Logger Middleware - Logs every incoming request with details

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.log('\n========================================');
  console.log(`📥 INCOMING REQUEST`);
  console.log(`⏰ Time: ${timestamp}`);
  console.log(`🔗 Method: ${method}`);
  console.log(`🌐 URL: ${url}`);
  console.log(`💻 IP: ${ip}`);
  console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
  console.log(`🔍 Query:`, JSON.stringify(req.query, null, 2));
  console.log(`🎫 Headers:`, JSON.stringify(req.headers, null, 2));
  console.log('========================================\n');

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    console.log('\n========================================');
    console.log(`📤 OUTGOING RESPONSE`);
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`🔗 Method: ${method}`);
    console.log(`🌐 URL: ${url}`);
    console.log(`📊 Status: ${res.statusCode}`);
    console.log(`📦 Response:`, typeof data === 'string' ? data.substring(0, 500) : data);
    console.log('========================================\n');
    originalSend.call(this, data);
  };

  next();
};

module.exports = requestLogger;
