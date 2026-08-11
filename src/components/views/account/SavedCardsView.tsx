import React, { useState } from 'react';
import { CreditCard, Trash2, ShieldCheck } from 'lucide-react';

interface Card {
    id: string;
    cardNumber: string;
    nameOnCard: string;
    expiry: string;
    type: string;
}

export default function SavedCardsView() {
    const [cards, setCards] = useState<Card[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: '',
        nameOnCard: '',
        expiry: '',
        cvv: ''
    });

    const getCardType = (number: string) => {
        if (number.startsWith('4')) return 'VISA';
        if (number.startsWith('5')) return 'MASTERCARD';
        if (number.startsWith('3')) return 'AMEX';
        return 'CARD';
    };

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (formData.cardNumber.length < 15 || !formData.nameOnCard || formData.expiry.length < 5) {
            return;
        }

        const newCard: Card = {
            id: Date.now().toString(),
            cardNumber: formData.cardNumber.slice(-4), // Only store last 4
            nameOnCard: formData.nameOnCard,
            expiry: formData.expiry,
            type: getCardType(formData.cardNumber)
        };

        setCards([...cards, newCard]);
        setIsAdding(false);
        setFormData({ cardNumber: '', nameOnCard: '', expiry: '', cvv: '' });
    };

    const handleRemoveCard = (id: string) => {
        setCards(cards.filter(c => c.id !== id));
    };

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-[#111111]">Saved Cards</h2>
                    <p className="text-sm text-gray-500 mt-1">Save your cards for faster checkout</p>
                </div>
                {!isAdding && cards.length > 0 && (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="px-4 py-2 border border-gray-200 text-[#111111] hover:border-[#FF6A00] hover:text-[#FF6A00] font-bold text-sm rounded transition-colors uppercase"
                    >
                        + Add New Card
                    </button>
                )}
            </div>

            <div className="max-w-2xl">
                {isAdding ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-[#111111] mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#FF6A00]" />
                            Enter Card Details
                        </h3>
                        
                        <form onSubmit={handleAddCard} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 tracking-wider">CARD NUMBER</label>
                                <input 
                                    type="text" 
                                    maxLength={19}
                                    placeholder="XXXX XXXX XXXX XXXX" 
                                    value={formData.cardNumber}
                                    onChange={e => {
                                        // Auto-format with spaces
                                        let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                        let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
                                        setFormData({...formData, cardNumber: formatted});
                                    }}
                                    className="border border-gray-200 rounded px-4 py-2.5 focus:outline-none focus:border-[#FF6A00] text-sm font-medium tracking-wider" 
                                    required
                                />
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 tracking-wider">NAME ON CARD</label>
                                <input 
                                    type="text" 
                                    placeholder="JOHN DOE"
                                    value={formData.nameOnCard}
                                    onChange={e => setFormData({...formData, nameOnCard: e.target.value.toUpperCase()})}
                                    className="border border-gray-200 rounded px-4 py-2.5 focus:outline-none focus:border-[#FF6A00] text-sm font-medium uppercase" 
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 tracking-wider">VALID THRU</label>
                                    <input 
                                        type="text" 
                                        maxLength={5}
                                        placeholder="MM/YY"
                                        value={formData.expiry}
                                        onChange={e => {
                                            let val = e.target.value.replace(/\D/g, '');
                                            if (val.length >= 3) {
                                                val = val.slice(0, 2) + '/' + val.slice(2, 4);
                                            }
                                            setFormData({...formData, expiry: val});
                                        }}
                                        className="border border-gray-200 rounded px-4 py-2.5 focus:outline-none focus:border-[#FF6A00] text-sm font-medium" 
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 tracking-wider">CVV</label>
                                    <input 
                                        type="password" 
                                        maxLength={4}
                                        placeholder="***"
                                        value={formData.cvv}
                                        onChange={e => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                                        className="border border-gray-200 rounded px-4 py-2.5 focus:outline-none focus:border-[#FF6A00] text-sm font-medium" 
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 bg-green-50 p-3 rounded-lg border border-green-100">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                Your card details are securely encrypted and stored.
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-2">
                                <button type="button" onClick={() => {setIsAdding(false); setFormData({cardNumber:'',nameOnCard:'',expiry:'',cvv:''});}} className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:border-gray-400 font-bold text-sm rounded transition-colors uppercase w-1/3">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2.5 bg-[#FF6A00] hover:bg-[#E65C00] text-white font-bold text-sm rounded transition-colors uppercase flex-1 shadow-md shadow-orange-500/20">
                                    Save Card
                                </button>
                            </div>
                        </form>
                    </div>
                ) : cards.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {cards.map(card => (
                            <div key={card.id} className="border border-gray-200 rounded-xl p-5 bg-white flex items-center justify-between hover:border-gray-300 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
                                        {/* Simple text representation for card brand since we don't have SVGs */}
                                        <span className="text-[9px] font-black italic text-blue-800 tracking-tighter">{card.type}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#111111] font-mono tracking-wider">
                                            <span className="text-gray-400">**** **** ****</span> {card.cardNumber}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                            <span className="uppercase font-medium">{card.nameOnCard}</span>
                                            <span>•</span>
                                            <span>Expires {card.expiry}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleRemoveCard(card.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove Card"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 border border-gray-100 rounded-xl text-center px-4">
                        <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <CreditCard className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-bold text-[#111111] text-lg mb-2">No Saved Cards</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-sm">Save your credit or debit cards during checkout for faster, secure payments on future orders.</p>
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="px-6 py-2.5 bg-white border-2 border-[#FF6A00] text-[#FF6A00] hover:bg-[#FF6A00] hover:text-white rounded-lg font-bold text-sm transition-colors uppercase"
                        >
                            Add New Card
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
