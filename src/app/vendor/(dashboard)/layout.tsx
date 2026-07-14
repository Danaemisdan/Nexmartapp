import Link from "next/link";
import { LayoutDashboard, Package, Settings, LogOut } from "lucide-react";
import { logoutVendor } from "@/app/actions/vendorAuth";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
            Nexmart <span className="text-blue-600">Vendor</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link 
            href="/" 
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium transition-colors"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/products" 
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
          >
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link 
            href="/settings" 
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <form action={logoutVendor} className="flex items-center space-x-3 w-full">
            <button type="submit" className="flex items-center justify-center space-x-2 w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
