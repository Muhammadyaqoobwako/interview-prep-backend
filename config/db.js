const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error Connecting to MongoDB:", err?.message || err);
    console.error("\nTroubleshooting tips:");
    console.error("1. Check your internet connection");
    console.error("2. Verify MongoDB Atlas cluster is running");
    console.error(
      "3. Confirm IP whitelist includes 0.0.0.0/0 (or your current IP)",
    );
    console.error("4. Check if VPN/Firewall is blocking MongoDB Atlas ports");
    process.exit(1);
  }
};

module.exports = connectDB;
