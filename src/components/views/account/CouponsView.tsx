import React, { useState } from 'react';
import { Tag } from 'lucide-react';

export default function CouponsView() {
    const [activeTab, setActiveTab] = useState<'available' | 'used'>('available');

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-[#111111]">Coupons</h2>
                    <p className="text-sm text-gray-500 mt-1">View all your saved coupons and offers</p>
                </div>
            </div>

            <div className="flex gap-8 mb-6 border-b border-gray-100">
                <button 
                    onClick={() => setActiveTab('available')}
                    className={`pb-4 text-sm font-bold uppercase transition-colors relative ${activeTab === 'available' ? 'text-[#FF6A00]' : 'text-gray-400 hover:text-[#111111]'}`}
                >
                    AVAILABLE (2)
                    {activeTab === 'available' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6A00]" />}
                </button>
                <button 
                    onClick={() => setActiveTab('used')}
                    className={`pb-4 text-sm font-bold uppercase transition-colors relative ${activeTab === 'used' ? 'text-[#FF6A00]' : 'text-gray-400 hover:text-[#111111]'}`}
                >
                    EXPIRED / USED
                    {activeTab === 'used' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6A00]" />}
                </button>
            </div>

            <div className="flex flex-col gap-4 max-w-2xl">
                {activeTab === 'available' && (
                    <>
                        <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow relative overflow-hidden bg-white group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6A00]" />
                            <div className="flex justify-between items-start mb-4 pl-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                                        <Tag className="w-5 h-5 text-[#FF6A00]" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-[#111111] bg-gray-100 px-2 py-1 border border-gray-200 border-dashed rounded text-xs tracking-widest uppercase">WELCOME400</span>
                                        <p className="text-sm font-bold text-[#111111] mt-1">Flat ₹400 OFF on your first order</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Expires in 2 days</span>
                            </div>
                            <p className="text-xs text-gray-500 pl-3 leading-relaxed">
                                Valid on a minimum spend of ₹1,999. Applicable on select products. Cannot be combined with other offers.
                            </p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow relative overflow-hidden bg-white group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00BFA5]" />
                            <div className="flex justify-between items-start mb-4 pl-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center">
                                        <Tag className="w-5 h-5 text-[#00BFA5]" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-[#111111] bg-gray-100 px-2 py-1 border border-gray-200 border-dashed rounded text-xs tracking-widest uppercase">SAVE10</span>
                                        <p className="text-sm font-bold text-[#111111] mt-1">Extra 10% OFF on Fashion</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-400">Valid till 31 Dec 2026</span>
                            </div>
                            <p className="text-xs text-gray-500 pl-3 leading-relaxed">
                                Valid on all fashion categories. Max discount ₹500.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
