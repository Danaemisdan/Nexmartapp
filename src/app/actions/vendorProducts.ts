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
  let mockOrdersCount = 0;
  let mockRevenue = 0;
  let averagePrice = 0;

  // 💥 DEMO MODE INJECTION: If they have 0 products, inject rich demo data so the dashboard looks alive!
  if (activeProducts === 0) {
    activeProducts = 32;
    mockOrdersCount = 350;
    averagePrice = 8500;
    mockRevenue = mockOrdersCount * averagePrice;
  } else {
    mockOrdersCount = activeProducts * 14; 
    averagePrice = products.length > 0 ? products.reduce((acc: number, p: any) => acc + p.price, 0) / products.length : 0;
    mockRevenue = mockOrdersCount * averagePrice;
  }

  // Generate 20 robust dynamic mock orders for the Orders page
  const generateMockOrders = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: `#ORD-${12500 + i}`,
      productTitle: products.length > 0 ? products[i % products.length].title : "Premium Widget",
      customer: ["John Doe", "Alice Smith", "Michael Johnson", "Emma Davis", "David Wilson", "Sarah Lee", "James Bond"][i % 7],
      status: i % 5 === 0 ? "Delivered" : i % 4 === 0 ? "Cancelled" : i % 3 === 0 ? "Shipped" : "Processing",
      amount: products.length > 0 ? products[i % products.length].price : averagePrice,
      payment: i % 4 === 0 ? "Refunded" : "Paid",
      items: (i % 4) + 1,
      date: `May ${20 - (i % 5)}, 2025`
    }));
  };

  const allOrders = generateMockOrders(20);
  const recentOrders = allOrders.slice(0, 5);

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
  const topProducts = products.length > 0 
    ? products.slice(0, 4).map((p: any, i: number) => ({
        title: p.title,
        price: p.price,
        units: Math.floor(activeProducts * (10 - i) * 1.5),
        image: p.image
      }))
    : Array.from({ length: 4 }).map((_, i) => ({
        title: `Trending Product ${i + 1}`,
        price: averagePrice * (i + 1) * 0.5,
        units: 140 - (i * 20),
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
      }));

  // AI Agents Dynamic Data (Using backend calculations so it's not strictly static)
  const aiAgents = [
    { 
      id: "nexi-01", name: "Nexi", role: "Sales Agent", color: "indigo", status: "Active",
      kpis: [
        { label: "Conversations", value: (mockOrdersCount * 3.5).toLocaleString() },
        { label: "Conversion Rate", value: "14.2%" },
        { label: "Generated Revenue", value: `₦${(mockRevenue * 0.4).toLocaleString()}` }
      ]
    },
    { 
      id: "shopi-02", name: "Shopi", role: "Support Agent", color: "blue", status: "Active",
      kpis: [
        { label: "Tickets Handled", value: (mockOrdersCount * 1.2).toLocaleString() },
        { label: "Avg Response Time", value: "< 1 min" },
        { label: "Resolution Rate", value: "98%" }
      ]
    },
    { 
      id: "recomi-03", name: "Recomi", role: "Recommendation Engine", color: "purple", status: "Paused",
      kpis: [
        { label: "Impressions", value: (activeProducts * 500).toLocaleString() },
        { label: "Click-Through", value: "24.6%" },
        { label: "Upsell Revenue", value: `₦${(mockRevenue * 0.2).toLocaleString()}` }
      ]
    },
    { 
      id: "tracki-04", name: "Tracki", role: "Logistics Agent", color: "orange", status: "Active",
      kpis: [
        { label: "Active Deliveries", value: Math.floor(mockOrdersCount * 0.3).toLocaleString() },
        { label: "On-Time Rate", value: "96%" },
        { label: "Customer Alerts", value: (mockOrdersCount * 2.8).toLocaleString() }
      ]
    }
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
    allOrders, // 🔥 Pass down full robust dynamic list for the Orders page
    salesData,
    topProducts,
    aiAgents // 🔥 Pass down dynamic AI agents data
  };
}
