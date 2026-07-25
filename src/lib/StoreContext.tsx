'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, fetchProducts } from './api';
import { supabaseClient } from './supabaseClient';

export type ViewState = 'home' | 'cart' | 'wishlist' | 'product' | 'categories' | 'deals' | 'orders' | 'search' | 'checkout';

interface CartItem {
    product: Product;
    quantity: number;
}

interface StoreContextType {
    products: Product[];
    cart: CartItem[];
    wishlist: string[];
    orders: string[];
    activeView: ViewState;
    selectedProduct: Product | null;
    comparisonProducts: Product[] | null;
    isApiReady: boolean;
    hasMore: boolean;
    
    loadMoreProducts: () => Promise<void>;
    navigate: (view: ViewState, product?: Product) => void;
    setComparisonProducts: (products: Product[] | null) => void;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleWishlist: (productId: string) => void;
    getCartCount: () => number;
    formatPrice: (price: number) => string;
    addOrder: (orderId: string) => void;
}


const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isApiReady, setIsApiReady] = useState(false);
    const [activeView, setActiveView] = useState<ViewState>('home');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [comparisonProducts, setComparisonProducts] = useState<Product[] | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [orders, setOrders] = useState<string[]>([]);
    const [pageOffset, setPageOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 100;

    useEffect(() => {
        const storedOrders = localStorage.getItem('nexmart_orders');
        if (storedOrders) {
            try {
                setOrders(JSON.parse(storedOrders));
            } catch (e) {
                console.error('Failed to parse stored orders', e);
            }
        }
    }, []);

    useEffect(() => {
        if (orders.length > 0) {
            localStorage.setItem('nexmart_orders', JSON.stringify(orders));
        }
    }, [orders]);

    useEffect(() => {
        async function load() {
            const data = await fetchProducts(LIMIT, 0);
            setProducts(data);
            setPageOffset(LIMIT);
            if (data.length < LIMIT) setHasMore(false);
            setIsApiReady(true);
        }
        load();
        
        // Setup Supabase Realtime Subscription
        if (supabaseClient) {
            const channel = supabaseClient
                .channel('public:products')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'products' },
                    (payload) => {
                        console.log('[Supabase Realtime] Product change received:', payload);
                        
                        setProducts((currentProducts) => {
                            if (payload.eventType === 'INSERT') {
                                // Add new product
                                const exists = currentProducts.some(p => p.id === payload.new.id);
                                if (!exists) return [payload.new as Product, ...currentProducts];
                                return currentProducts;
                            } else if (payload.eventType === 'UPDATE') {
                                // Update existing product
                                return currentProducts.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p);
                            } else if (payload.eventType === 'DELETE') {
                                // Remove deleted product
                                return currentProducts.filter(p => p.id !== payload.old.id);
                            }
                            return currentProducts;
                        });
                    }
                )
                .subscribe((status) => {
                    console.log('[Supabase Realtime] Subscription status:', status);
                });
                
            return () => {
                supabaseClient?.removeChannel(channel);
            };
        }
    }, []);

    const formatPrice = (price: number) => {
        return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const navigate = (view: ViewState, product?: Product) => {
        if (product) setSelectedProduct(product);
        setActiveView(view);
    };

    const addToCart = (product: Product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prev, { product, quantity }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) return removeFromCart(productId);
        setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
    };

    const clearCart = () => setCart([]);

    const toggleWishlist = (productId: string) => {
        setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };

    const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);

    const addOrder = (orderId: string) => {
        setOrders(prev => {
            if (prev.includes(orderId)) return prev;
            return [orderId, ...prev];
        });
    };

    const loadMoreProducts = async () => {
        if (!hasMore) return;
        const newProducts = await fetchProducts(LIMIT, pageOffset);
        if (newProducts.length > 0) {
            setProducts(prev => {
                // Ensure no duplicates
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueNew = newProducts.filter(p => !existingIds.has(p.id));
                return [...prev, ...uniqueNew];
            });
            setPageOffset(prev => prev + LIMIT);
        }
        if (newProducts.length < LIMIT) {
            setHasMore(false);
        }
    };

    return (
        <StoreContext.Provider value={{
            products, cart, wishlist, orders,
        activeView,
        selectedProduct,
        comparisonProducts,
        isApiReady,
        hasMore,
        loadMoreProducts,
        navigate,
        setComparisonProducts,
        addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist, getCartCount,
            formatPrice, addOrder
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) throw new Error('useStore must be used within a StoreProvider');
    return context;
}
