import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Routes


import roleRoutes from './src/routes/role.routes.js'
import branchRoutes from './src/routes/branch.routes.js';
import groupRoutes from './src/routes/group.routes.js';
import memberRoutes from './src/routes/member.routes.js';
import staffRoutes from './src/routes/staff.routes.js';
import attendanceRoutes from './src/routes/attendance.routes.js'
import planRoutes from './src/routes/plan.routes.js';
import bookingRoutes from './src/routes/booking.routes.js';
import campaignRoutes from './src/routes/campaign.routes.js';
import salaryRoutes from './src/routes/salary.routes.js';
import dutyRosterRoutes from './src/routes/dutyroster.routes.js';
import classRoutes from './src/routes/class.routes.js';
import feedbackRoutes from './src/routes/feedback.routes.js';
import invoiceRoutes from './src/routes/invoice.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import reportRoutes from './src/routes/report.routes.js';
import addPayment  from './src/routes/addpayment.routes.js'

// Middleware
import { errorHandler } from './src/middleware/error.middleware.js';


dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes


app.use('/api/roles', roleRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/dutyroster', dutyRosterRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments',addPayment);

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Gym backend running on port ${PORT}`));
