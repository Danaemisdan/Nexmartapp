import { Boxes, Search, AlertCircle, Plus } from "lucide-react";
import { getVendorStats } from "@/app/actions/vendorProducts";

export default async function VendorInventoryPage() {
  const stats = await getVendorStats();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Inventory Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track your stock levels and get low-stock alerts.</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus size={16} />
          <span>Update Stock</span>
        </button>
      </div>

      {(stats?.activeProducts || 0) > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-bold text-red-800">Low Stock Alert</h4>
            <p className="text-sm text-red-600 mt-1">2 of your top-selling products have less than 10 units remaining. Restock soon to avoid losing sales.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
        <div className="p-8 text-center">
          <Boxes size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Inventory Tracker</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">Detailed warehouse tracking and SKU management will be available here when the inventory module is fully activated.</p>
        </div>
      </div>
    </div>
  );
}
