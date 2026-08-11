import React from 'react';
import { Wallet } from 'lucide-react';

export default function SavedWalletsView() {
    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-[#111111]">Saved VPA / Wallets</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your saved UPI IDs and Wallets</p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Wallet className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">No Saved VPA / Wallets</h3>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    You have not saved any UPI IDs or Wallets yet. They will be saved automatically when you use them during checkout.
                </p>
                <button className="px-6 py-3 border border-gray-200 text-[#111111] hover:border-[#FF6A00] hover:text-[#FF6A00] font-bold text-sm rounded transition-colors uppercase">
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}
