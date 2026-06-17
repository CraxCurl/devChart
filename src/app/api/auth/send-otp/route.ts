import { NextResponse } from "next/server";
import { Resend } from "resend";
import connectDB from "@/lib/mongodb";
import VerificationToken from "@/models/VerificationToken";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Remove any existing tokens for this email to prevent spam issues
    await VerificationToken.deleteMany({ email });

    // Save new hashed OTP
    await VerificationToken.create({
      email,
      otp: hashedOtp,
    });

    // Send Email using Resend
    const { data, error } = await resend.emails.send({
      from: "DevChart <auth@stigz.xyz>",
      to: [email],
      subject: "Your DevChart Login Code",
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #050505; color: #ffffff; border-radius: 10px;">
          <h2 style="color: #ffffff;">Your Login Code</h2>
          <p>Please use the following 6-digit code to log in to your Club Board. This code expires in 10 minutes.</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #111; border: 1px solid #333; border-radius: 8px; text-align: center;">
            <strong style="font-size: 24px; letter-spacing: 5px;">${otp}</strong>
          </div>
          <p style="font-size: 12px; color: #888;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in send-otp:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
