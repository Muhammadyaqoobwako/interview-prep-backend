const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const dns = require("dns").promises;

console.log("Testing MongoDB Connection...\n");

// Test 1: DNS Resolution
async function testDNS() {
  console.log("1. Testing DNS Resolution for cluster0.awgnnjp.mongodb.net...");
  try {
    const addresses = await dns.resolve4("cluster0.awgnnjp.mongodb.net");
    console.log("✓ DNS Resolution successful:", addresses);
    return true;
  } catch (err) {
    console.log("✗ DNS Resolution failed:", err.message);
    console.log("  → Try using Google DNS: 8.8.8.8, 8.8.4.4");
    return false;
  }
}

// Test 2: MongoDB Connection with SRV
async function testMongoDBSRV() {
  console.log("\n2. Testing MongoDB Atlas connection (SRV)...");
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("✓ MongoDB connected successfully!");
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.log("✗ MongoDB connection failed:", err.message);
    return false;
  }
}

// Test 3: Alternative connection string (without SRV)
async function testMongoDBDirect() {
  console.log("\n3. Testing alternative connection method...");
  const directURI = process.env.MONGO_URI.replace(
    "mongodb+srv://",
    "mongodb://",
  );
  try {
    await mongoose.connect(directURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("✓ Alternative MongoDB connection successful!");
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.log("✗ Alternative connection also failed");
    return false;
  }
}

// Run all tests
(async () => {
  const dnsOk = await testDNS();

  if (dnsOk) {
    const srvOk = await testMongoDBSRV();
    if (!srvOk) {
      await testMongoDBDirect();
    }
  } else {
    console.log("\n⚠️  DNS issues detected. Possible solutions:");
    console.log("  1. Change Windows DNS to Google DNS (8.8.8.8)");
    console.log("  2. Disable VPN if active");
    console.log("  3. Check firewall settings");
    console.log("  4. Try mobile hotspot");
  }

  console.log("\n✅ Diagnosis complete!");
  process.exit(0);
})();
