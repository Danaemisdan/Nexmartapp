import React, { useState, useRef } from 'react';
import { useStore } from '@/lib/StoreContext';
import { megaMenuData } from '@/lib/navigation';
import MegaMenu from '../ui/MegaMenu';
import { megaMenuAccents } from '@/lib/theme';

export default function CategoryNav() {
    const { navigate } = useStore();
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (id: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveMegaMenu(id);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveMegaMenu(null);
        }, 150); // slight delay to prevent menu flickering when moving cursor
    };

    const activeData = megaMenuData.find(d => d.id === activeMegaMenu);

    return (
        <div className="w-full bg-white border-b border-[#ECECEC] shadow-sm sticky top-[72px] z-40 hidden md:block">
            <div className="max-w-[1800px] mx-auto px-4 md:px-8 relative">
                <nav className="flex items-center justify-between overflow-x-auto hide-scrollbar">
                    {megaMenuData.map((category) => {
                        const accentColor = megaMenuAccents[category.id] || megaMenuAccents.default;
                        const isActive = activeMegaMenu === category.id;
                        
                        return (
                            <button
                                key={category.id}
                                onMouseEnter={() => handleMouseEnter(category.id)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => navigate('categories')}
                                className={`flex items-center justify-center px-4 py-4 text-[13px] font-black uppercase tracking-wider whitespace-nowrap transition-colors relative group ${
                                    isActive ? 'text-[#111111]' : 'text-gray-600 hover:text-[#111111]'
                                }`}
                            >
                                <span>{category.label}</span>
                                {/* Hover Indicator */}
                                <div 
                                    className="absolute bottom-0 left-0 w-full h-[4px] rounded-t-sm transition-transform duration-300 origin-left"
                                    style={{ 
                                        backgroundColor: accentColor,
                                        transform: isActive ? 'scaleX(1)' : 'scaleX(0)'
                                    }} 
                                />
                            </button>
                        );
                    })}
                </nav>

                {/* The Mega Menu Dropdown */}
                {activeData && (
                    <MegaMenu 
                        data={activeData} 
                        isOpen={!!activeMegaMenu} 
                        onMouseEnter={() => handleMouseEnter(activeData.id)}
                        onMouseLeave={handleMouseLeave}
                    />
                )}
            </div>
        </div>
    );
}
