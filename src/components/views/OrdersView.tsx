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
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('home')}
                        className="p-2 -ml-2 bg-gray-50 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Your Orders</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <Loader2 className="w-8 h-8 text-[#1e3a8a] animate-spin" />
                        <p className="text-gray-500 font-medium">Loading your order history...</p>
                    </div>
                ) : orderDetails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="w-20 h-20 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-2">
                            <Package className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">No orders yet</h2>
                        <p className="text-gray-500 max-w-md">When you buy items, they will appear here along with their status.</p>
                        <button 
                            onClick={() => navigate('home')}
                            className="mt-4 px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orderDetails.map((order, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                                
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Reference</span>
                                            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{order.group_order_reference}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {new Date(order.date_created).toLocaleString()}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            {order.status === 'cancelled' ? <X className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                            {order.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                                        </div>
                                        
                                        {order.status !== 'cancelled' && (
                                            <button 
                                                onClick={() => handleCancel(order.group_order_reference)}
                                                className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                                            >
                                                <X className="w-3.5 h-3.5" /> Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="flex flex-col gap-4">
                                    <h4 className="font-bold text-gray-900 text-sm mb-2">Items</h4>
                                    {order.items?.map((item: any, itemIdx: number) => (
                                        <div key={itemIdx} className="flex items-center justify-between bg-gray-50/50 border border-gray-100 p-4 rounded-2xl">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-xl shadow-sm shrink-0">
                                                    📦
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-gray-900 line-clamp-1">{item.product_name || 'Item'}</h5>
                                                    <p className="text-sm text-gray-500">Qty: <span className="font-bold text-gray-700">{item.qty}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                <span className="font-bold text-gray-900">{formatPrice(parseFloat(item.total_cost || 0))}</span>
                                                {order.status !== 'cancelled' && item.qty > 0 && (
                                                    <button 
                                                        onClick={() => handleReturnItem(order.group_order_reference, item.order_id)}
                                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
                                                    >
                                                        <RotateCcw className="w-3 h-3" /> Return 1x
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <span className="font-medium text-gray-500">Total Amount</span>
                                    <span className={`text-xl font-black ${order.status === 'cancelled' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
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
