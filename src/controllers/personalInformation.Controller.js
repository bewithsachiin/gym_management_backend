import prisma from '../config/prismaClient.js';
import bcrypt from "bcrypt";


// Create a new member
export const createMember = async (req, res) => {
  try {
    const {
      member_id,
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone,
      street,
      city,
      state,
      postal_code,
      membership_plan,
      start_date,
      end_date,
      status,
      membership_type,
      membership_fee,
      password,
    } = req.body;

   
    // Check if member_id and email already exists
    const existingMember = await prisma.member.findUnique({
      where: { member_id },
    });

    if (existingMember) {
      return res.status(400).json({ message: "Member ID already exists" });
    }

    const existingEmail = await prisma.member.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Member Email already exists" });
    }


    // hash password
    const hashed_password = await bcrypt.hash(password, 10);


    // Create member
    const member = await prisma.member.create({
      data: {
        member_id,
        first_name,
        last_name,
        gender,
        date_of_birth: new Date(date_of_birth),
        email,
        phone,
        street,
        city,
        state,
        postal_code,
        membership_plan,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        status,
        membership_type,
        membership_fee: parseFloat(membership_fee),
        hashed_password,
      },
    });

    res.status(201).json({ message: "Member created successfully", member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating member", error: error.message });
  }
};



// Get all members
export const getAllMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching members", error: error.message });
  }
};



// Get member by ID
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await prisma.member.findUnique({ where: { id: parseInt(id) } });
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Error fetching member", error: error.message });
  }
};



// Update member
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.password) {
      data.hashed_password = await bcrypt.hash(data.password, 10);
      delete data.password;
    }

    const updatedMember = await prisma.member.update({
      where: { id: parseInt(id) },
      data,
    });

    res.status(200).json({ message: "Member updated successfully", updatedMember });
  } catch (error) {
    res.status(500).json({ message: "Error updating member", error: error.message });
  }
};



// Delete member
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.member.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member", error: error.message });
  }
};



// Change password
export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const member = await prisma.member.findUnique({ where: { id: parseInt(id) } });
    if (!member) return res.status(404).json({ message: "Member not found" });

    const isMatch = await bcrypt.compare(currentPassword, member.hashed_password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const hashed_password = await bcrypt.hash(newPassword, 10);
    await prisma.member.update({
      where: { id: parseInt(id) },
      data: { hashed_password },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error: error.message });
  }
};
