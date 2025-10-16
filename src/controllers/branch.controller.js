import { PrismaClient } from "@prisma/client";
// Assuming you have installed and imported bcrypt
import bcrypt from "bcrypt"; 

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

// remove password before sending
const removeSensitive = (obj) => {
  if (!obj) return obj;
  const { password, ...safe } = obj;
  return safe;
};

// parse hours/manager JSON safely
const parseJson = (data) => {
  if (!data) return null;
  // If it's already an object, return it.
  if (typeof data === "object") return data; 
  // If it's a string, try to parse it.
  if (typeof data === "string") {
    try {
      return JSON.parse(data.trim());
    } catch {
      return null;
    }
  }
  return null;
};

// ------------------- CREATE -------------------
export const createBranch = async (req, res) => {
  try {
    const {
      name,
      code,
      address,
      manager, // This is an object from frontend
      phone,
      email,
      username,
      password,
      status,
      hours, // This is an object from frontend
    } = req.body;

    // ✅ Simple required field check
    if (!name || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "name, username, and password are required",
      });
    }

    // Hash the password before saving (Security Best Practice)
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // ✅ Get image from multer+Cloudinary
    const branch_image = req.file?.path || null;

    // 💡 FIX 1 (Create): Convert manager and hours objects to JSON strings
    const managerString = manager ? JSON.stringify(parseJson(manager) || manager) : null;
    const hoursString = hours ? JSON.stringify(parseJson(hours) || hours) : null;


    // ✅ Create branch
    const branch = await prisma.branch.create({
      data: {
        name,
        code: code || null,
        address: address || null,
        manager: managerString, // Now a string
        phone: phone || null,
        email: email || null,
        username,
        password: hashedPassword, // Store hashed password
        branch_image,
        status: status || "Inactive",
        hours: hoursString, // Now a string
      },
    });

    return res.status(201).json({
      success: true,
      data: removeSensitive(branch), // Remove password before response
    });
  } catch (error) {
    console.error("Error creating branch:", error);

    // Unique constraint error
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(", ")
        : error.meta?.target;
      return res.status(409).json({
        success: false,
        message: `Unique constraint failed on: ${target}`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create branch",
      error: error.message,
    });
  }
};

// ------------------- UPDATE -------------------
export const updateBranch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body ?? {};

    const data = {};

    // 💡 FIX 2 (Update): Convert manager and hours objects to JSON strings before assignment

    if (body.name !== undefined) data.name = body.name;
    if (body.code !== undefined) data.code = body.code || null;
    if (body.address !== undefined) data.address = body.address || null;
    
    // Convert manager object to JSON string if it exists
    if (body.manager !== undefined) {
      const managerObject = parseJson(body.manager) || body.manager; // Handles string or object input
      data.manager = managerObject ? JSON.stringify(managerObject) : null;
    }
    
    if (body.phone !== undefined) data.phone = body.phone || null;
    if (body.email !== undefined) data.email = body.email || null;
    if (body.username !== undefined) data.username = body.username || null;
    if (body.status !== undefined) data.status = body.status || "Inactive";
    
    // Convert hours object to JSON string if it exists
    if (body.hours !== undefined) {
      const hoursObject = parseJson(body.hours) || body.hours; // Handles string or object input
      data.hours = hoursObject ? JSON.stringify(hoursObject) : null;
    }


    if (body.password) {
      // Assuming bcrypt is imported and working
      data.password = await bcrypt.hash(body.password, SALT_ROUNDS);
    }

    if (req.file?.path) data.branch_image = req.file.path;

    // Check if there's any data to update to avoid empty update call
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "No data provided for update." });
    }

    const updated = await prisma.branch.update({
      where: { id },
      data,
    });

    return res.json({ success: true, data: removeSensitive(updated) });
  } catch (error) {
    console.error("Error updating branch:", error);
    if (error.code === "P2025")
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(", ")
        : error.meta?.target;
      return res.status(409).json({
        success: false,
        message: `Unique constraint failed on: ${target}`,
      });
    }
    // General error for debugging
    return res.status(500).json({
      success: false,
      message: "Failed to update branch",
      error: error.message,
    });
  }
};

// ------------------- LIST -------------------
export const getAllBranches = async (_req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { created_at: "desc" },
    });
    
    // 💡 FIX 3 (List): Parse manager and hours back into objects for the frontend
    const branchesWithParsedJson = branches.map(branch => {
        const parsedBranch = { ...branch };
        
        // Parse manager string back to object
        parsedBranch.manager = parseJson(branch.manager);
        
        // Parse hours string back to object
        parsedBranch.hours = parseJson(branch.hours);

        return parsedBranch;
    });

    return res.json({ success: true, data: branchesWithParsedJson.map(removeSensitive) });
  } catch (error) {
    console.error("Error fetching branches:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch branches",
      error: error.message,
    });
  }
};

// ------------------- GET BY ID -------------------
export const getBranchById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const branch = await prisma.branch.findUnique({ where: { id } });
    if (!branch)
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });

    // 💡 FIX 4 (Get By ID): Parse manager and hours back into objects
    const parsedBranch = { ...branch };
    parsedBranch.manager = parseJson(branch.manager);
    parsedBranch.hours = parseJson(branch.hours);
    
    return res.json({ success: true, data: removeSensitive(parsedBranch) });
  } catch (error) {
    console.error("Error fetching branch:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch branch",
      error: error.message,
    });
  }
};

// ------------------- DELETE -------------------
export const deleteBranch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.branch.delete({ where: { id } });
    return res.json({ success: true, message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Error deleting branch:", error);
    if (error.code === "P2025")
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    return res.status(500).json({
      success: false,
      message: "Failed to delete branch",
      error: error.message,
    });
  }
};