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
import { AnimatePresence, motion } from 'framer-motion';

export type WorkflowState = 'IDLE' | 'RESEARCHING' | 'NEGOTIATING' | 'READY' | 'TALKING' | 'LISTENING';

interface DashboardProps {
    isLoggedIn: boolean;
    onOpenAuth: () => void;
}

// Internal component that uses the Store context
function DashboardContent({ isLoggedIn, onOpenAuth }: DashboardProps) {
    const [workflowState, setWorkflowState] = useState<WorkflowState>('IDLE');
    const [currentTask, setCurrentTask] = useState('');
    const [aiProducts, setAiProducts] = useState<any[]>([]);
    
    // AI Engine state
    const [isAiReady, setIsAiReady] = useState(false);
    const [aiProgress, setAiProgress] = useState('Booting OS...');

    const { activeView } = useStore();

    return (
        <div className="h-full w-full overflow-y-auto bg-white flex flex-col hide-scrollbar relative">
            <Header isLoggedIn={isLoggedIn} onOpenAuth={onOpenAuth} />
            
            <main className="flex-1 flex flex-col relative">
                {/* AgentOrb is persistent across all views, living in the main content space but overlaying it */}
                <AgentOrb 
                    workflowState={workflowState}
                    setWorkflowState={setWorkflowState}
                    setCurrentTask={setCurrentTask}
                    setAiProducts={setAiProducts}
                    setIsAiReady={setIsAiReady}
                    setAiProgress={setAiProgress}
                    aiProgress={aiProgress}
                    isAiReady={isAiReady}
                    inline={false}
                />

                <AnimatePresence mode="wait">
                    {activeView === 'home' && (
                        <motion.div key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1">
                            <HomeView aiProducts={aiProducts} />
                        </motion.div>
                    )}
                    {activeView === 'cart' && (
                        <motion.div key="cart" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="flex-1">
                            <CartView />
                        </motion.div>
                    )}
                    {activeView === 'wishlist' && (
                        <motion.div key="wishlist" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="flex-1">
                            <WishlistView />
                        </motion.div>
                    )}
                    {activeView === 'product' && (
                        <motion.div key="product" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="flex-1">
                            <ProductDetailsView />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            
            <BottomNav />
        </div>
    );
}

// Export the wrapper
export default function Dashboard(props: DashboardProps) {
    return (
        <StoreProvider>
            <DashboardContent {...props} />
        </StoreProvider>
    );
}
