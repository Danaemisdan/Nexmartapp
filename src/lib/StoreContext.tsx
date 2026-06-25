'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, fetchProducts } from './api';

export type ViewState = 'home' | 'cart' | 'wishlist' | 'product';

interface CartItem {
    product: Product;
    quantity: number;
}

interface StoreContextType {
    products: Product[];
    cart: CartItem[];
    wishlist: string[];
    activeView: ViewState;
    selectedProduct: Product | null;
    isApiReady: boolean;
    
    navigate: (view: ViewState, product?: Product) => void;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleWishlist: (productId: string) => void;
    getCartCount: () => number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isApiReady, setIsApiReady] = useState(false);
    const [activeView, setActiveView] = useState<ViewState>('home');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);

    useEffect(() => {
        async function load() {
            const data = await fetchProducts();
            setProducts(data);
            setIsApiReady(true);
        }
        load();
    }, []);

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

    return (
        <StoreContext.Provider value={{
            products, cart, wishlist, activeView, selectedProduct, isApiReady,
            navigate, addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist, getCartCount
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
