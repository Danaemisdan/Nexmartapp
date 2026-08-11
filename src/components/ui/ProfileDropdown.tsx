import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/StoreContext';
import { useUser, useClerk } from '@clerk/nextjs';
export default function ProfileDropdown() {
    const { setAuthModalOpen, navigate } = useStore();
    const { isSignedIn, user } = useUser();
    const { signOut } = useClerk();

    // Helper to format name from email/phone
    const formatName = (identifier: string) => {
        if (!identifier) return 'User';
        if (identifier.includes('@')) {
            const namePart = identifier.split('@')[0];
            return namePart.charAt(0).toUpperCase() + namePart.slice(1);
        }
        return 'User';
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 w-72 bg-white shadow-xl rounded-md border border-gray-100 overflow-hidden z-[100]"
        >
            <div className="p-4 border-b border-gray-100">
                {isSignedIn ? (
                    <>
                        <h3 className="font-bold text-[#111111] text-[15px] mb-1">Hello, {user?.fullName || formatName(user?.primaryEmailAddress?.emailAddress || '')}</h3>
                        <p className="text-[13px] text-gray-500 mb-2">{user?.primaryEmailAddress?.emailAddress || user?.primaryPhoneNumber?.phoneNumber}</p>
                    </>
                ) : (
                    <>
                        <h3 className="font-bold text-[#111111] text-[15px] mb-1">Welcome</h3>
                        <p className="text-[13px] text-gray-500 mb-4">To access account and manage orders</p>
                        <button 
                            onClick={() => setAuthModalOpen(true)}
                            className="w-full py-2.5 bg-white border border-gray-200 hover:border-[#FF6A00] text-[#FF6A00] font-bold text-sm rounded transition-colors"
                        >
                            LOGIN / SIGNUP
                        </button>
                    </>
                )}
            </div>

            <div className="py-2">
                <button onClick={() => navigate('account')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 hover:font-bold transition-all">Orders</button>
                <button onClick={() => navigate('wishlist')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 hover:font-bold transition-all">Wishlist</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 hover:font-bold transition-all">Gift Cards</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 hover:font-bold transition-all">Contact Us</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 hover:font-bold transition-all flex items-center gap-2">
                    Nexmart Insider <span className="bg-[#FF6A00] text-white text-[10px] font-bold px-1.5 py-0.5 rounded italic">New</span>
                </button>
            </div>
            
            {isSignedIn && (
                <div className="border-t border-gray-100 py-2">
                    <button onClick={() => navigate('account')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 hover:font-bold transition-all">Nexmart Credit</button>
                    <button onClick={() => navigate('account')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 hover:font-bold transition-all">Coupons</button>
                    <button onClick={() => navigate('account')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 hover:font-bold transition-all">Saved Cards</button>
                    <button onClick={() => navigate('account')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 hover:font-bold transition-all">Saved VPA</button>
                    <button onClick={() => navigate('account')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-gray-700 hover:font-bold transition-all">Saved Addresses</button>
                </div>
            )}
            
            {isSignedIn && (
                <div className="border-t border-gray-100 py-2">
                    <button onClick={() => { signOut(); navigate('home'); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[14px] text-red-500 hover:text-red-600 hover:font-bold transition-all">Logout</button>
                </div>
            )}
        </motion.div>
    );
}
