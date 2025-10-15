import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

// remove password before sending
const removeSensitive = (obj) => {
  if (!obj) return obj;
  const { password, ...safe } = obj;
  return safe;
};

// parse hours JSON safely
const parseHours = (hours) => {
  if (!hours) return {};
  if (typeof hours === "object") return hours;
  if (typeof hours === "string") {
    try {
      return JSON.parse(hours.trim());
    } catch {
      return {};
    }
  }
  return {};
};

// ------------------- CREATE -------------------
export const createBranch = async (req, res) => {
  try {
    const {
      name,
      code,
      address,
      manager,
      phone,
      email,
      username,
      password,
      status,
      hours,
    } = req.body;

    // ✅ Simple required field check
    if (!name || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "name, username, and password are required",
      });
    }

    // ✅ Get image from multer+Cloudinary
    const branch_image = req.file?.path || null;

    // ✅ Create branch
    const branch = await prisma.branch.create({
      data: {
        name,
        code: code || null,
        address: address || null,
        manager: manager || null,
        phone: phone || null,
        email: email || null,
        username,
        password,
        branch_image,
        status: status || "Inactive",
     hours: hours ? JSON.stringify(parseHours(hours)) : null

      },
    });

    return res.status(201).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    console.error("Error creating branch:", error);

    // Unique constraint error
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `Unique constraint failed: ${error.meta.target}`,
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

    if (body.name !== undefined) data.name = body.name;
    if (body.code !== undefined) data.code = body.code || null;
    if (body.address !== undefined) data.address = body.address || null;
    if (body.manager !== undefined) data.manager = body.manager || null;
    if (body.phone !== undefined) data.phone = body.phone || null;
    if (body.email !== undefined) data.email = body.email || null;
    if (body.username !== undefined) data.username = body.username || null;
    if (body.status !== undefined) data.status = body.status || "Inactive";
    if (body.hours !== undefined) data.hours = parseHours(body.hours);

    if (body.password) {
      data.password = await bcrypt.hash(body.password, SALT_ROUNDS);
    }

    if (req.file?.path) data.branch_image = req.file.path;

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
    return res.json({ success: true, data: branches.map(removeSensitive) });
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
    return res.json({ success: true, data: removeSensitive(branch) });
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
