import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    credit: {
      type: Number,
      default: 500,
      min: 0,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
      lowercase: true,
      trim: true,
    },
  },
  { 
    timestamps: true,
    collection: "users" // Explicit collection name for clean DB naming
  }
);

const User = mongoose.model("User", userSchema);

export default User;
