import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Credentials are correct. Generate an OTP and send it via email.
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await VerificationToken.deleteMany({ email });

    await VerificationToken.create({
      email,
      otp: hashedOtp,
    });

    // Send Email using Resend
    const { error } = await resend.emails.send({
      from: "DevChart <auth@stigz.xyz>",
      to: [email],
      subject: "Your DevChart 2FA Login Code",
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #050505; color: #ffffff; border-radius: 10px;">
          <h2 style="color: #ffffff;">Your Login Code</h2>
          <p>Please use the following 6-digit code to complete your login. This code expires in 10 minutes.</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #111; border: 1px solid #333; border-radius: 8px; text-align: center;">
            <strong style="font-size: 24px; letter-spacing: 5px;">${otp}</strong>
          </div>
          <p style="font-size: 12px; color: #888;">If you didn't request this, please change your password immediately.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ message: "Failed to send 2FA code" }, { status: 500 });
    }

    return NextResponse.json({ message: "2FA code sent" }, { status: 200 });
  } catch (error) {
    console.error("Error in login-step1:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
