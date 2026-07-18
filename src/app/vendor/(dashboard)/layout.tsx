import { getVendorProfile } from "@/app/actions/vendorSettings";
import { SidebarNav } from "@/components/vendor/SidebarNav";
import { Search, Bell, User } from "lucide-react";
import { getVendorStats } from "@/app/actions/vendorProducts";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getVendorProfile();
  const stats = await getVendorStats();

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans">
      <SidebarNav profile={profile} stats={stats} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 flex-shrink-0">
          <div className="flex items-center w-full max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search orders, customers, products..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white box-content"></span>
            </button>
            
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center border border-gray-200">
                <User size={20} className="text-gray-500" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Good day, {profile?.customer_name?.split(" ")[0] || profile?.store_name || "Vendor"}</div>
                <div className="text-gray-500 text-xs">Merchant</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
