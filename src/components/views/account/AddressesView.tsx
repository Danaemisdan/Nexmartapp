import React, { useState } from 'react';

export default function AddressesView() {
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: 'John Doe',
            type: 'HOME',
            address: 'Flat number-4, 2-77, adesh villa, block-2, rajendra nagar, sector-5, Sahibabad\nGhaziabad, Uttar Pradesh - 201005',
            mobile: '8447450354',
            isDefault: true
        },
        {
            id: 2,
            name: 'Jane Doe',
            type: 'OFFICE',
            address: 'New panchwati, A-106, govindpuram, Govindpuram, Govindpuram\nGhaziabad, Uttar Pradesh - 201013',
            mobile: '9520830054',
            isDefault: false
        }
    ]);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);

    const handleEdit = (address: any) => {
        setEditingId(address.id);
        setEditForm({ ...address });
    };

    const handleRemove = (id: number) => {
        setAddresses(addresses.filter(a => a.id !== id));
    };

    const handleSave = () => {
        if (isAddingNew) {
            setAddresses([...addresses, { ...editForm, id: Date.now() }]);
            setIsAddingNew(false);
        } else {
            setAddresses(addresses.map(a => a.id === editingId ? editForm : a));
            setEditingId(null);
        }
    };

    const handleAddNew = () => {
        setIsAddingNew(true);
        setEditForm({
            name: '',
            type: 'HOME',
            address: '',
            mobile: '',
            isDefault: false
        });
    };

    const renderForm = () => (
        <div className="border border-gray-200 rounded-lg p-5 bg-white mb-6">
            <h3 className="font-bold text-[#111111] mb-4">{isAddingNew ? 'Add New Address' : 'Edit Address'}</h3>
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 tracking-wider">NAME</label>
                        <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF6A00] text-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 tracking-wider">MOBILE</label>
                        <input type="text" value={editForm.mobile} onChange={e => setEditForm({...editForm, mobile: e.target.value})} className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF6A00] text-sm" />
                    </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 tracking-wider">ADDRESS</label>
                    <textarea value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF6A00] text-sm h-24 resize-none" placeholder="Enter full address" />
                </div>
                
                <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs font-bold text-gray-500 tracking-wider">ADDRESS TYPE</span>
                    <div className="flex gap-2">
                        <button onClick={() => setEditForm({...editForm, type: 'HOME'})} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${editForm.type === 'HOME' ? 'bg-[#00BFA5] text-white border border-[#00BFA5]' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>HOME</button>
                        <button onClick={() => setEditForm({...editForm, type: 'OFFICE'})} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${editForm.type === 'OFFICE' ? 'bg-[#00BFA5] text-white border border-[#00BFA5]' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>OFFICE</button>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" checked={editForm.isDefault} onChange={e => setEditForm({...editForm, isDefault: e.target.checked})} className="w-4 h-4 accent-[#FF6A00]" />
                    <span className="text-sm text-[#111111] font-medium">Make this my default address</span>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-2">
                    <button onClick={() => { setEditingId(null); setIsAddingNew(false); }} className="px-6 py-2 border border-gray-200 text-gray-600 hover:border-gray-400 font-bold text-sm rounded transition-colors uppercase">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-[#FF6A00] hover:bg-[#E65C00] text-white font-bold text-sm rounded transition-colors uppercase">
                        Save Address
                    </button>
                </div>
            </div>
        </div>
    );

    const defaultAddress = addresses.find(a => a.isDefault);
    const otherAddresses = addresses.filter(a => !a.isDefault);

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-[#111111]">Saved Addresses</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your delivery addresses</p>
                </div>
                {!isAddingNew && (
                    <button onClick={handleAddNew} className="px-4 py-2 border border-gray-200 text-[#111111] hover:border-[#FF6A00] hover:text-[#FF6A00] font-bold text-sm rounded transition-colors uppercase">
                        + Add New Address
                    </button>
                )}
            </div>

            <div className="flex flex-col max-w-2xl">
                {isAddingNew && renderForm()}

                {defaultAddress && (
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">DEFAULT ADDRESS</h3>
                        {editingId === defaultAddress.id ? renderForm() : (
                            <div className="border border-gray-200 rounded-lg p-5 relative hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-[#111111]">{defaultAddress.name}</span>
                                        <span className="px-2 py-0.5 bg-green-50 text-[#00BFA5] border border-[#00BFA5]/20 text-[10px] font-bold rounded-full uppercase tracking-wider">{defaultAddress.type}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3 whitespace-pre-line">
                                    {defaultAddress.address}
                                </p>
                                <p className="text-sm text-gray-600 mb-4">Mobile: <span className="font-medium text-[#111111]">{defaultAddress.mobile}</span></p>
                                
                                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                    <button onClick={() => handleRemove(defaultAddress.id)} className="px-4 py-1.5 text-xs font-bold text-gray-600 hover:text-red-500 uppercase transition-colors border border-gray-200 rounded">
                                        Remove
                                    </button>
                                    <button onClick={() => handleEdit(defaultAddress)} className="px-4 py-1.5 text-xs font-bold text-gray-600 hover:text-[#FF6A00] hover:border-[#FF6A00] uppercase transition-colors border border-gray-200 rounded">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {otherAddresses.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">OTHER ADDRESSES</h3>
                        <div className="flex flex-col gap-6">
                            {otherAddresses.map(address => (
                                editingId === address.id ? (
                                    <div key={address.id}>{renderForm()}</div>
                                ) : (
                                    <div key={address.id} className="border border-gray-200 rounded-lg p-5 relative hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-[#111111]">{address.name}</span>
                                                <span className="px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-200 text-[10px] font-bold rounded-full uppercase tracking-wider">{address.type}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-3 whitespace-pre-line">
                                            {address.address}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-4">Mobile: <span className="font-medium text-[#111111]">{address.mobile}</span></p>
                                        
                                        <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                            <button onClick={() => handleRemove(address.id)} className="px-4 py-1.5 text-xs font-bold text-gray-600 hover:text-red-500 uppercase transition-colors border border-gray-200 rounded">
                                                Remove
                                            </button>
                                            <button onClick={() => handleEdit(address)} className="px-4 py-1.5 text-xs font-bold text-gray-600 hover:text-[#FF6A00] hover:border-[#FF6A00] uppercase transition-colors border border-gray-200 rounded">
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
