import React from 'react';
import { CreditCard, Info } from 'lucide-react';

export default function NexmartCreditView() {
    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-[#111111]">Nexmart Credit</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your credit balance and transaction history</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Balance Card */}
                <div className="bg-[#111111] text-white p-6 rounded-xl flex-1 flex flex-col justify-between relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CreditCard className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">Available Balance</p>
                        <h3 className="text-4xl font-black">₹0.00</h3>
                    </div>
                    <div className="relative z-10 mt-6 pt-4 border-t border-gray-800">
                        <button className="text-[#FF6A00] font-bold text-sm hover:text-[#E65C00] transition-colors uppercase">
                            + Top Up Balance
                        </button>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-orange-50 border border-[#FF6A00]/20 p-6 rounded-xl flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-[#FF6A00]" />
                        <h4 className="font-bold text-[#111111]">What is Nexmart Credit?</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Nexmart Credit is a fast, seamless way to pay for your orders. Top up your balance to enjoy 1-click checkouts and exclusive cashback offers on select categories.
                    </p>
                </div>
            </div>

            {/* Transaction Log */}
            <div>
                <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Transaction History</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                    No transactions found.
                </div>
            </div>
        </div>
    );
}
