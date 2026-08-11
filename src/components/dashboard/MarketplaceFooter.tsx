import React from 'react';
import { Download, ShieldCheck, Undo2 } from 'lucide-react';

export default function MarketplaceFooter() {
    return (
        <footer className="w-full bg-white mt-12 border-t border-[#ECECEC] flex flex-col items-center">
            
            {/* Top Banner (App Download Promotion) */}
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="w-full bg-gradient-to-r from-[#FFF5F0] via-[#F0FFF0] to-[#F5FFFA] border border-[#FF6A00]/20 rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-black text-[#111111] uppercase tracking-tight mb-2">
                            More knockout offers waiting!
                        </h2>
                        <p className="text-xl font-bold text-[#FF6A00]">
                            Only On The Nexmart App
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden lg:block text-gray-500 font-bold mr-2">Download Now</span>
                        <button className="bg-black text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
                            <Download className="w-5 h-5" />
                            <div className="flex flex-col items-start text-left">
                                <span className="text-[8px] uppercase font-bold text-gray-300 leading-none">Android App On</span>
                                <span className="text-sm font-bold leading-none">Google Play</span>
                            </div>
                        </button>
                        <button className="bg-black text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
                            <Download className="w-5 h-5" />
                            <div className="flex flex-col items-start text-left">
                                <span className="text-[8px] uppercase font-bold text-gray-300 leading-none">Download On The</span>
                                <span className="text-sm font-bold leading-none">App Store</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-t border-[#ECECEC]">
                
                {/* Column 1 */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Online Shopping</h3>
                    <ul className="flex flex-col gap-2.5">
                        {['Men', 'Women', 'Kids', 'Home', 'Beauty', 'Electronics', 'Gift Cards', 'Nexmart Insider'].map(link => (
                            <li key={link}>
                                <a href="#" className="text-[13px] text-gray-600 hover:text-[#FF6A00] transition-colors">{link}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Customer Policies</h3>
                    <ul className="flex flex-col gap-2.5">
                        {['Contact Us', 'FAQ', 'T&C', 'Terms Of Use', 'Track Orders', 'Shipping', 'Cancellation', 'Returns', 'Privacy policy', 'Grievance Redressal'].map(link => (
                            <li key={link}>
                                <a href="#" className="text-[13px] text-gray-600 hover:text-[#FF6A00] transition-colors">{link}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-4">Experience Nexmart App on Mobile</h3>
                        <div className="flex items-center gap-3">
                            <button className="bg-black text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm">
                                <Download className="w-4 h-4" />
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-[7px] uppercase font-bold text-gray-300 leading-none">Get it on</span>
                                    <span className="text-xs font-bold leading-none">Google Play</span>
                                </div>
                            </button>
                            <button className="bg-black text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm">
                                <Download className="w-4 h-4" />
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-[7px] uppercase font-bold text-gray-300 leading-none">Download on the</span>
                                    <span className="text-xs font-bold leading-none">App Store</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-4">Keep In Touch</h3>
                        <div className="flex items-center gap-4 text-gray-500">
                            <a href="#" className="hover:text-[#FF6A00] transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-[#FF6A00] transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-[#FF6A00] transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Column 4 - Trust Badges */}
                <div className="flex flex-col gap-8 justify-center">
                    <div className="flex items-start gap-4">
                        <ShieldCheck className="w-10 h-10 text-[#FF6A00] flex-shrink-0" />
                        <div>
                            <p className="text-[13px] text-gray-800"><span className="font-bold">100% ORIGINAL</span> guarantee for all products at app.nexmartshop.ai</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Undo2 className="w-10 h-10 text-[#FF6A00] flex-shrink-0" />
                        <div>
                            <p className="text-[13px] text-gray-800"><span className="font-bold">Return within 14days</span> of receiving your order</p>
                        </div>
                    </div>
                </div>
                
            </div>

            {/* Bottom Bar */}
            <div className="w-full bg-[#FAFAFA] py-6 border-t border-[#ECECEC]">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500 font-medium">© 2026 app.nexmartshop.ai. All rights reserved.</p>
                    <p className="text-xs text-gray-500 font-medium hidden md:block">A Premium Ecommerce Experience</p>
                </div>
            </div>
        </footer>
    );
}
