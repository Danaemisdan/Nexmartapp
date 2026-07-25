'use client'
import React, { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import AgentOrb from '../os/AgentOrb';
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
import ComparisonOverlay from '../ui/ComparisonOverlay';
import FloatingProducts from './FloatingProducts';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchContextManager } from '@/lib/SearchContextManager';

export type WorkflowState = 'IDLE' | 'RESEARCHING' | 'NEGOTIATING' | 'READY' | 'TALKING' | 'LISTENING';

// Internal component that uses the Store context
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

    return (
        <div className="h-full w-full overflow-hidden bg-transparent text-white flex flex-col relative p-0 md:p-6 lg:p-8">
            <FloatingProducts />
            <ComparisonOverlay />

            {/* Central Glass Command Center */}
            <div className="relative z-10 flex flex-col h-full w-full max-w-[1600px] mx-auto bg-white/5 backdrop-blur-sm md:border md:border-white/10 md:rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
                <Header onLogoClick={handleGoHome} />
                
                <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col relative">
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
                        inline={false}
                    />
                    
                    <main className="flex-1 flex flex-col relative">
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
                            {activeView === 'checkout' && (
                                <motion.div key="checkout" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="flex-1">
                                    <CheckoutView />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
                
                <BottomNav onHomeClick={handleGoHome} />
            </div>
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
