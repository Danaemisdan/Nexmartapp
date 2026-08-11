'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/StoreContext';
import { X, Mail, Smartphone, ArrowLeft } from 'lucide-react';
import { useSignIn, useSignUp } from "@clerk/nextjs";

export default function AuthModal() {
    const { authModalOpen, setAuthModalOpen, showToast } = useStore();
    const { signIn } = useSignIn();
    const { signUp } = useSignUp();

    const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Auth flow state
    const [step, setStep] = useState<'start' | 'otp'>('start');
    const [otp, setOtp] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleContinue = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (loginMethod === 'email' && !email) {
            setError('Please enter a valid email address');
            return;
        }

        if (!signIn || !signUp) return;

        setError('');
        setIsLoading(true);

        const identifier = loginMethod === 'email' ? email : `+91${mobile}`;

        try {
            const response = await signIn.create({ identifier });
            if (response.error) {
                if (response.error.code !== 'form_identifier_not_found') {
                    throw response.error;
                }
            }
            
            const factor = signIn.supportedFirstFactors?.find((f: any) => 
                f.strategy === (loginMethod === 'email' ? 'email_code' : 'phone_code')
            ) as any;

            if (factor) {
                if (factor.strategy === 'email_code') {
                    // @ts-ignore - Clerk Core 3 API
                    await signIn.emailCode.sendCode({ emailAddressId: factor.emailAddressId });
                } else if (factor.strategy === 'phone_code') {
                    // @ts-ignore - Clerk Core 3 API
                    await signIn.phoneCode.sendCode({ phoneNumberId: factor.phoneNumberId });
                }
                setIsSignUp(false);
                setStep('otp');
            }
        } catch (err: any) {
            // User doesn't exist, proceed to Sign Up
            if (err.errors?.[0]?.code === 'form_identifier_not_found') {
                try {
                    await signUp.create({
                        emailAddress: loginMethod === 'email' ? email : undefined,
                        phoneNumber: loginMethod === 'mobile' ? identifier : undefined,
                    });

                    if (loginMethod === 'email') {
                        // @ts-ignore - Clerk Core 3 API
                        await signUp.verifications.sendEmailCode();
                    } else {
                        // @ts-ignore - Clerk Core 3 API
                        await signUp.verifications.sendPhoneCode();
                    }
                    
                    setIsSignUp(true);
                    setStep('otp');
                } catch (signUpErr: any) {
                    setError(signUpErr.errors?.[0]?.message || 'Failed to initiate sign up');
                }
            } else {
                setError(err.errors?.[0]?.longMessage || 'An error occurred during sign in');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        if (!signIn || !signUp) return;

        setError('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                const attempt = loginMethod === 'email'
                    // @ts-ignore - Clerk Core 3 API
                    ? await signUp.verifications.verifyEmailCode({ code: otp })
                    // @ts-ignore - Clerk Core 3 API
                    : await signUp.verifications.verifyPhoneCode({ code: otp });
                
                if (signUp.status === 'complete') {
                    // @ts-ignore - Clerk Core 3 API
                    await signUp.finalize();
                    showToast('Successfully signed up!', 'success');
                    handleClose();
                } else {
                    setError('Verification failed, please try again.');
                }
            } else {
                const attempt = loginMethod === 'email' 
                    // @ts-ignore - Clerk Core 3 API
                    ? await signIn.emailCode.verifyCode({ code: otp })
                    // @ts-ignore - Clerk Core 3 API
                    : await signIn.phoneCode.verifyCode({ code: otp });
                
                if (signIn.status === 'complete') {
                    // @ts-ignore - Clerk Core 3 API
                    await signIn.finalize();
                    showToast('Successfully logged in!', 'success');
                    handleClose();
                } else {
                    setError('Verification failed, please try again.');
                }
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.longMessage || 'Invalid code');
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setMobile('');
        setEmail('');
        setError('');
        setLoginMethod('email');
        setStep('start');
        setOtp('');
        setIsSignUp(false);
    };

    const handleClose = () => {
        setAuthModalOpen(false);
        setTimeout(resetState, 300); // Wait for animation
    };

    return (
        <AnimatePresence>
            {authModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white flex flex-col md:flex-row w-full max-w-3xl relative z-10 overflow-hidden shadow-2xl rounded-2xl min-h-[500px]"
                    >
                        <button onClick={handleClose} className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors shadow-sm text-gray-500">
                            <X className="w-5 h-5" />
                        </button>

                        {/* Brand Side - Just Logo */}
                        <div className="hidden md:flex flex-col w-[380px] bg-[#FF6A00] relative justify-center items-center overflow-hidden shrink-0 p-10">
                            {/* Abstract Shapes */}
                            <div className="absolute top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                            
                            <div className="relative z-10 flex flex-col items-center justify-center">
                                <img src="/yellow-x-logo.png" alt="Nexmart" className="w-48 h-48 object-contain drop-shadow-lg" />
                            </div>
                        </div>

                        {/* Auth Form Side */}
                        <div className="flex-1 bg-white p-8 md:p-10 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                {step === 'start' ? (
                                    <motion.div 
                                        key="start"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col max-w-[340px] w-full"
                                    >
                                        <h2 className="text-2xl text-[#111111] mb-6"><span className="font-bold">Login</span> or <span className="font-bold">Signup</span></h2>

                                        {/* Method Toggle */}
                                        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                                            <button
                                                onClick={() => { setLoginMethod('email'); setError(''); }}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${loginMethod === 'email' ? 'bg-white text-[#111111] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                <Mail className="w-4 h-4" /> Email
                                            </button>
                                            <button
                                                onClick={() => { setLoginMethod('mobile'); setError(''); }}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${loginMethod === 'mobile' ? 'bg-white text-[#111111] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                <Smartphone className="w-4 h-4" /> Mobile
                                            </button>
                                        </div>

                                        {loginMethod === 'email' ? (
                                            <form onSubmit={handleContinue} className="flex flex-col gap-3">
                                                <div className="border border-gray-200 rounded-lg focus-within:border-[#FF6A00] transition-colors">
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={e => { setEmail(e.target.value); setError(''); }}
                                                        className="w-full py-3.5 px-4 outline-none text-[#111111] text-sm font-medium bg-transparent rounded-lg"
                                                        placeholder="Email Address *"
                                                        required
                                                    />
                                                </div>

                                                {error && (
                                                    <p className="text-xs text-red-500 font-medium px-1">{error}</p>
                                                )}

                                                <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                                                    By continuing, I agree to the <span className="text-[#FF6A00] font-bold cursor-pointer hover:underline">Terms of Use</span> & <span className="text-[#FF6A00] font-bold cursor-pointer hover:underline">Privacy Policy</span>
                                                </p>

                                                <button
                                                    type="submit"
                                                    disabled={isLoading || !email}
                                                    className="w-full bg-[#FF6A00] disabled:bg-gray-200 disabled:text-gray-400 hover:bg-[#E65C00] text-white py-3.5 text-sm font-bold transition-colors rounded-lg mt-1 flex justify-center items-center h-12"
                                                >
                                                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'CONTINUE'}
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                <div className="relative border border-gray-200 rounded-lg focus-within:border-[#FF6A00] transition-colors">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm flex items-center gap-2">
                                                        +91 <span className="w-px h-4 bg-gray-200"></span>
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        maxLength={10}
                                                        value={mobile}
                                                        onChange={e => { setMobile(e.target.value.replace(/\D/g, '')); setError(''); }}
                                                        className="w-full py-3.5 pl-16 pr-4 outline-none text-[#111111] text-sm font-medium bg-transparent rounded-lg"
                                                        placeholder="Mobile Number *"
                                                    />
                                                </div>

                                                {error && (
                                                    <p className="text-xs text-red-500 font-medium px-1">{error}</p>
                                                )}

                                                <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                                                    By continuing, I agree to the <span className="text-[#FF6A00] font-bold cursor-pointer hover:underline">Terms of Use</span> & <span className="text-[#FF6A00] font-bold cursor-pointer hover:underline">Privacy Policy</span>
                                                </p>

                                                <button
                                                    onClick={() => handleContinue()}
                                                    disabled={isLoading || mobile.length < 10}
                                                    className="w-full bg-[#FF6A00] disabled:bg-gray-200 disabled:text-gray-400 hover:bg-[#E65C00] text-white py-3.5 text-sm font-bold transition-colors rounded-lg mt-1 flex justify-center items-center h-12"
                                                >
                                                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'CONTINUE'}
                                                </button>
                                            </div>
                                        )}

                                        <p className="text-[12px] text-gray-500 mt-5">
                                            Have trouble logging in? <span className="text-[#FF6A00] font-bold cursor-pointer hover:underline">Get help</span>
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="otp"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex flex-col max-w-[340px] w-full"
                                    >
                                        <button 
                                            onClick={() => { setStep('start'); setError(''); setOtp(''); }}
                                            className="self-start mb-6 text-gray-500 hover:text-[#111111] flex items-center gap-1 text-sm font-bold transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                        
                                        <h2 className="text-2xl text-[#111111] mb-2 font-bold">Verify Code</h2>
                                        <p className="text-sm text-gray-500 mb-6">
                                            We sent a 6-digit code to <span className="font-bold text-[#111111]">{loginMethod === 'email' ? email : `+91 ${mobile}`}</span>
                                        </p>

                                        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
                                            <div className="border border-gray-200 rounded-lg focus-within:border-[#FF6A00] transition-colors">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    value={otp}
                                                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                                                    className="w-full py-3.5 px-4 outline-none text-[#111111] text-center tracking-[0.5em] text-lg font-bold bg-transparent rounded-lg"
                                                    placeholder="------"
                                                    required
                                                />
                                            </div>

                                            {error && (
                                                <p className="text-xs text-red-500 font-medium px-1">{error}</p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isLoading || otp.length < 6}
                                                className="w-full bg-[#FF6A00] disabled:bg-gray-200 disabled:text-gray-400 hover:bg-[#E65C00] text-white py-3.5 text-sm font-bold transition-colors rounded-lg mt-4 flex justify-center items-center h-12"
                                            >
                                                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'VERIFY & LOGIN'}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
