// --------------------
// GET all staff
// export const getAllStaff = async (req, res) => {
//   try {
//     const staff = await prisma.staff.findMany({
//       include: {
//         branch: true,
//         staffRole: true,
//         notifications: true,
//       },
//       orderBy: { created_at: "desc" }, // Order by newest first
//     });

//     // Ensure Prisma DATETIME values are serialized correctly
//     const sanitizedStaff = staff.map((s) => ({
//       ...s,
//       created_at: s.created_at?.toISOString(),
//       updated_at: s.updated_at?.toISOString(),
//       dob: s.dob?.toISOString(),
//       join_date: s.join_date?.toISOString(),
//       exit_date: s.exit_date?.toISOString(),
//     }));

//     res.status(200).json({ success: true, count: sanitizedStaff.length, data: sanitizedStaff });
//   } catch (error) {
//     console.error("❌ Failed to fetch staff:", error);
//     res.status(500).json({ message: "Failed to fetch staff.", error });
//   }
// };
// --------------------
// GET staff by ID
// --------------------
// export const getStaffById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const staff = await prisma.staff.findUnique({
//       where: { id: parseInt(id) },
//       include: {
//         branch: true,
//         staffRole: true,
//         notifications: true,
//       },
//     });

//     if (!staff) {
//       return res.status(404).json({ success: false, message: "Staff not found." });
//     }

//     // Convert DATETIME to ISO string for safe JSON
//     const sanitizedStaff = {
//       ...staff,
//       created_at: staff.created_at?.toISOString(),
//       updated_at: staff.updated_at?.toISOString(),
//       dob: staff.dob?.toISOString(),
//       join_date: staff.join_date?.toISOString(),
//       exit_date: staff.exit_date?.toISOString(),
//     };

//     res.status(200).json({ success: true, data: sanitizedStaff });
//   } catch (error) {
//     console.error("❌ Failed to fetch staff:", error);
//     res.status(500).json({ message: "Failed to fetch staff.", error });
//   }
// };
// --------------------
// CREATE staff
// --------------------
// export const createStaff = async (req, res) => {
//   try {
//     const {
//       staff_id,
//       first_name,
//       last_name,
//       name,
//       gender,
//       dob,
//       email,
//       phone,
//       role,
//       status,
//       join_date,
//       exit_date,
//       salary_type,
//       fixed_salary,
//       hourly_rate,
//       commission_rate_percent,
//       login_enabled,
//       username,
//       password,
//       branch_id,
//       role_id,
//     } = req.body;

//     const data = {
//       staff_id,
//       first_name,
//       last_name,
//       name,
//       gender,
//       dob: dob ? new Date(dob) : undefined,
//       email,
//       phone,
//       role,
//       status,
//       join_date: join_date ? new Date(join_date) : undefined,
//       exit_date: exit_date ? new Date(exit_date) : undefined,
//       salary_type,
//       fixed_salary,
//       hourly_rate,
//       commission_rate_percent,
//       username,
//       password,
//       branch_id,
//       role_id,
//       profile_photo: req.file ? req.file.path : undefined,
//       login_enabled:
//         login_enabled === true || login_enabled === "true" ? true : false,
//     };

//     const newStaff = await prisma.staff.create({ data });

//     res.status(201).json(newStaff);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to create staff.", error });
//   }
// };

// --------------------
// UPDATE staff
// --------------------
// export const updateStaff = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const {
//       staff_id,
//       first_name,
//       last_name,
//       name,
//       gender,
//       dob,
//       email,
//       phone,
//       role,
//       status,
//       join_date,
//       exit_date,
//       salary_type,
//       fixed_salary,
//       hourly_rate,
//       commission_rate_percent,
//       login_enabled,
//       username,
//       password,
//       branch_id,
//       role_id,
//     } = req.body;

//     const data = {};

//     if (staff_id !== undefined) data.staff_id = staff_id;
//     if (first_name !== undefined) data.first_name = first_name;
//     if (last_name !== undefined) data.last_name = last_name;
//     if (name !== undefined) data.name = name;
//     if (gender !== undefined) data.gender = gender;
//     if (dob) data.dob = new Date(dob);
//     if (email !== undefined) data.email = email;
//     if (phone !== undefined) data.phone = phone;
//     if (role !== undefined) data.role = role;
//     if (status !== undefined) data.status = status;
//     if (join_date) data.join_date = new Date(join_date);
//     if (exit_date) data.exit_date = new Date(exit_date);
//     if (salary_type !== undefined) data.salary_type = salary_type;
//     if (fixed_salary !== undefined) data.fixed_salary = fixed_salary;
//     if (hourly_rate !== undefined) data.hourly_rate = hourly_rate;
//     if (commission_rate_percent !== undefined)
//       data.commission_rate_percent = commission_rate_percent;
//     if (login_enabled !== undefined)
//       data.login_enabled =
//         login_enabled === true || login_enabled === "true" ? true : false;
//     if (username !== undefined) data.username = username;
//     if (password !== undefined) data.password = password;
//     if (branch_id !== undefined) data.branch_id = branch_id;
//     if (role_id !== undefined) data.role_id = role_id;

//     // Profile photo from multer
//     if (req.file) data.profile_photo = req.file.path;

//     const updatedStaff = await prisma.staff.update({
//       where: { id: parseInt(id) },
//       data,
//     });

//     res.status(200).json(updatedStaff);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update staff.", error });
//   }
// };

// --------------------
// DELETE staff
// --------------------
// export const deleteStaff = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await prisma.staff.delete({ where: { id: parseInt(id) } });
//     res.status(200).json({ message: "Staff deleted successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to delete staff.", error });
//   }
// };
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// =================== CREATE STAFF ===================
export const createStaff = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      middle_name,
      gender,
      dob,
      email,
      phone,
      username,
      password,
      role,
      status,
      staff_role,
      salary_type,
      fixed_salary,
      hourly_rate,
      commission_rate_percent,
      login_enabled,
      branch_id,
      exit_date,
    } = req.body;

    // Get uploaded image URL if available
    const profile_photo = req.file ? req.file.path : null;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }, { phone }] },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email, username, or phone already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Transaction: create user + staff
    const newStaff = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          first_name,
          last_name,
          middle_name,
          gender,
          dob: dob ? new Date(dob) : null,
          email,
          phone,
          username,
          password: hashedPassword,
          profile_photo,
          role,
          status,
        },
      });

      const staff = await tx.staff.create({
        data: {
          staff_id: `STF-${Date.now()}`,
          staff_role,
          salary_type,
          fixed_salary,
          hourly_rate,
          commission_rate_percent,
          login_enabled: login_enabled ?? false,
          user_id: user.id,
          branch_id: branch_id ? Number(branch_id) : null,
          exit_date: exit_date ? new Date(exit_date) : null,
        },
        include: { user: true, branch: true },
      });

      return staff;
    });

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: newStaff,
    });
  } catch (error) {
    console.error("Create staff error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating staff",
      error: error.message,
    });
  }
};

// =================== UPDATE STAFF ===================
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params; // staff ID
    const {
      first_name,
      last_name,
      middle_name,
      gender,
      dob,
      email,
      phone,
      username,
      password, // optional
      role,
      status,
      staff_role,
      salary_type,
      fixed_salary,
      hourly_rate,
      commission_rate_percent,
      login_enabled,
      branch_id,
      exit_date,
    } = req.body;

    // Find staff and linked user
    const staff = await prisma.staff.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    // Handle uploaded image
    const profile_photo = req.file
      ? req.file.path
      : staff.user.profile_photo;

    // Hash password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, SALT_ROUNDS)
      : staff.user.password;

    // Transaction: update user + staff
    const updatedStaff = await prisma.$transaction(async (tx) => {
      // Update user
      await tx.user.update({
        where: { id: staff.user_id },
        data: {
          first_name,
          last_name,
          middle_name,
          gender,
          dob: dob ? new Date(dob) : null,
          email,
          phone,
          username,
          password: hashedPassword,
          profile_photo,
          role,
          status,
        },
      });

      // Update staff
      const updated = await tx.staff.update({
        where: { id: Number(id) },
        data: {
          staff_role,
          salary_type,
          fixed_salary,
          hourly_rate,
          commission_rate_percent,
          login_enabled,
          branch_id: branch_id ? Number(branch_id) : null,
          exit_date: exit_date ? new Date(exit_date) : null,
        },
        include: { user: true, branch: true },
      });

      return updated;
    });

    res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: updatedStaff,
    });
  } catch (error) {
    console.error("Update staff error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating staff",
      error: error.message,
    });
  }
};

// =================== DELETE STAFF ===================
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await prisma.staff.findUnique({
      where: { id: Number(id) },
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.staff.delete({ where: { id: Number(id) } });
      await tx.user.delete({ where: { id: staff.user_id } });
    });

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting staff",
      error: error.message,
    });
  }
};

// =================== GET ALL STAFF ===================
export const getAllStaff = async (req, res) => {
  try {
    const staff = await prisma.staff.findMany({
      include: { user: true, branch: true },
      orderBy: { id: "desc" },
    });

    res.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching staff" });
  }
};

// =================== GET STAFF BY ID ===================
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await prisma.staff.findUnique({
      where: { id: Number(id) },
      include: { user: true, branch: true },
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    res.json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching staff" });
  }
};

