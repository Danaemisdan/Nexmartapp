"use server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function getVendorProducts() {
  const vendorId = (await cookies()).get("vendor_session")?.value;
  if (!vendorId) return { error: "Not logged in" };

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("business_id", vendorId)
    .order("id", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching vendor products:", error);
    return { error: error.message };
  }
  
  return { products: data };
}

export async function addVendorProduct(formData: FormData) {
  const vendorId = (await cookies()).get("vendor_session")?.value;
  if (!vendorId) return { error: "Not logged in" };

  const title = formData.get("title") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = (formData.get("category") as string) || "General";
  const imageFile = formData.get("imageFile") as File | null;
  let imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80";

  // If a file was uploaded, we save it to Supabase Storage
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${vendorId}-${Date.now()}.${fileExt}`;
    
    // Create an admin client to bypass storage RLS for uploads
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { error: "Failed to upload image" };
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(fileName);
      
    imageUrl = publicUrl;
  }

  const newProduct = {
    title,
    price,
    category,
    image: imageUrl,
    originalPrice: price,
    discount: "0%",
    rating: 5,
    reviews: 0,
    business_id: vendorId, 
  };

  const { data, error } = await supabase
    .from("products")
    .insert([newProduct])
    .select();

  if (error) {
    console.error("Error inserting vendor product:", error);
    return { error: error.message };
  }

  return { product: data[0] };
}

export async function getVendorStats() {
  const vendorId = (await cookies()).get("vendor_session")?.value;
  if (!vendorId) return { error: "Not logged in" };

  // Fetch all products for this vendor to calculate stats
  const { data: products, error } = await supabase
    .from("products")
    .select("id, price, title")
    .eq("business_id", vendorId);

  if (error || !products) {
    return { error: "Failed to fetch stats" };
  }

  const activeProducts = products.length;
  
  // Since we don't have an orders table yet, generate realistic mock revenue based on their actual inventory
  const mockOrdersCount = activeProducts * 14; 
  const averagePrice = products.length > 0 ? products.reduce((acc, p) => acc + p.price, 0) / products.length : 0;
  const mockRevenue = mockOrdersCount * averagePrice;

  // Generate 5 recent mock orders based on their actual products
  const recentOrders = products.slice(0, 5).map((p, i) => ({
    id: `#ORD-${920 + i}`,
    productTitle: p.title,
    customer: ["John Doe", "Alice Smith", "Michael Johnson", "Emma Davis", "David Wilson"][i % 5],
    status: i % 2 === 0 ? "Completed" : "Processing",
    amount: p.price
  }));

  return {
    activeProducts,
    totalOrders: mockOrdersCount,
    totalRevenue: mockRevenue,
    storeViews: activeProducts * 142,
    recentOrders
  };
}
