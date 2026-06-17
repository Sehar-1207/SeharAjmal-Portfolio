// temporary-seed-script.js
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

const MONGODB_URI = "your_mongodb_uri_here"; // Put your actual connection string here temporarily

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("YourSuperSecurePassword123!", 12);
  
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("your_database_name"); // Specify your database name
    const adminsCollection = db.collection("admins");

    // Insert your admin user document matching your Schema
    await adminsCollection.insertOne({
      email: "admin@yourportfolio.com",
      password: hashedPassword,
      name: "Portfolio Admin",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("🎉 Admin user created successfully!");
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await client.close();
  }
}

createAdmin();