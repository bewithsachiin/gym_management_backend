import prisma from "../prisma/client.js";
import bcrypt from 'bcryptjs';

// Get all members
export const getAllMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      include: {
        branch: true,
        memberships: { include: { plan: true } },
        attendances: true,
        payments: true,
        invoices: true,
      },
    });
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get member by ID
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await prisma.member.findUnique({
      where: { id: Number(id) },
      include: {
        branch: true,
        memberships: { include: { plan: true } },
        attendances: true,
        payments: true,
        invoices: true,
      },
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new member
export const createMember = async (req, res) => {
  try {
    const { memberCode, firstName, middleName, lastName, gender, dob, email, phone, address, city, state, status, membershipStatus, weight, height, chest, waist, arms, fatPercent, username, password, branchId } = req.body;

    if (!memberCode || !firstName || !lastName || !gender || !phone) {
      return res.status(400).json({ error: "memberCode, firstName, lastName, gender, and phone are required" });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newMember = await prisma.member.create({
      data: {
        memberCode,
        firstName,
        middleName,
        lastName,
        gender,
        dob: dob ? new Date(dob) : undefined,
        email,
        phone,
        address,
        city,
        state,
        status,
        membershipStatus,
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
        chest: chest ? parseFloat(chest) : undefined,
        waist: waist ? parseFloat(waist) : undefined,
        arms: arms ? parseFloat(arms) : undefined,
        fatPercent: fatPercent ? parseFloat(fatPercent) : undefined,
        username,
        password: hashedPassword,
        branchId: branchId ? Number(branchId) : undefined,
      },
    });

    res.status(201).json(newMember);
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update member
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberCode, firstName, middleName, lastName, gender, dob, email, phone, address, city, state, status, membershipStatus, weight, height, chest, waist, arms, fatPercent, username, password, branchId } = req.body;

    let data = {
      memberCode,
      firstName,
      middleName,
      lastName,
      gender,
      dob: dob ? new Date(dob) : undefined,
      email,
      phone,
      address,
      city,
      state,
      status,
      membershipStatus,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      chest: chest ? parseFloat(chest) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      arms: arms ? parseFloat(arms) : undefined,
      fatPercent: fatPercent ? parseFloat(fatPercent) : undefined,
      username,
      branchId: branchId ? Number(branchId) : undefined,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedMember = await prisma.member.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Member not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete member
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.member.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting member:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Member not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
