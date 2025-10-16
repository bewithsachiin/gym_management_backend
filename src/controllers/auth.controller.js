import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // optional, if you want JWT authentication

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // for token generation

export const loginUser = async (req, res) => {
  try {
    const { login, password } = req.body; 
    // login can be email, username, or phone

    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: "Login and password are required",
      });
    }

    // Find user by email, username, or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: login },
          { username: login },
          { phone: login },
        ],
      },
      include: {
        staff: true,
        member: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token (optional)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Determine user type based on role
    let userData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      username: user.username,
      profile_photo: user.profile_photo,
      role: user.role,
    };

    // Add staff or member details if applicable
    if (user.staff.length > 0) {
      userData = { ...userData, staff: user.staff };
    } else if (user.member.length > 0) {
      userData = { ...userData, member: user.member };
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};
