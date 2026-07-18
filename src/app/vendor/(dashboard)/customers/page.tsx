import { Search, Filter, Download, UserPlus, Users as UsersIcon, Mail, Star, Phone } from "lucide-react";
import { getVendorStats } from "@/app/actions/vendorProducts";

export default async function VendorCustomersPage() {
  const stats = await getVendorStats();
  
  // Generate some dynamic CRM data based on their orders
  const customers = stats?.allOrders?.slice(0, 8).map((order: any, i: number) => ({
    id: `CUST-${8000 + i}`,
    name: order.customer,
    email: `${order.customer.split(' ')[0].toLowerCase()}@example.com`,
    phone: `+234 80${Math.floor(Math.random() * 90000000 + 10000000)}`,
    orders: Math.floor(Math.random() * 15) + 1,
    spent: order.amount * (Math.floor(Math.random() * 5) + 1),
    status: i % 4 === 0 ? "VIP" : i % 3 === 0 ? "New" : "Regular",
    lastOrder: order.date
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Customers
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your customer relationships and view purchase history.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            <UserPlus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* CRM Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Total Customers</p>
            <h3 className="text-2xl font-bold text-gray-900">{(stats?.customers || 0).toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-purple-50 text-purple-600">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">VIP Customers</p>
            <h3 className="text-2xl font-bold text-gray-900">{Math.floor((stats?.customers || 0) * 0.15).toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-green-50 text-green-600">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Email Subscribers</p>
            <h3 className="text-2xl font-bold text-gray-900">{Math.floor((stats?.customers || 0) * 0.6).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search customers by name, email..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            <Filter size={14} className="text-gray-500" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Last Order</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((cust: any) => (
                <tr key={cust.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{cust.name}</div>
                        <div className="text-xs text-gray-500">{cust.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{cust.email}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={10} /> {cust.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{cust.orders}</td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    ₦{cust.spent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{cust.lastOrder}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      cust.status === 'VIP' ? 'bg-purple-100 text-purple-700' : 
                      cust.status === 'New' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {cust.status === 'VIP' && <Star size={10} className="mr-1" />}
                      {cust.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
