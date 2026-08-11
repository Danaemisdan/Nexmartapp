import React from 'react';
import { Wallet, Info } from 'lucide-react';

export default function NexmartCashView() {
    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-[#111111]">Nexmart Cash</h2>
                    <p className="text-sm text-gray-500 mt-1">View your earned cashback and refunds</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Balance Card */}
                <div className="bg-[#00BFA5] text-white p-6 rounded-xl flex-1 flex flex-col justify-between relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[#E0F2F1] font-medium text-sm mb-1 uppercase tracking-wider">Total Cash</p>
                        <h3 className="text-4xl font-black">₹0.00</h3>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-teal-50 border border-[#00BFA5]/20 p-6 rounded-xl flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-[#00BFA5]" />
                        <h4 className="font-bold text-[#111111]">How it works?</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Nexmart Cash is earned through special promotions or refunds. 1 Nexmart Cash = ₹1. It can be used to pay for up to 100% of your order value on any purchase.
                    </p>
                </div>
            </div>

            {/* Ledger */}
            <div>
                <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Cash Ledger</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                    No cash history found.
                </div>
            </div>
        </div>
    );
}
