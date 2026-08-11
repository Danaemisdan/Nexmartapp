'use client'
import React, { useState } from 'react';
import { StoreProvider, useStore } from '@/lib/StoreContext';
import HomeView from '../views/HomeView';
import CartView from '../views/CartView';
import WishlistView from '../views/WishlistView';
import ProductDetailsView from '../views/ProductDetailsView';
import CategoriesView from '../views/CategoriesView';
import OrdersView from '../views/OrdersView';
import DealsView from '../views/DealsView';
import SearchView from '../views/SearchView';
import CheckoutView from '../views/CheckoutView';
import AccountView from '../views/AccountView';
import ComparisonOverlay from '../ui/ComparisonOverlay';
import MarketplaceHeader from './MarketplaceHeader';
import CategoryNav from './CategoryNav';
import MarketplaceFooter from './MarketplaceFooter';
import AgentOrb from '../os/AgentOrb';
import MarketplaceToast from '../ui/MarketplaceToast';
import AuthModal from '../ui/AuthModal';
import AddressModal from '../ui/AddressModal';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchContextManager } from '@/lib/SearchContextManager';

export type WorkflowState = 'IDLE' | 'RESEARCHING' | 'NEGOTIATING' | 'READY' | 'TALKING' | 'LISTENING';

function DashboardContent() {
    const [workflowState, setWorkflowState] = useState<WorkflowState>('IDLE');
    const [currentTask, setCurrentTask] = useState('');
    const [aiProducts, setAiProducts] = useState<any[]>([]);
    
    // AI Engine state
    const [isAiReady, setIsAiReady] = useState(false);
    const [aiProgress, setAiProgress] = useState('Booting OS...');

    const { activeView, navigate, addOrder, clearCart } = useStore();

    const handleGoHome = () => {
        setAiProducts([]);
        SearchContextManager.clear();
        navigate('home');
    };

    // Check for payment redirect on load
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('payment') === 'success') {
            const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
            addOrder(orderId);
            clearCart();
            navigate('orders');
            // Clean up URL without reload
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    // Create the AI component once to keep it mounted in the DOM
    const agentComponent = (
        <AgentOrb
            workflowState={workflowState}
            setWorkflowState={setWorkflowState}
            setCurrentTask={setCurrentTask}
            aiProducts={aiProducts}
            setAiProducts={setAiProducts}
            setIsAiReady={setIsAiReady}
            setAiProgress={setAiProgress}
            aiProgress={aiProgress}
            isAiReady={isAiReady}
        />
    );

    return (
        <div className="h-full w-full bg-white flex flex-col relative overflow-hidden font-sans">
            <ComparisonOverlay />

            <div className="relative z-10 flex flex-col h-full w-full overflow-hidden">
                <MarketplaceHeader />
                <CategoryNav />
                
                <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col relative bg-[#F8F8F8]">
                    <main className="flex-1 flex flex-col w-full relative">
                        <AnimatePresence mode="wait">
                            {activeView === 'home' && (
                                <motion.div key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col">
                                    <HomeView aiProducts={aiProducts} />
                                </motion.div>
                            )}
                            {activeView === 'cart' && (
                                <motion.div key="cart" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="flex-1">
                                    <CartView />
                                </motion.div>
                            )}
                            {activeView === 'wishlist' && (
                                <motion.div key="wishlist" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="flex-1">
                                    <WishlistView />
                                </motion.div>
                            )}
                            {activeView === 'product' && (
                                <motion.div key="product" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="flex-1">
                                    <ProductDetailsView />
                                </motion.div>
                            )}
                            {activeView === 'categories' && (
                                <motion.div key="categories" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} className="flex-1">
                                    <CategoriesView />
                                </motion.div>
                            )}
                            {activeView === 'orders' && (
                                <motion.div key="orders" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="flex-1">
                                    <OrdersView />
                                </motion.div>
                            )}
                            {activeView === 'deals' && (
                                <motion.div key="deals" initial={{opacity:0, scale:1.05}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="flex-1">
                                    <DealsView />
                                </motion.div>
                            )}
                            {activeView === 'search' && (
                                <motion.div key="search" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1">
                                    <SearchView />
                                </motion.div>
                            )}
                            {(activeView === 'checkout' || activeView === 'checkout_address' || activeView === 'checkout_payment') && (
                                <motion.div key="checkout" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="flex-1 w-full flex">
                                    <CheckoutView />
                                </motion.div>
                            )}
                            {activeView === 'account' && (
                                <motion.div key="account" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 w-full flex">
                                    <AccountView />
                                </motion.div>
                            )}
                            {activeView === 'login' && (
                                <motion.div key="login" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1">
                                    <div className="flex items-center justify-center h-full">Login Placeholder</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                    
                    <MarketplaceFooter />
                </div>
            </div>

            {/* Global Modals and Toasts */}
            <MarketplaceToast />
            <AuthModal />
            <AddressModal />

            {/* Global Floating AI Orb */}
            {agentComponent}
        </div>
    );
}

// Export the wrapper
export default function Dashboard() {
    return (
        <StoreProvider>
            <DashboardContent />
        </StoreProvider>
    );
}
