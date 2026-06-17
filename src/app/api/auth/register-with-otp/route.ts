import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VerificationToken from "@/models/VerificationToken";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { name, email, password, otp } = await req.json();

    if (!name || !email || !password || !otp) {
      return NextResponse.json({ message: "All fields including OTP are required" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Verify OTP
    const verificationRecord = await VerificationToken.findOne({ email });
    if (!verificationRecord) {
      return NextResponse.json({ message: "OTP expired or invalid" }, { status: 400 });
    }

    const isValid = await bcrypt.compare(otp, verificationRecord.otp);
    if (!isValid) {
      return NextResponse.json({ message: "Incorrect OTP" }, { status: 400 });
    }

    // OTP is valid! Delete the token
    await VerificationToken.deleteOne({ _id: verificationRecord._id });

    // Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ message: "Registered and logged in successfully", name: user.name }, { status: 201 });

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
    console.error("Error in register-with-otp:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
