import { Puzzle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function VendorIntegrationsPage() {
  const apps = [
    { name: "Shopify Sync", desc: "Automatically sync products and inventory with your Shopify store.", status: "Connected", icon: "🛍️" },
    { name: "QuickBooks", desc: "Export sales data and payouts directly to QuickBooks Online.", status: "Connect", icon: "📊" },
    { name: "Mailchimp", desc: "Sync your customer list for email marketing campaigns.", status: "Connect", icon: "📧" },
    { name: "Slack", desc: "Get instant notifications for new orders and disputes.", status: "Connect", icon: "💬" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            App Integrations
          </h1>
          <p className="text-gray-500 text-sm mt-1">Connect Nexmart with your favorite business tools.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="text-4xl mb-4">{app.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{app.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{app.desc}</p>
            </div>
            <button className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              app.status === 'Connected' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100'
            }`}>
              {app.status === 'Connected' ? <CheckCircle2 size={16} /> : null}
              {app.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
