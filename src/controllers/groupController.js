const groupService = require('../services/groupService');
const responseHandler = require('../utils/responseHandler');

const getGroups = async (req, res, next) => {
  try {
    const branchId = req.user.branchId; // Assuming user has branchId from auth
    const groups = await groupService.getAllGroups(branchId);
    responseHandler.success(res, 'Groups fetched successfully', { groups });
  } catch (error) {
    next(error);
  }
};

const getGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const branchId = req.user.branchId;
    const group = await groupService.getGroupById(id, branchId);
    responseHandler.success(res, 'Group fetched successfully', { group });
  } catch (error) {
    next(error);
  }
};

const createGroup = async (req, res, next) => {
  try {
    const groupData = req.body;
    if (req.file) {
      groupData.photo = req.file.path; // Cloudinary URL from middleware
    }
    const branchId = req.user.branchId;
    const group = await groupService.createGroup(groupData, branchId);
    responseHandler.success(res, 'Group created successfully', { group });
  } catch (error) {
    next(error);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const groupData = req.body;
    if (req.file) {
      groupData.photo = req.file.path; // Cloudinary URL from middleware
    }
    const branchId = req.user.branchId;
    const group = await groupService.updateGroup(id, groupData, branchId);
    responseHandler.success(res, 'Group updated successfully', { group });
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const branchId = req.user.branchId;
    await groupService.deleteGroup(id, branchId);
    responseHandler.success(res, 'Group deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
};
