import React from 'react';
import { Package, Heart, CreditCard, Tag } from 'lucide-react';
import { useStore } from '@/lib/StoreContext';

interface AccountOverviewProps {
    onChangeTab: (tab: any) => void;
}

export default function AccountOverview({ onChangeTab }: AccountOverviewProps) {
    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-[#111111]">Account Overview</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your profile, orders, and preferences</p>
                </div>
                <button 
                    onClick={() => onChangeTab('profile')}
                    className="px-4 py-2 border border-gray-200 text-[#111111] hover:border-[#FF6A00] hover:text-[#FF6A00] font-bold text-sm rounded transition-colors"
                >
                    EDIT PROFILE
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                
                {/* Orders Card */}
                <div 
                    onClick={() => onChangeTab('orders')}
                    className="flex items-start gap-4 p-5 rounded-lg border border-gray-100 bg-white hover:shadow-md hover:border-[#FF6A00]/30 transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6A00] transition-colors">
                        <Package className="w-6 h-6 text-[#FF6A00] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#111111] group-hover:text-[#FF6A00] transition-colors">Orders</h3>
                        <p className="text-sm text-gray-500 mt-1">Check your order status, track, or return items</p>
                    </div>
                </div>

                {/* Wishlist Card */}
                <div 
                    onClick={() => onChangeTab('wishlist')}
                    className="flex items-start gap-4 p-5 rounded-lg border border-gray-100 bg-white hover:shadow-md hover:border-[#FF6A00]/30 transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6A00] transition-colors">
                        <Heart className="w-6 h-6 text-[#FF6A00] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#111111] group-hover:text-[#FF6A00] transition-colors">Wishlist</h3>
                        <p className="text-sm text-gray-500 mt-1">Your saved items and collections</p>
                    </div>
                </div>

                {/* Coupons Card */}
                <div 
                    onClick={() => onChangeTab('coupons')}
                    className="flex items-start gap-4 p-5 rounded-lg border border-gray-100 bg-white hover:shadow-md hover:border-[#FF6A00]/30 transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6A00] transition-colors">
                        <Tag className="w-6 h-6 text-[#FF6A00] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#111111] group-hover:text-[#FF6A00] transition-colors">Coupons</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage coupons for additional discounts</p>
                    </div>
                </div>

                {/* Saved Cards Card */}
                <div 
                    onClick={() => onChangeTab('cards')}
                    className="flex items-start gap-4 p-5 rounded-lg border border-gray-100 bg-white hover:shadow-md hover:border-[#FF6A00]/30 transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6A00] transition-colors">
                        <CreditCard className="w-6 h-6 text-[#FF6A00] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#111111] group-hover:text-[#FF6A00] transition-colors">Saved Cards</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage your saved credit & debit cards</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
