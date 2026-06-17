import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VerificationToken from "@/models/VerificationToken";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    await connectDB();

    const verificationRecord = await VerificationToken.findOne({ email });

    if (!verificationRecord) {
      return NextResponse.json({ message: "OTP expired or invalid" }, { status: 400 });
    }

    const isValid = await bcrypt.compare(otp, verificationRecord.otp);

    if (!isValid) {
      return NextResponse.json({ message: "Incorrect OTP" }, { status: 400 });
    }

    // OTP is valid! Delete the token so it can't be reused
    await VerificationToken.deleteOne({ _id: verificationRecord._id });

    // Check if user exists. If not, auto-register them passwordlessly
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user with a random unusable password since they use OTP
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      user = await User.create({
        name: email.split("@")[0], // default name to first part of email
        email,
        password: randomPassword,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ message: "Logged in successfully", name: user.name }, { status: 200 });

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in verify-otp:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
