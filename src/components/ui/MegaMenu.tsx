import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavData, NavTab, NavColumn } from '@/lib/navigation';
import { megaMenuAccents } from '@/lib/theme';
import { useStore } from '@/lib/StoreContext';

interface MegaMenuProps {
    data: NavData;
    isOpen: boolean;
    onMouseLeave: () => void;
    onMouseEnter: () => void;
}

export default function MegaMenu({ data, isOpen, onMouseLeave, onMouseEnter }: MegaMenuProps) {
    const { navigate } = useStore();
    const accentColor = megaMenuAccents[data.id] || megaMenuAccents.default;
    
    // For tabbed navigation (e.g., Fashion: Men, Women, Kids)
    const hasTabs = data.tabs && data.tabs.length > 0;
    const [activeTabId, setActiveTabId] = useState<string>(hasTabs ? data.tabs![0].id : '');

    if (!isOpen) return null;

    const activeTab = hasTabs ? data.tabs!.find(t => t.id === activeTabId) : null;
    const columnsToRender = hasTabs ? activeTab?.columns || [] : data.columns || [];

    return (
        <div 
            className="absolute left-0 top-full w-full bg-white shadow-2xl border-t border-gray-100 z-50 overflow-hidden"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="max-w-[1800px] mx-auto flex h-[500px]">
                
                {/* Left Sidebar: Tabs (Only if tabs exist) */}
                {hasTabs && (
                    <div className="w-[200px] bg-gray-50 flex flex-col py-6 shrink-0 border-r border-gray-100">
                        {data.tabs!.map(tab => (
                            <button
                                key={tab.id}
                                onMouseEnter={() => setActiveTabId(tab.id)}
                                onClick={() => navigate('categories')}
                                className={`text-left px-8 py-3 font-bold text-sm transition-all relative ${
                                    activeTabId === tab.id 
                                    ? 'text-[#111111] bg-white' 
                                    : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                {activeTabId === tab.id && (
                                    <motion.div 
                                        layoutId="activeTabIndicator"
                                        className="absolute left-0 top-0 bottom-0 w-1 rounded-r-md"
                                        style={{ backgroundColor: accentColor }}
                                    />
                                )}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 p-8 bg-white relative overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={hasTabs ? activeTabId : data.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-wrap gap-x-12 gap-y-8"
                        >
                            {columnsToRender.map((col, colIdx) => (
                                <div key={colIdx} className="flex flex-col gap-6 min-w-[200px]">
                                    {col.sections.map((section, secIdx) => (
                                        <div key={secIdx} className="flex flex-col">
                                            <h3 
                                                className="font-black text-[14px] mb-3 pb-1 border-b border-gray-100"
                                                style={{ color: accentColor }}
                                            >
                                                {section.title}
                                            </h3>
                                            <ul className="flex flex-col gap-1.5">
                                                {section.links.map((link, linkIdx) => (
                                                    <li key={linkIdx}>
                                                        <a 
                                                            href={link.href}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                navigate('categories');
                                                            }}
                                                            className="text-[13px] text-gray-600 hover:text-[#111111] hover:font-bold transition-all inline-block py-0.5"
                                                        >
                                                            {link.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Optional Promotional Image Panel (Hidden on smaller screens) */}
                <div className="hidden lg:block w-[300px] bg-gray-50 shrink-0 p-6 border-l border-gray-100">
                    <div className="w-full h-full rounded-lg overflow-hidden relative group cursor-pointer" onClick={() => navigate('categories')}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <img 
                            src={`/placeholders/cat-${data.id}.jpg`} 
                            alt={`${data.label} promo`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute bottom-6 left-6 right-6 z-20">
                            <h4 className="text-white font-black text-xl mb-1 leading-tight">New Arrivals in {data.label}</h4>
                            <p className="text-white/80 text-sm font-medium">Explore Collection →</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
