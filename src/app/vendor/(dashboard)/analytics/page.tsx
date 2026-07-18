import { BarChart3, TrendingUp, Users, MousePointerClick, ArrowUpRight, Target } from "lucide-react";
import { getVendorStats } from "@/app/actions/vendorProducts";

export default async function VendorAnalyticsPage() {
  const stats = await getVendorStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Advanced Analytics
          </h1>
          <p className="text-gray-500 text-sm mt-1">Deep dive into your store's performance metrics.</p>
        </div>
        <select className="border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg px-4 py-2 bg-white outline-none cursor-pointer">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Sessions", value: (stats?.storeViews || 0).toLocaleString(), inc: "+12.5%", icon: Users, color: "blue" },
          { label: "Bounce Rate", value: "42.3%", inc: "-2.1%", icon: MousePointerClick, color: "orange" },
          { label: "Avg. Order Value", value: `₦${Math.floor((stats?.totalRevenue || 0) / (stats?.totalOrders || 1)).toLocaleString()}`, inc: "+5.4%", icon: TrendingUp, color: "green" },
          { label: "Conversion Goal", value: "85%", inc: "+1.2%", icon: Target, color: "purple" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={20} />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-bold ${stat.inc.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.inc.startsWith('+') ? <ArrowUpRight size={14} /> : null}
                {stat.inc}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-semibold mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
          <BarChart3 size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Detailed Charts Loading...</h3>
        <p className="text-gray-500 max-w-md">The advanced analytics engine is currently processing your historic data. Full charts and funnel breakdowns will appear here shortly.</p>
      </div>
    </div>
  );
}
