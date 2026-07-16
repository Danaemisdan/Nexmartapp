import { Package, TrendingUp, Users, DollarSign, Wallet, ArrowDown, ArrowUp, ArrowRight, Eye, Calendar, CreditCard, ChevronRight, Activity, Download, Apple, Play, Store, Bot, Settings } from "lucide-react";
import { getVendorStats } from "@/app/actions/vendorProducts";
import { getVendorProfile } from "@/app/actions/vendorSettings";
import SalesChart from "@/components/vendor/SalesChart";

export default async function VendorDashboardPage() {
  const stats = await getVendorStats();
  const { profile } = await getVendorProfile();
  const firstName = profile?.customer_name?.split(" ")[0] || "John";
  
  // Safe fallbacks
  const activeProducts = stats?.activeProducts || 0;
  const totalOrders = stats?.totalOrders || 0;
  const totalRevenue = stats?.totalRevenue || 0;
  const customers = stats?.customers || 0;
  const conversionRate = stats?.conversionRate || "0%";
  const wallet = stats?.walletBalance || { available: 0, onHold: 0 };
  const recentOrders = stats?.recentOrders || [];
  const salesData = stats?.salesData || [];
  const topProducts = stats?.topProducts || [];
  const aiAgents = stats?.aiAgents || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening with your store today.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span>Download app</span>
            <Apple size={14} className="text-gray-600" />
            <Play size={14} className="text-gray-600" />
          </div>
          <button className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Calendar size={16} className="text-gray-500" />
            <span>May 14 – May 20, 2025</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-gray-600">Total Sales</p>
            <div className="bg-green-50 p-2 rounded-lg"><Wallet className="text-green-600" size={18} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₦{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h3>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp size={14} className="mr-1" />
              <span>24.5%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">vs May 7 - May 13, 2025</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-gray-600">Orders</p>
            <div className="bg-blue-50 p-2 rounded-lg"><Package className="text-blue-600" size={18} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{totalOrders.toLocaleString()}</h3>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp size={14} className="mr-1" />
              <span>18.7%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">vs May 7 - May 13, 2025</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-gray-600">Customers</p>
            <div className="bg-purple-50 p-2 rounded-lg"><Users className="text-purple-600" size={18} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{customers.toLocaleString()}</h3>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp size={14} className="mr-1" />
              <span>15.3%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">vs May 7 - May 13, 2025</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-gray-600">Conversion Rate</p>
            <div className="bg-orange-50 p-2 rounded-lg"><Activity className="text-orange-600" size={18} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{conversionRate}</h3>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp size={14} className="mr-1" />
              <span>8.4%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">vs May 7 - May 13, 2025</p>
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Wallet Balance Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-lg font-bold text-gray-900">Wallet Balance</h2>
              <Eye size={16} className="text-gray-400" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Available Balance</p>
                  <h3 className="text-3xl font-extrabold text-gray-900">₦{wallet.available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">On Hold</p>
                  <h4 className="text-lg font-bold text-gray-900">₦{wallet.onHold.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                </div>
              </div>

              {/* Virtual Card */}
              <div className="w-full md:w-[320px] h-[180px] bg-gradient-to-br from-[#111216] to-[#2c3e2d] rounded-2xl p-5 relative overflow-hidden shadow-lg border border-gray-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 p-1 rounded">
                        <Store size={12} className="text-black" />
                      </div>
                      <span className="text-white text-xs font-bold tracking-wider">NEXMART WALLET</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-10 h-7 bg-yellow-600/80 rounded mb-2 border border-yellow-500/50"></div>
                    <div className="text-white font-mono text-lg tracking-widest">**** **** **** 4247</div>
                  </div>
                  <div className="flex justify-between items-end mt-auto">
                    <span className="text-gray-300 text-[10px] font-semibold tracking-wider">VIRTUAL CARD</span>
                    <span className="text-white font-bold italic text-xl">VISA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Actions */}
            <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
                Add Funds
              </button>
              <button className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <ArrowDown size={14} className="text-green-600" /> Withdraw
              </button>
              <button className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <Activity size={14} className="text-green-600" /> Transaction History
              </button>
              <button className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <Settings size={14} className="text-green-600" /> Payout Settings
              </button>
            </div>
          </div>

          {/* Sales Overview Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Sales Overview</h2>
                <div className="w-4 h-4 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center text-[10px]">i</div>
              </div>
              <select className="border border-gray-200 text-sm font-medium text-gray-700 rounded-lg px-3 py-1.5 bg-white outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            
            <SalesChart data={salesData} />
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          
          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
              <button className="text-green-600 text-sm font-semibold hover:text-green-700">View all</button>
            </div>
            <div className="space-y-5">
              {[
                { type: 'in', title: 'Order Payment', sub: '#ORD-12578', amount: '+ ₦18,450.00', date: 'May 20, 2025, 10:24 AM', color: 'text-green-600', bg: 'bg-green-50' },
                { type: 'out', title: 'Payout to Bank', sub: 'Wema Bank **** 8821', amount: '- ₦150,000.00', date: 'May 19, 2025, 03:15 PM', color: 'text-purple-600', bg: 'bg-purple-50' },
                { type: 'in', title: 'Order Payment', sub: '#ORD-12521', amount: '+ ₦9,850.00', date: 'May 19, 2025, 11:20 AM', color: 'text-green-600', bg: 'bg-green-50' },
                { type: 'out', title: 'Refund to Customer', sub: '#ORD-12510', amount: '- ₦4,200.00', date: 'May 18, 2025, 09:40 PM', color: 'text-red-600', bg: 'bg-red-50' },
                { type: 'in', title: 'Order Payment', sub: '#ORD-12495', amount: '+ ₦12,600.00', date: 'May 18, 2025, 04:32 PM', color: 'text-green-600', bg: 'bg-green-50' }
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tx.bg}`}>
                      {tx.type === 'in' ? <ArrowDown size={16} className={tx.color} /> : <ArrowUp size={16} className={tx.color} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{tx.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{tx.sub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.type === 'in' ? 'text-green-600' : 'text-gray-900'}`}>{tx.amount}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Top Selling Products</h2>
              <button className="text-green-600 text-sm font-semibold hover:text-green-700">View all</button>
            </div>
            <div className="space-y-6">
              {topProducts.map((p: any, i: number) => {
                const maxUnits = topProducts[0]?.units || 1;
                const percentage = (p.units / maxUnits) * 100;
                return (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[140px]">{p.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₦{p.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{p.units} units</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                )
              })}
              {topProducts.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No products sold yet.</p>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* AI Agent Performance */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">AI Agent Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiAgents.map((agent: any, i: number) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col justify-between hover:border-green-200 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <Bot size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-green-600 transition-colors">{agent.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{agent.role}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-green-500 transition-colors" />
              </div>
              <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{agent.s1Label}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{agent.s1Val}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{agent.s2Label}</p>
                  <p className={`text-sm font-bold mt-0.5 ${agent.s2Label === 'Resolution' || agent.s2Label === 'On-time' ? 'text-green-600' : 'text-gray-900'}`}>{agent.s2Val}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
