const classScheduleService = require('../services/classScheduleService');
const responseHandler = require('../utils/responseHandler');

const getClasses = async (req, res, next) => {
  try {
    const { userRole, userBranchId, isSuperAdmin } = req.accessFilters;
    const filters = { ...req.query, ...req.queryFilters };

    console.log(`📅 Class Controller - Get classes - Role: ${userRole}, Branch: ${userBranchId}, Filters:`, filters);

    const classes = await classScheduleService.getAllClasses(filters);
    console.log(`📅 Classes fetched - Count: ${classes.length}`);

    responseHandler.success(res, 'Classes fetched successfully', { classes });
  } catch (error) {
    console.error('❌ Class Controller Error:', error);
    next(error);
  }
};

const getClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { branchId } = req.user;

    // Enforce branch isolation unless SUPERADMIN
    const branchFilter = req.user.role !== 'SUPERADMIN' ? branchId : null;

    const classData = await classScheduleService.getClassById(id, branchFilter);
    if (!classData) {
      return responseHandler.error(res, 'Class not found', 404);
    }

    responseHandler.success(res, 'Class fetched successfully', { class: classData });
  } catch (error) {
    next(error);
  }
};

const createClass = async (req, res, next) => {
  try {
    const classData = req.body;
    const { id: userId, branchId } = req.user;

    // Set branchId and adminId from authenticated user
    classData.branchId = branchId;
    classData.adminId = userId;

    // For admin, ensure class is created in their branch
    const { userRole, userBranchId } = req.accessFilters;
    if (userRole === 'admin' && !classData.branchId) {
      classData.branchId = userBranchId;
    }

    const newClass = await classScheduleService.createClass(classData, userId);
    responseHandler.success(res, 'Class created successfully', { class: newClass }, 201);
  } catch (error) {
    next(error);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const classData = req.body;
    const { id: userId, branchId } = req.user;

    // Enforce branch isolation unless SUPERADMIN
    const branchFilter = req.user.role !== 'SUPERADMIN' ? branchId : null;

    const updatedClass = await classScheduleService.updateClass(id, classData, userId, branchFilter);
    responseHandler.success(res, 'Class updated successfully', { class: updatedClass });
  } catch (error) {
    next(error);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, branchId } = req.user;

    // Enforce branch isolation unless SUPERADMIN
    const branchFilter = req.user.role !== 'SUPERADMIN' ? branchId : null;

    await classScheduleService.deleteClass(id, userId, branchFilter);
    responseHandler.success(res, 'Class deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
};
