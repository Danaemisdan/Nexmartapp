import { AlertTriangle, ShieldCheck, Scale } from "lucide-react";

export default function VendorDisputesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Resolution Center
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage chargebacks, refunds, and customer disputes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3"><AlertTriangle size={20} /></div>
          <h3 className="text-2xl font-bold text-gray-900">0</h3>
          <p className="text-sm font-semibold text-gray-500">Open Disputes</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3"><Scale size={20} /></div>
          <h3 className="text-2xl font-bold text-gray-900">0</h3>
          <p className="text-sm font-semibold text-gray-500">Under Review</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3"><ShieldCheck size={20} /></div>
          <h3 className="text-2xl font-bold text-gray-900">100%</h3>
          <p className="text-sm font-semibold text-gray-500">Win Rate</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <ShieldCheck size={48} className="mx-auto text-green-400 mb-4" />
        <h3 className="text-lg font-bold text-gray-900">All Clear!</h3>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">You have no active customer disputes or chargebacks. Keep up the excellent service!</p>
      </div>
    </div>
  );
}
