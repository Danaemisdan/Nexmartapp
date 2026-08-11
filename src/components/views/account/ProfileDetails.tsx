import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ProfileDetails() {
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: user?.fullName || 'Guest User',
        mobile: '+91 9999999999',
        email: user?.primaryEmailAddress?.emailAddress || '',
        gender: '',
        dob: '',
        location: '',
        altMobile: '',
        hintName: ''
    });

    const handleSave = () => {
        // Implement save logic here
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-[#111111]">Profile Details</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-gray-200 text-[#111111] hover:border-[#FF6A00] hover:text-[#FF6A00] font-bold text-sm rounded transition-colors uppercase">
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-200 text-gray-600 hover:border-gray-400 font-bold text-sm rounded transition-colors uppercase">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-[#FF6A00] hover:bg-[#E65C00] text-white font-bold text-sm rounded transition-colors uppercase">
                            Save Details
                        </button>
                    </div>
                )}
            </div>

            <div className="max-w-2xl">
                {!isEditing ? (
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-gray-50">
                                <td className="py-4 text-gray-500 w-1/3">Full Name</td>
                                <td className="py-4 font-medium text-[#111111]">{formData.fullName || '- not added -'}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="py-4 text-gray-500">Mobile Number</td>
                                <td className="py-4 font-medium text-[#111111]">{formData.mobile || '- not added -'}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="py-4 text-gray-500">Email ID</td>
                                <td className="py-4 font-medium text-[#111111]">{formData.email || '- not added -'}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="py-4 text-gray-500">Gender</td>
                                <td className="py-4 font-medium text-[#111111]">{formData.gender || '- not added -'}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="py-4 text-gray-500">Date of Birth</td>
                                <td className="py-4 font-medium text-[#111111]">{formData.dob || '- not added -'}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="py-4 text-gray-500">Location</td>
                                <td className="py-4 font-medium text-[#111111]">{formData.location || '- not added -'}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="py-4 text-gray-500">Alternate Mobile</td>
                                <td className="py-4 font-medium text-[#111111]">{formData.altMobile || '- not added -'}</td>
                            </tr>
                            <tr>
                                <td className="py-4 text-gray-500">Hint Name</td>
                                <td className="py-4 font-medium text-[#111111]">{formData.hintName || '- not added -'}</td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 tracking-wider">FULL NAME</label>
                            <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF6A00]" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 tracking-wider">MOBILE NUMBER</label>
                            <input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF6A00]" />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 tracking-wider">EMAIL ID</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF6A00]" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 tracking-wider">GENDER</label>
                            <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF6A00] bg-white">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 tracking-wider">DATE OF BIRTH</label>
                            <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF6A00]" />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 tracking-wider">LOCATION</label>
                            <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF6A00]" placeholder="City, State" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 tracking-wider">ALTERNATE MOBILE</label>
                            <input type="text" value={formData.altMobile} onChange={e => setFormData({...formData, altMobile: e.target.value})} className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF6A00]" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 tracking-wider">HINT NAME</label>
                            <input type="text" value={formData.hintName} onChange={e => setFormData({...formData, hintName: e.target.value})} className="border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF6A00]" />
                        </div>
                    </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <button className="text-red-500 font-bold text-sm hover:underline">
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
}
