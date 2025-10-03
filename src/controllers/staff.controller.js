import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";

// Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        branch: true,
        attendances: true,
        shiftAllocations: true,
        salaries: true,
      },
    });
    res.status(200).json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get staff by ID
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staffMember = await prisma.staff.findUnique({
      where: { id: Number(id) },
      include: {
        branch: true,
        attendances: true,
        shiftAllocations: true,
        salaries: true,
      },
    });

    if (!staffMember) {
      return res.status(404).json({ error: "Staff not found" });
    }

    res.status(200).json(staffMember);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new staff
export const createStaff = async (req, res) => {
  try {
    const {
      staffCode,
      firstName,
      lastName,
      gender,
      dob,
      email,
      phone,
      profilePhoto,
      role,
      status,
      joinDate,
      exitDate,
      salaryType,
      fixedSalary,
      hourlyRate,
      commissionRate,
      loginAccess,
      username,
      password,
      branchId,
    } = req.body;

    if (
      !staffCode ||
      !firstName ||
      !lastName ||
      !gender ||
      !dob ||
      !email ||
      !phone ||
      !role ||
      !joinDate ||
      !salaryType
    ) {
      return res
        .status(400)
        .json({
          error:
            "staffCode, firstName, lastName, gender, dob, email, phone, role, joinDate, and salaryType are required",
        });
    }

    // Validate enum values
    const validGenders = ["MALE", "FEMALE", "OTHER"];
    const validStatuses = ["ACTIVE", "INACTIVE", "RESIGNED", "TERMINATED"];
    const validSalaryTypes = ["FIXED", "HOURLY", "COMMISSION"];

    if (!validGenders.includes(gender)) {
      return res.status(400).json({ error: "Invalid gender value" });
    }
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    if (!validSalaryTypes.includes(salaryType)) {
      return res.status(400).json({ error: "Invalid salaryType value" });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newStaff = await prisma.staff.create({
      data: {
        staffCode: staffCode.toString(),
        firstName,
        lastName,
        gender,
        dob: dob ? new Date(dob) : null,
        email,
        phone: phone.toString(),
        profilePhoto,
        role,
        status: status || "ACTIVE",
        joinDate: joinDate ? new Date(joinDate) : null,
        exitDate: exitDate ? new Date(exitDate) : null,
        salaryType,
        fixedSalary: fixedSalary ? parseFloat(fixedSalary) : null,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        commissionRate: commissionRate ? parseFloat(commissionRate) : null,
        loginAccess: loginAccess || false,
        username,
        password: hashedPassword,
        branchId: branchId ? Number(branchId) : null,
      },
    });

    res.status(201).json(newStaff);
  } catch (error) {
    console.error("Error creating staff:", error);
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid branchId, branch does not exist" });
    }
    if (error.code === "P2002") {
      const field = error.meta.target.replace("Staff_", "").replace("_key", "");
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update staff
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      staffCode,
      firstName,
      lastName,
      gender,
      dob,
      email,
      phone,
      profilePhoto,
      role,
      status,
      joinDate,
      exitDate,
      salaryType,
      fixedSalary,
      hourlyRate,
      commissionRate,
      loginAccess,
      username,
      password,
      branchId,
    } = req.body;

    // Validate enum values if provided
    const validGenders = ["MALE", "FEMALE", "OTHER"];
    const validStatuses = ["ACTIVE", "INACTIVE", "RESIGNED", "TERMINATED"];
    const validSalaryTypes = ["FIXED", "HOURLY", "COMMISSION"];

    if (gender && !validGenders.includes(gender)) {
      return res.status(400).json({ error: "Invalid gender value" });
    }
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    if (salaryType && !validSalaryTypes.includes(salaryType)) {
      return res.status(400).json({ error: "Invalid salaryType value" });
    }

    let data = {
      staffCode,
      firstName,
      lastName,
      gender,
      dob: dob ? new Date(dob) : undefined,
      email,
      phone: phone ? phone.toString() : undefined,
      profilePhoto,
      role,
      status,
      joinDate: joinDate ? new Date(joinDate) : undefined,
      exitDate: exitDate ? new Date(exitDate) : undefined,
      salaryType,
      fixedSalary: fixedSalary ? parseFloat(fixedSalary) : undefined,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
      commissionRate: commissionRate ? parseFloat(commissionRate) : undefined,
      loginAccess,
      username,
      branchId: branchId ? Number(branchId) : undefined,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(updatedStaff);
  } catch (error) {
    console.error("Error updating staff:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Staff not found" });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Invalid branchId, branch does not exist" });
    }
    if (error.code === "P2002") {
      const field = error.meta.target.replace("Staff_", "").replace("_key", "");
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.staff.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting staff:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Staff not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
