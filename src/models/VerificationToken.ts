import mongoose from "mongoose";

const VerificationTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 10 minutes in seconds
  },
});

export default mongoose.models.VerificationToken || mongoose.model("VerificationToken", VerificationTokenSchema);
