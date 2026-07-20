import mongoose from "mongoose";

/**
 * Establishes connection to MongoDB database
 */
const connectDatabase = async () => {
  try {
    let mongoUri = process.env.MONGO_URL || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-website-builder";

    // Ensure connection string includes target database name
    if (mongoUri.includes("mongodb.net/?") || mongoUri.endsWith("mongodb.net/")) {
      mongoUri = mongoUri.replace("mongodb.net/?", "mongodb.net/genweb?").replace(/mongodb\.net\/$/, "mongodb.net/genweb");
    }

    console.log(`Attempting MongoDB Connection...`);
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection failure: ${error.message}`);
    console.error(`⚠️ Please check Network Access (0.0.0.0/0) or credentials in MongoDB Atlas.`);
  }
};

export default connectDatabase;