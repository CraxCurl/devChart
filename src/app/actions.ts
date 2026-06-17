"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import * as jose from 'jose';

export async function getAuthStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  return !!token;
}

export async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as { name: string, email: string };
  } catch {
    return null;
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/");
}
