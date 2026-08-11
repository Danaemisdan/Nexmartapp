import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { 
    User, Package, Heart, CreditCard, Wallet, MapPin, 
    Bell, Power, Tag, ShieldAlert, ArrowLeft
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import AccountOverview from './account/AccountOverview';
import ProfileDetails from './account/ProfileDetails';
import AddressesView from './account/AddressesView';
import SavedCardsView from './account/SavedCardsView';
import SavedWalletsView from './account/SavedWalletsView';
import CouponsView from './account/CouponsView';
import NexmartCreditView from './account/NexmartCreditView';
import NexmartCashView from './account/NexmartCashView';
import DeleteAccountView from './account/DeleteAccountView';
import OrdersView from './account/OrdersView';

export type AccountSubView = 
    'overview' | 'profile' | 'orders' | 'wishlist' | 
    'credit' | 'cash' | 'cards' | 'wallets' | 'coupons' | 
    'addresses' | 'notifications' | 'delete';

export default function AccountView() {
    const { navigate, showToast, setAuthModalOpen } = useStore();
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const [activeTab, setActiveTab] = useState<AccountSubView>('overview');

    if (!isLoaded) return <div className="h-[70vh] flex items-center justify-center">Loading...</div>;

    if (!isSignedIn) {
        return (
            <div className="flex flex-col items-center justify-center pt-24 h-[70vh] bg-white w-full">
                <div className="w-20 h-20 bg-[#F8F8F8] border border-[#ECECEC] rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <User className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-3xl font-black text-[#111111] mb-3">Sign in to access your account</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">You need an account to view profile details, manage orders, and save cards.</p>
                <button onClick={() => setAuthModalOpen(true)} className="px-8 py-4 bg-[#FF6A00] hover:bg-[#E65C00] text-white rounded-full font-bold transition-all shadow-sm">
                    Sign In Now
                </button>
            </div>
        );
    }

    const handleLogout = async () => {
        await signOut();
        showToast('Successfully logged out', 'success');
        navigate('home');
    };

    const sidebarSections = [
        {
            title: "ORDERS",
            items: [
                { id: 'orders', label: "Orders & Returns", icon: Package }
            ]
        },
        {
            title: "CREDITS",
            items: [
                { id: 'coupons', label: "Coupons", icon: Tag },
                { id: 'credit', label: "Nexmart Credit", icon: CreditCard },
                { id: 'cash', label: "Nexmart Cash", icon: Wallet },
            ]
        },
        {
            title: "ACCOUNT",
            items: [
                { id: 'profile', label: "Profile", icon: User },
                { id: 'cards', label: "Saved Cards", icon: CreditCard },
                { id: 'wallets', label: "Saved VPA", icon: Wallet },
                { id: 'addresses', label: "Addresses", icon: MapPin },
                { id: 'notifications', label: "Notifications", icon: Bell },
            ]
        }
    ];

    return (
        <div className="flex flex-col h-full bg-[#F8F8F8] pb-24 md:pb-0 min-h-screen text-[#111111]">
            <div className="sticky top-0 bg-white border-b border-[#ECECEC] z-10 px-6 py-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4 max-w-[1400px] mx-auto w-full">
                    <button 
                        onClick={() => navigate('home')}
                        className="p-2 -ml-2 bg-white hover:bg-gray-50 border border-[#ECECEC] text-[#111111] rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold text-[#111111]">Your Account</h1>
                </div>
            </div>
            
            <div className="flex-1 max-w-[1200px] mx-auto px-4 py-8 w-full">
            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Sidebar */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                        
                        {/* User Summary */}
                        <div 
                            onClick={() => setActiveTab('overview')}
                            className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${activeTab === 'overview' ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                        >
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                <User className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-[#111111] text-sm">{user?.fullName || 'Guest User'}</span>
                                <span className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress || user?.primaryPhoneNumber?.phoneNumber || ''}</span>
                            </div>
                        </div>

                        {/* Navigation Sections */}
                        {sidebarSections.map((section, idx) => (
                            <div key={idx} className="py-2">
                                <div className="px-4 py-2">
                                    <span className="text-[11px] font-bold text-gray-400 tracking-wider">{section.title}</span>
                                </div>
                                {section.items.map(item => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id as AccountSubView)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                                                ${isActive ? 'text-[#FF6A00] font-bold bg-orange-50/50 border-r-2 border-[#FF6A00]' : 'text-gray-600 hover:text-[#111111] hover:bg-gray-50 font-medium'}
                                            `}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}

                        {/* Settings & Logout */}
                        <div className="py-2">
                            <div className="px-4 py-2">
                                <span className="text-[11px] font-bold text-gray-400 tracking-wider">SETTINGS</span>
                            </div>
                            <button
                                onClick={() => setActiveTab('delete')}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                                    ${activeTab === 'delete' ? 'text-red-600 font-bold bg-red-50/50 border-r-2 border-red-600' : 'text-gray-600 hover:text-[#111111] hover:bg-gray-50 font-medium'}
                                `}
                            >
                                <ShieldAlert className="w-4 h-4" />
                                Delete Account
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 font-medium transition-colors"
                            >
                                <Power className="w-4 h-4" />
                                Logout
                            </button>
                        </div>

                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-h-[500px]">
                        {activeTab === 'overview' && <AccountOverview onChangeTab={setActiveTab} />}
                        {activeTab === 'profile' && <ProfileDetails />}
                        {activeTab === 'addresses' && <AddressesView />}
                        {activeTab === 'cards' && <SavedCardsView />}
                        {activeTab === 'wallets' && <SavedWalletsView />}
                        {activeTab === 'coupons' && <CouponsView />}
                        {activeTab === 'credit' && <NexmartCreditView />}
                        {activeTab === 'cash' && <NexmartCashView />}
                        {activeTab === 'delete' && <DeleteAccountView />}
                        {activeTab === 'orders' && <OrdersView />}
                        {activeTab === 'wishlist' && <div className="p-4 text-center text-gray-500">Redirecting to Wishlist...</div>}
                        {activeTab === 'notifications' && <div className="p-4 text-center text-gray-500">No new notifications</div>}
                    </div>
                </main>
            </div>
        </div>
        </div>
    );
}
