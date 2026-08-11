import React from 'react';

export default function DeleteAccountView() {
    return (
        <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-300">
            <h2 className="text-3xl font-black text-[#111111] mb-2">Is this goodbye?</h2>
            <p className="text-gray-500 mb-8 max-w-md text-center text-sm">
                Are you sure you want to delete your account? This action is permanent and cannot be undone. All your order history, nexmart credit, and saved details will be lost.
            </p>

            <img 
                src="/placeholders/delete-account.png" 
                alt="Delete Account Warning" 
                className="w-48 h-48 object-contain mb-8 opacity-80 mix-blend-multiply"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />

            <div className="flex gap-4 w-full max-w-sm">
                <button className="flex-1 py-3 border-2 border-gray-200 text-[#111111] hover:border-gray-400 font-bold rounded-lg transition-colors">
                    KEEP ACCOUNT
                </button>
                <button className="flex-1 py-3 bg-[#FF6A00] hover:bg-[#E65C00] text-white font-bold rounded-lg transition-colors shadow-sm">
                    DELETE ANYWAY
                </button>
            </div>
        </div>
    );
}
