"use server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function getVendorProfile() {
  const vendorId = (await cookies()).get("vendor_session")?.value;
  if (!vendorId) return { error: "Not logged in" };

  const { data, error } = await supabase
    .from("vendors")
    .select("store_name, phone_number, password, address, area, customer_name")
    .eq("id", vendorId)
    .single();

  if (error || !data) {
    return { error: "Failed to fetch profile" };
  }
  
  return { profile: data };
}

export async function updateVendorProfile(formData: FormData) {
  const vendorId = (await cookies()).get("vendor_session")?.value;
  if (!vendorId) return { error: "Not logged in" };

  const storeName = formData.get("storeName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;
  const address = formData.get("address") as string;
  const area = formData.get("area") as string;
  const customerName = formData.get("customerName") as string;

  if (!storeName || !password) {
    return { error: "Store Name and Password are required." };
  }

  const { error } = await supabase
    .from("vendors")
    .update({
      store_name: storeName,
      phone_number: phoneNumber || null,
      password: password,
      address: address || null,
      area: area || null,
      customer_name: customerName || null,
    })
    .eq("id", vendorId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
