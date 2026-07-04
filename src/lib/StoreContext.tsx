'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, fetchProducts } from './api';

export type ViewState = 'home' | 'cart' | 'wishlist' | 'product' | 'categories' | 'deals' | 'orders' | 'search';

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
    isApiReady: boolean;
    isAuthModalOpen: boolean;
    
    setIsAuthModalOpen: (status: boolean) => void;
    navigate: (view: ViewState, product?: Product) => void;
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
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [orders, setOrders] = useState<string[]>([]);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
            const data = await fetchProducts();
            setProducts(data);
            setIsApiReady(true);
        }
        load();
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

    return (
        <StoreContext.Provider value={{
            products, cart, wishlist, orders, activeView, selectedProduct, isApiReady, isAuthModalOpen,
            setIsAuthModalOpen, navigate, addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist, getCartCount,
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
