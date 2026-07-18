import { Bot, Sparkles, MessageSquare, Truck, Zap, Plus, Search, Settings2, Activity, Play, Pause } from "lucide-react";
import { getVendorStats } from "@/app/actions/vendorProducts";

export default async function VendorAgentsPage() {
  const stats = await getVendorStats();
  
  // Re-map the icon strings from the backend back to the actual Lucide components, and add descriptions
  const agents = (stats?.aiAgents || []).map((agent: any) => ({
    ...agent,
    icon: agent.name === 'Nexi' ? Bot : 
          agent.name === 'Shopi' ? MessageSquare : 
          agent.name === 'Recomi' ? Sparkles : Truck,
    description: agent.name === 'Nexi' ? "Automatically handles customer inquiries, recommends products, and closes sales 24/7." :
                 agent.name === 'Shopi' ? "Resolves customer complaints, tracks orders, and handles return requests autonomously." :
                 agent.name === 'Recomi' ? "Analyzes customer behavior to suggest upsells and cross-sells on product pages." :
                 "Coordinates with delivery partners and updates customers on shipping status."
  }));

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'indigo': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case 'blue': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'purple': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'orange': return 'bg-orange-50 text-orange-600 border-orange-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none"></div>
        <div className="absolute right-10 -bottom-10 opacity-10">
          <Bot size={200} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
            <Zap size={14} className="text-yellow-400" />
            Agentic Commerce
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Your Virtual Team</h1>
          <p className="text-indigo-100/80 mb-6 leading-relaxed">
            Deploy specialized AI agents to automate your sales, support, and marketing 24/7. 
            Scale your business without scaling your headcount.
          </p>
          <button className="bg-white text-slate-900 hover:bg-indigo-50 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
            <Plus size={16} /> Hire New Agent
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <h2 className="text-lg font-bold text-gray-900">Active Agents (4)</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search agents..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:border-indigo-100 transition-colors">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${getColorClasses(agent.color)}`}>
                    <agent.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{agent.role}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  agent.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                  {agent.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {agent.description}
              </p>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                {agent.kpis.map((kpi: any, i: number) => (
                  <div key={i}>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">{kpi.label}</p>
                    <p className={`text-sm font-bold ${kpi.label.includes('Revenue') ? 'text-green-600' : 'text-gray-900'}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                <Activity size={16} /> View Logs
              </button>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                  <Settings2 size={18} />
                </button>
                <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  agent.status === 'Active' 
                    ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                }`}>
                  {agent.status === 'Active' ? <Pause size={14} /> : <Play size={14} />}
                  {agent.status === 'Active' ? 'Pause Agent' : 'Start Agent'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
