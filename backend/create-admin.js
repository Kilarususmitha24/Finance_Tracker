// Script to create an admin user
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";
    const adminName = "Admin User";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      // Update existing user to admin
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("✅ Existing user updated to admin:");
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   Role: ${existingAdmin.role}`);
    } else {
      // Create new admin user
      const admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });

      console.log("✅ Admin user created successfully!");
      console.log(`   Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   Role: ${admin.role}`);
    }

    console.log("\n📋 Admin Login Credentials:");
    console.log("   Email: admin@example.com");
    console.log("   Password: admin123");
    console.log("\n✅ You can now login as admin!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();

