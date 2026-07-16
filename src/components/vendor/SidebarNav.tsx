"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Package, Users, BarChart3, Megaphone, 
  Boxes, Wallet, ArrowLeftRight, AlertCircle, Settings, 
  Blocks, Bot, Store, BadgeCheck, LogOut
} from "lucide-react";
import { logoutVendor } from "@/app/actions/vendorAuth";

export function SidebarNav({ profile }: { profile: any }) {
  const pathname = usePathname();

  const mainLinks = [
    { name: "Dashboard", href: "/vendor", icon: LayoutDashboard },
    { name: "Orders", href: "/vendor/orders", icon: Package, badge: "38" },
    { name: "Products", href: "/vendor/products", icon: Boxes },
    { name: "AI Agents", href: "/vendor/agents", icon: Bot, badge: "New", badgeColor: "bg-indigo-600" },
    { name: "Customers", href: "/vendor/customers", icon: Users },
    { name: "Analytics", href: "/vendor/analytics", icon: BarChart3 },
    { name: "Marketing", href: "/vendor/marketing", icon: Megaphone },
    { name: "Inventory", href: "/vendor/inventory", icon: Blocks },
  ];

  const financialLinks = [
    { name: "Wallet", href: "/vendor/wallet", icon: Wallet, badge: "₦245,680.00", badgeColor: "bg-green-900/50 text-green-400" },
    { name: "Payouts", href: "/vendor/payouts", icon: ArrowLeftRight },
    { name: "Disputes", href: "/vendor/disputes", icon: AlertCircle },
  ];

  const settingsLinks = [
    { name: "Settings", href: "/vendor/settings", icon: Settings },
    { name: "Integrations", href: "/vendor/integrations", icon: Blocks },
  ];

  const renderLinks = (links: any[]) => (
    <nav className="space-y-1">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? "bg-slate-800 text-white" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <link.icon size={18} className={isActive ? "text-green-500" : "text-slate-500"} />
              <span>{link.name}</span>
            </div>
            {link.badge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${link.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                {link.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <aside className="w-[280px] bg-[#111216] border-r border-slate-800 flex flex-col h-screen overflow-y-auto text-slate-300 scrollbar-hide">
      <div className="p-6">
        <Link href="/vendor" className="flex items-center space-x-2 text-xl font-bold text-white tracking-tight">
          <div className="bg-green-500 p-1.5 rounded-lg">
            <Store className="text-[#111216]" size={20} />
          </div>
          <span>NEXMART<span className="block text-[10px] font-medium text-slate-400 tracking-widest mt-0.5">AGENTIC COMMERCE</span></span>
        </Link>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 flex items-center space-x-3">
          <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Store className="text-green-500" size={20} />
          </div>
          <div>
            <div className="font-semibold text-white text-sm truncate w-32">{profile?.store_name || "Store"}</div>
            <div className="flex items-center space-x-1 text-xs text-green-500 mt-0.5">
              <BadgeCheck size={12} />
              <span>Verified Merchant</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-3 space-y-6">
        {renderLinks(mainLinks)}
        
        <div>
          <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Finance</div>
          {renderLinks(financialLinks)}
        </div>

        <div>
          <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System</div>
          {renderLinks(settingsLinks)}
        </div>
      </div>

      <div className="p-4 mt-8">
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Bot size={100} />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Grow your business with <span className="text-green-400">AI Agents</span></h4>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">Let AI Agents sell, support and grow your business 24/7</p>
          <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium py-2 rounded-lg transition-colors border border-slate-600">
            Manage AI Agents
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <form action={logoutVendor} className="w-full">
          <button type="submit" className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut size={18} className="text-slate-500" />
            <span>Log Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
