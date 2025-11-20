const personalTrainingSessionService = require('../services/personalTrainingSessionService');
const responseHandler = require('../utils/responseHandler');

const getSessions = async (req, res, next) => {
  try {
    const { userRole, userBranchId, isSuperAdmin } = req.accessFilters;
    const { trainerId, memberId, status, dateFrom, dateTo, search } = req.query;

    const filters = {};

    if (trainerId) filters.trainerId = trainerId;
    if (memberId) filters.memberId = memberId;
    if (status) filters.status = status;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    if (search) filters.search = search;

    // Branch filtering based on role
    if (!isSuperAdmin) {
      filters.branchId = userBranchId;
    }

    const sessions = await personalTrainingSessionService.getSessions(filters);
    responseHandler.success(res, 'Sessions fetched successfully', { sessions });
  } catch (error) {
    console.error('❌ Get Sessions Error:', error);
    next(error);
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await personalTrainingSessionService.getSessionById(id);
    responseHandler.success(res, 'Session fetched successfully', { session });
  } catch (error) {
    console.error('❌ Get Session By ID Error:', error);
    next(error);
  }
};

const createSession = async (req, res, next) => {
  try {
    const sessionData = req.body;
    const createdById = req.user.id;
    const { userRole, userBranchId } = req.accessFilters;
    const userBranchIdParam = userRole === 'superadmin' ? null : userBranchId;
    const session = await personalTrainingSessionService.createSession(sessionData, createdById, userBranchIdParam);
    responseHandler.success(res, 'Session created successfully', { session });
  } catch (error) {
    console.error('❌ Create Session Error:', error);
    next(error);
  }
};

const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sessionData = req.body;
    const session = await personalTrainingSessionService.updateSession(id, sessionData);
    responseHandler.success(res, 'Session updated successfully', { session });
  } catch (error) {
    console.error('❌ Update Session Error:', error);
    next(error);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    await personalTrainingSessionService.deleteSession(id);
    responseHandler.success(res, 'Session deleted successfully');
  } catch (error) {
    console.error('❌ Delete Session Error:', error);
    next(error);
  }
};

const getTrainers = async (req, res, next) => {
  try {
    const { userRole, userBranchId, isSuperAdmin } = req.accessFilters;
    const branchId = isSuperAdmin ? req.query.branchId : userBranchId;

    const trainers = await personalTrainingSessionService.getTrainers(branchId);
    responseHandler.success(res, 'Trainers fetched successfully', { trainers });
  } catch (error) {
    console.error('❌ Get Trainers Error:', error);
    next(error);
  }
};

const getMembersForSessions = async (req, res, next) => {
  try {
    const { userRole, userBranchId, isSuperAdmin } = req.accessFilters;
    const { search } = req.query;
    const branchId = isSuperAdmin ? req.query.branchId : userBranchId;

    const members = await personalTrainingSessionService.getMembersForSessions(branchId, search);
    responseHandler.success(res, 'Members fetched successfully', { members });
  } catch (error) {
    console.error('❌ Get Members For Sessions Error:', error);
    next(error);
  }
};

module.exports = {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getTrainers,
  getMembersForSessions,
};
