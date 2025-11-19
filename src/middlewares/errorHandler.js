// Error Handler Middleware - Simple error handling with detailed logging
const responseHandler = require('../utils/responseHandler');

function errorHandler(err, req, res, next) {
  console.log('\n❌ ========================================');
  console.log('❌ ERROR HANDLER TRIGGERED');
  console.log('❌ ========================================');
  console.log('⏰ Time:', new Date().toISOString());
  console.log('🔗 Method:', req.method);
  console.log('🌐 URL:', req.originalUrl);
  console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  console.log('🔍 Query Params:', JSON.stringify(req.query, null, 2));
  console.log('👤 User:', req.user ? {
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  } : 'Not authenticated');
  console.log('\n💥 ERROR DETAILS:');
  console.log('📛 Error Name:', err.name);
  console.log('📝 Error Message:', err.message);
  console.log('📋 Error Stack:', err.stack);
  console.log('❌ ========================================\n');

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    console.log('🔍 Error Type: Mongoose Validation Error');
    const errors = Object.values(err.errors).map((val) => val.message);
    console.log('📋 Validation Errors:', errors);
    return responseHandler.error(res, 'Validation Error: ' + errors.join(', '), 400);
  }

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    console.log('🔍 Error Type: Prisma Unique Constraint Error');
    console.log('📋 Duplicate field:', err.meta?.target);
    return responseHandler.error(res, 'Duplicate entry: This record already exists', 400);
  }

  // Prisma foreign key constraint error
  if (err.code === 'P2003') {
    console.log('🔍 Error Type: Prisma Foreign Key Constraint Error');
    return responseHandler.error(res, 'Invalid reference: Related record not found', 400);
  }

  // Prisma record not found error
  if (err.code === 'P2025') {
    console.log('🔍 Error Type: Prisma Record Not Found Error');
    return responseHandler.error(res, 'Record not found', 404);
  }

  // Cloudinary error
  if (err.http_code) {
    console.log('🔍 Error Type: Cloudinary Upload Error');
    console.log('📋 HTTP Code:', err.http_code);
    return responseHandler.error(res, 'Image upload failed: ' + err.message, 500);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    console.log('🔍 Error Type: JWT Error');
    return responseHandler.error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    console.log('🔍 Error Type: JWT Expired Error');
    return responseHandler.error(res, 'Token expired', 401);
  }

  // Default error
  console.log('🔍 Error Type: Generic Error');
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  console.log('📊 Response Status:', statusCode);
  console.log('📝 Response Message:', message);

  responseHandler.error(res, message, statusCode);
}

module.exports = errorHandler;
