import { Megaphone, Mail, MessageSquare, Plus, ArrowRight } from "lucide-react";

export default function VendorMarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Marketing Campaigns
          </h1>
          <p className="text-gray-500 text-sm mt-1">Automate your outreach and grow your audience.</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus size={16} />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Abandoned Cart Recovery", type: "Email Automation", icon: Mail, status: "Active", reach: "1,240", conv: "18.5%" },
          { title: "Weekend Flash Sale", type: "SMS Blast", icon: MessageSquare, status: "Draft", reach: "-", conv: "-" },
          { title: "VIP Customer Discount", type: "Email Campaign", icon: Mail, status: "Completed", reach: "450", conv: "24.2%" },
        ].map((camp, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:border-indigo-200 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <camp.icon size={20} />
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                camp.status === 'Active' ? 'bg-green-100 text-green-700' : 
                camp.status === 'Completed' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {camp.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{camp.title}</h3>
            <p className="text-sm font-semibold text-gray-500 mb-6">{camp.type}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Reach</p>
                <p className="font-bold text-gray-900">{camp.reach}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Conversion</p>
                <p className="font-bold text-green-600">{camp.conv}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
