const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://gym-new.alexandratechlab.com',
  'http://gym-new.alexandratechlab.com',
];

// Handle CORS dynamically
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies or authorization headers if needed
  })
);

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/auth.routes');
const branchRoutes = require('./routes/branchRoutes');
const staffRoutes = require('./routes/staffRoutes');
const staffRoleRoutes = require('./routes/staffRoleRoutes');
const memberRoutes = require('./routes/memberRoutes');
const planRoutes = require('./routes/planRoutes');
const classScheduleRoutes = require('./routes/classScheduleRoutes');
const groupRoutes = require('./routes/groupRoutes');
const branchPlanRoutes = require('./routes/branchPlanRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');



// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/branches', branchRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/staff-roles', staffRoleRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/classes', classScheduleRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/branch-plans', branchPlanRoutes);
app.use('/api/v1/attendance', attendanceRoutes);

// ✅ Health check routes
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Gym Management Backend is healthy',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000,
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Gym Management Backend is healthy',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000,
    version: '1.0.0'
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Gym Management Backend is healthy',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000,
    version: '1.0.0'
  });
});

// ✅ Centralized error handling
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
