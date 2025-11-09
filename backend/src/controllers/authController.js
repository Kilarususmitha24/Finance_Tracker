import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// 🔐 Function to create a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ✅ Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // ✅ Validate required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  // ✅ Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please enter a valid email address");
  }

  // ✅ Validate password length
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // ✅ Check if user already exists (case-insensitive)
  const userExists = await User.findOne({ 
    email: email.toLowerCase().trim() 
  });
  
  if (userExists) {
    res.status(400);
    throw new Error("This email is already registered. Please login instead.");
  }

  try {
    // ✅ Create new user (password will be hashed by pre-save hook)
    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password, 
      role: role || "user" 
    });

    if (user) {
      console.log("✅ New user registered:", { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      });
      
      res.status(201).json({
        success: true,
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
        token: generateToken(user._id), // ✅ Real JWT
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    // ✅ Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000 || error.name === "MongoServerError") {
      res.status(400);
      throw new Error("This email is already registered. Please login instead.");
    }
    // ✅ Handle validation errors
    if (error.name === "ValidationError") {
      res.status(400);
      const messages = Object.values(error.errors).map(err => err.message).join(", ");
      throw new Error(messages || "Invalid user data");
    }
    // Re-throw other errors
    throw error;
  }
});

// ✅ Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // ✅ Find user with case-insensitive email matching
  const user = await User.findOne({ 
    email: email.toLowerCase().trim() 
  });

  if (user && (await user.matchPassword(password))) {
    console.log("✅ User logged in:", { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });
    
    res.json({
      success: true,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
      token: generateToken(user._id), // ✅ Real JWT
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// ✅ Get User Profile (Current Logged-in User)
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  
  if (user) {
    res.json({
      success: true,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});