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

  let activeProducts = products.length;
  let averagePrice = products.length > 0 ? products.reduce((acc: number, p: any) => acc + p.price, 0) / products.length : 0;
  let mockOrdersCount = activeProducts * 14; 
  let mockRevenue = mockOrdersCount * averagePrice;

  // Generate dynamic mock orders for the Orders page, based STRICTLY on activeProducts
  const generateMockOrders = (count: number) => {
    if (activeProducts === 0) return []; // Return nothing if no products!
    return Array.from({ length: count }).map((_, i) => ({
      id: `#ORD-${12500 + i}`,
      productTitle: products[i % products.length].title,
      customer: ["John Doe", "Alice Smith", "Michael Johnson", "Emma Davis", "David Wilson", "Sarah Lee", "James Bond"][i % 7],
      status: i % 5 === 0 ? "Delivered" : i % 4 === 0 ? "Cancelled" : i % 3 === 0 ? "Shipped" : "Processing",
      amount: products[i % products.length].price,
      payment: i % 4 === 0 ? "Refunded" : "Paid",
      items: (i % 4) + 1,
      date: `May ${20 - (i % 5)}, 2025`
    }));
  };

  const allOrders = generateMockOrders(activeProducts === 0 ? 0 : 20);
  const recentOrders = allOrders.slice(0, 5);

  // Generate mock chart data for the last 7 days (all zero if no revenue)
  const salesData = [
    { name: 'May 14', value: activeProducts === 0 ? 0 : mockRevenue * 0.1 },
    { name: 'May 15', value: activeProducts === 0 ? 0 : mockRevenue * 0.15 },
    { name: 'May 16', value: activeProducts === 0 ? 0 : mockRevenue * 0.08 },
    { name: 'May 17', value: activeProducts === 0 ? 0 : mockRevenue * 0.12 },
    { name: 'May 18', value: activeProducts === 0 ? 0 : mockRevenue * 0.25 },
    { name: 'May 19', value: activeProducts === 0 ? 0 : mockRevenue * 0.18 },
    { name: 'May 20', value: activeProducts === 0 ? 0 : mockRevenue * 0.12 },
  ];

  // Top Products (Empty if 0 products)
  const topProducts = products.length > 0 
    ? products.slice(0, 4).map((p: any, i: number) => ({
        title: p.title,
        price: p.price,
        units: Math.floor(activeProducts * (10 - i) * 1.5),
        image: p.image
      }))
    : [];

  // AI Agents Dynamic Data (Strictly 0 if no orders/revenue)
  const aiAgents = [
    { 
      id: "nexi-01", name: "Nexi", role: "Sales Agent", color: "indigo", status: "Active",
      kpis: [
        { label: "Conversations", value: activeProducts === 0 ? "0" : (mockOrdersCount * 3.5).toLocaleString() },
        { label: "Conversion Rate", value: activeProducts === 0 ? "0%" : "14.2%" },
        { label: "Generated Revenue", value: activeProducts === 0 ? "₦0" : `₦${(mockRevenue * 0.4).toLocaleString()}` }
      ]
    },
    { 
      id: "shopi-02", name: "Shopi", role: "Support Agent", color: "blue", status: "Active",
      kpis: [
        { label: "Tickets Handled", value: activeProducts === 0 ? "0" : (mockOrdersCount * 1.2).toLocaleString() },
        { label: "Avg Response Time", value: activeProducts === 0 ? "-" : "< 1 min" },
        { label: "Resolution Rate", value: activeProducts === 0 ? "0%" : "98%" }
      ]
    },
    { 
      id: "recomi-03", name: "Recomi", role: "Recommendation Engine", color: "purple", status: "Paused",
      kpis: [
        { label: "Impressions", value: activeProducts === 0 ? "0" : (activeProducts * 500).toLocaleString() },
        { label: "Click-Through", value: activeProducts === 0 ? "0%" : "24.6%" },
        { label: "Upsell Revenue", value: activeProducts === 0 ? "₦0" : `₦${(mockRevenue * 0.2).toLocaleString()}` }
      ]
    },
    { 
      id: "tracki-04", name: "Tracki", role: "Logistics Agent", color: "orange", status: "Active",
      kpis: [
        { label: "Active Deliveries", value: activeProducts === 0 ? "0" : Math.floor(mockOrdersCount * 0.3).toLocaleString() },
        { label: "On-Time Rate", value: activeProducts === 0 ? "0%" : "96%" },
        { label: "Customer Alerts", value: activeProducts === 0 ? "0" : (mockOrdersCount * 2.8).toLocaleString() }
      ]
    }
  ];

  return {
    activeProducts,
    totalOrders: mockOrdersCount,
    totalRevenue: mockRevenue,
    storeViews: activeProducts * 142,
    customers: Math.floor(mockOrdersCount * 0.8),
    conversionRate: activeProducts > 0 ? "3.62%" : "0%",
    walletBalance: {
      available: mockRevenue * 0.6,
      onHold: mockRevenue * 0.1
    },
    recentOrders,
    allOrders, // 🔥 Pass down full robust dynamic list for the Orders page
    salesData,
    topProducts,
    aiAgents // 🔥 Pass down dynamic AI agents data
  };
}
