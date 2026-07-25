'use client'
import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { Package, X, RotateCcw, Loader2, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function OrdersView() {
    const { orders, formatPrice, navigate } = useStore();
    const [orderDetails, setOrderDetails] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        setIsLoading(true);
        const fetched = [];
        for (const orderId of orders) {
            try {
                const res = await fetch(`/api/orders/${orderId}`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data) fetched.push(json.data);
                }
            } catch (e) {
                console.error('Failed to fetch order', orderId, e);
            }
        }
        setOrderDetails(fetched);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [orders]);

    const handleCancel = async (orderId: string) => {
        toast.promise(
            fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' }).then(async res => {
                if (!res.ok) throw new Error('Failed');
                await fetchOrders();
            }),
            {
                loading: 'Cancelling order...',
                success: 'Order cancelled successfully!',
                error: 'Failed to cancel order.'
            }
        );
    };

    const handleReturnItem = async (groupOrderId: string, itemOrderId: string) => {
        const payload = [{ order_id: itemOrderId, return_quantity: 1 }];
        toast.promise(
            fetch(`/api/orders/${groupOrderId}/return`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(async res => {
                if (!res.ok) throw new Error('Failed');
                await fetchOrders();
            }),
            {
                loading: 'Processing return...',
                success: 'Item returned successfully!',
                error: 'Failed to return item. Check if quantity is valid.'
            }
        );
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50 pb-24 md:pb-0">
            {/* Header */}
            <div className="sticky top-0 bg-white/5 backdrop-blur-xl border-b border-white/10 z-10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('home')}
                        className="p-2 -ml-2 bg-white/5 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Your Orders</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                        <p className="text-gray-300 font-medium">Loading your order history...</p>
                    </div>
                ) : orderDetails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4 bg-white/5 rounded-3xl border border-white/10 shadow-xl p-8 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center mb-2 border border-blue-500/30">
                            <Package className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">No orders yet</h2>
                        <p className="text-gray-400 max-w-md">When you buy items, they will appear here along with their status.</p>
                        <button 
                            onClick={() => navigate('home')}
                            className="mt-4 px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orderDetails.map((order, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 shadow-xl hover:bg-white/10 transition-all backdrop-blur-sm">
                                
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Reference</span>
                                            <span className="text-xs font-mono bg-white/10 text-gray-300 px-2 py-0.5 rounded-md border border-white/10">{order.group_order_reference}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {new Date(order.date_created).toLocaleString()}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${order.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                                            {order.status === 'cancelled' ? <X className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                            {order.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                                        </div>
                                        
                                        {order.status !== 'cancelled' && (
                                            <button 
                                                onClick={() => handleCancel(order.group_order_reference)}
                                                className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                                            >
                                                <X className="w-3.5 h-3.5" /> Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="flex flex-col gap-4">
                                    <h4 className="font-bold text-white text-sm mb-2">Items</h4>
                                    {order.items?.map((item: any, itemIdx: number) => (
                                        <div key={itemIdx} className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center text-xl shadow-sm shrink-0">
                                                    📦
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-white line-clamp-1">{item.product_name || 'Item'}</h5>
                                                    <p className="text-sm text-gray-400">Qty: <span className="font-bold text-gray-200">{item.qty}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                <span className="font-bold text-white">{formatPrice(parseFloat(item.total_cost || 0))}</span>
                                                {order.status !== 'cancelled' && item.qty > 0 && (
                                                    <button 
                                                        onClick={() => handleReturnItem(order.group_order_reference, item.order_id)}
                                                        className="text-[10px] font-bold text-blue-300 hover:text-blue-200 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
                                                    >
                                                        <RotateCcw className="w-3 h-3" /> Return 1x
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                                    <span className="font-medium text-gray-300">Total Amount</span>
                                    <span className={`text-xl font-black ${order.status === 'cancelled' ? 'text-gray-400 line-through' : 'text-white'}`}>
                                        {formatPrice(parseFloat(order.total_amount || 0))}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
