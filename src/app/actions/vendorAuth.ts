"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function loginVendor(formData: FormData) {
  const storeName = formData.get("storeName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;

  if (!storeName || !password) {
    return { error: "Store Name and Password are required." };
  }

  // Find the vendor in Supabase
  let query = supabase
    .from("vendors")
    .select("id")
    .ilike("store_name", storeName)
    .eq("password", password);

  if (phoneNumber) {
    query = query.eq("phone_number", phoneNumber);
  }

  const { data, error } = await query.limit(1);

  if (error || !data || data.length === 0) {
    return { error: "Invalid Credentials." };
  }

  // Set the session cookie securely
  (await cookies()).set("vendor_session", data[0].id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  // Redirect to dashboard
  redirect("/vendor");
}

export async function logoutVendor() {
  (await cookies()).delete("vendor_session");
  redirect("/vendor/login");
}
