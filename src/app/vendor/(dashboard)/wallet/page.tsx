import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Building2, Download } from "lucide-react";
import { getVendorStats } from "@/app/actions/vendorProducts";

export default async function VendorWalletPage() {
  const stats = await getVendorStats();
  const balance = stats?.walletBalance?.available || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Store Wallet
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your funds, view the virtual card, and request withdrawals.</p>
        </div>
        <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm">
          <Download size={16} />
          <span>Download Statement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f1115] rounded-3xl p-8 relative overflow-hidden text-white shadow-2xl h-[280px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-gray-400 font-medium mb-1">Available Balance</p>
                <h2 className="text-5xl font-bold tracking-tight">₦{balance.toLocaleString()}</h2>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-400">Active</span>
              </div>
            </div>
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className="text-gray-400 text-xs tracking-[0.2em] mb-2 uppercase">Virtual Card Number</p>
                <p className="text-2xl font-mono tracking-widest text-gray-200">**** **** **** 4247</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Valid Thru</p>
                <p className="font-mono text-lg text-gray-200">12/28</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3 flex-1">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ArrowUpRight size={18} />
                </div>
                <span className="font-bold text-gray-900">Withdraw to Bank</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowDownRight size={18} />
                </div>
                <span className="font-bold text-gray-900">Add Funds</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
