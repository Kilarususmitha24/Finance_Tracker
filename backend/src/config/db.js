import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // ❗ Require MONGO_URI (do NOT fallback to local DB on Render)
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing in environment variables!");
      process.exit(1);
    }

    const mongoURI = process.env.MONGO_URI;

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(
      `🔌 Connection State: ${
        conn.connection.readyState === 1 ? "Connected" : "Disconnected"
      }`
    );
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error("💡 Ensure your Atlas URI is correct and IP access is allowed.");
    console.error(`💡 MONGO_URI Used: ${process.env.MONGO_URI}`);
    process.exit(1);
  }
};

export default connectDB;
