import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use environment variable or fallback to default local MongoDB
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/expenseTrackerDB";
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 Make sure MongoDB is running on your system`);
    console.error(`💡 Connection String: ${process.env.MONGO_URI || "mongodb://127.0.0.1:27017/expenseTrackerDB"}`);
    process.exit(1);
  }
};

export default connectDB;
