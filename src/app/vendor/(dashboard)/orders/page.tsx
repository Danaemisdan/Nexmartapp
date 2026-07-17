import { Search, Filter, Download, MoreVertical, Package, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function VendorOrdersPage() {
  // Generate beautiful mock orders
  const orders = [
    { id: "ORD-12578", date: "May 20, 2025, 10:24 AM", customer: "Alice Smith", items: 3, total: 18450, status: "Processing", payment: "Paid" },
    { id: "ORD-12577", date: "May 20, 2025, 09:15 AM", customer: "John Doe", items: 1, total: 12500, status: "Delivered", payment: "Paid" },
    { id: "ORD-12576", date: "May 19, 2025, 04:30 PM", customer: "Emma Wilson", items: 2, total: 8400, status: "Shipped", payment: "Paid" },
    { id: "ORD-12575", date: "May 19, 2025, 02:10 PM", customer: "Michael Brown", items: 5, total: 45000, status: "Processing", payment: "Paid" },
    { id: "ORD-12574", date: "May 18, 2025, 11:45 AM", customer: "Sarah Johnson", items: 1, total: 3200, status: "Delivered", payment: "Paid" },
    { id: "ORD-12573", date: "May 18, 2025, 09:20 AM", customer: "David Lee", items: 4, total: 22100, status: "Shipped", payment: "Paid" },
    { id: "ORD-12572", date: "May 17, 2025, 03:50 PM", customer: "James Taylor", items: 2, total: 15600, status: "Cancelled", payment: "Refunded" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Orders
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track your customer orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={16} className="text-gray-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by order ID or customer..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <Filter size={14} className="text-gray-500" /> Filter
            </button>
            <select className="border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg px-3 py-2 bg-white outline-none cursor-pointer">
              <option>All Statuses</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Package size={14} />
                      <span>{order.items} items</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ₦{order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      order.payment === 'Paid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">7</span> of <span className="font-medium text-gray-900">7</span> results</p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
