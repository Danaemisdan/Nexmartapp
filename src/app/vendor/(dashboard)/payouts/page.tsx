import { Building2, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { getVendorStats } from "@/app/actions/vendorProducts";

export default async function VendorPayoutsPage() {
  const stats = await getVendorStats();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Payouts History
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track your bank withdrawals and scheduled settlements.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <Building2 className="text-gray-400" size={20} />
            <div>
              <p className="text-sm font-bold text-gray-900">Linked Account</p>
              <p className="text-xs text-gray-500">Guaranty Trust Bank **** 4821</p>
            </div>
          </div>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Update</button>
        </div>
        
        <div className="p-8 text-center">
          <Clock size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No Recent Payouts</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">You haven't requested any bank withdrawals recently. Your payout history will appear here once you withdraw from your wallet.</p>
        </div>
      </div>
    </div>
  );
}
