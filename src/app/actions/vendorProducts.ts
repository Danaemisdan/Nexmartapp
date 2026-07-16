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
  const averagePrice = products.length > 0 ? products.reduce((acc: number, p: any) => acc + p.price, 0) / products.length : 0;
  const mockRevenue = mockOrdersCount * averagePrice;

  // Generate 5 recent mock orders based on their actual products
  const recentOrders = products.slice(0, 5).map((p: any, i: number) => ({
    id: `#ORD-${920 + i}`,
    productTitle: p.title,
    customer: ["John Doe", "Alice Smith", "Michael Johnson", "Emma Davis", "David Wilson"][i % 5],
    status: i % 2 === 0 ? "Completed" : "Processing",
    amount: p.price,
    date: `May ${20 - i}, 2025`
  }));

  // Generate mock chart data for the last 7 days
  const salesData = [
    { name: 'May 14', value: mockRevenue * 0.1 },
    { name: 'May 15', value: mockRevenue * 0.15 },
    { name: 'May 16', value: mockRevenue * 0.08 },
    { name: 'May 17', value: mockRevenue * 0.12 },
    { name: 'May 18', value: mockRevenue * 0.25 },
    { name: 'May 19', value: mockRevenue * 0.18 },
    { name: 'May 20', value: mockRevenue * 0.12 },
  ];

  // Top Products
  const topProducts = products.slice(0, 4).map((p: any, i: number) => ({
    title: p.title,
    price: p.price,
    units: Math.floor(activeProducts * (10 - i) * 1.5),
    image: p.image
  }));

  // AI Agents Mock Data
  const aiAgents = [
    { name: "Nexi", role: "Sales Agent", icon: "Bot", s1Label: "Orders", s1Val: "128", s2Label: "Revenue", s2Val: `₦${(mockRevenue * 0.4).toLocaleString()}` },
    { name: "Shopi", role: "Support Agent", icon: "Headset", s1Label: "Sessions", s1Val: "342", s2Label: "Resolution", s2Val: "98%" },
    { name: "Recomi", role: "Recommendation Agent", icon: "Sparkles", s1Label: "CTR", s1Val: "24.6%", s2Label: "Revenue", s2Val: `₦${(mockRevenue * 0.2).toLocaleString()}` },
    { name: "Tracki", role: "Logistics Agent", icon: "Truck", s1Label: "Deliveries", s1Val: "298", s2Label: "On-time", s2Val: "96%" }
  ];

  return {
    activeProducts,
    totalOrders: mockOrdersCount,
    totalRevenue: mockRevenue,
    storeViews: activeProducts * 142,
    customers: Math.floor(mockOrdersCount * 0.8),
    conversionRate: "3.62%",
    walletBalance: {
      available: mockRevenue * 0.6,
      onHold: mockRevenue * 0.1
    },
    recentOrders,
    salesData,
    topProducts,
    aiAgents
  };
}
