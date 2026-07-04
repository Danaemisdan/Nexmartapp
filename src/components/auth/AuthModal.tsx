import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Smartphone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSignIn, useSignUp, useClerk } from '@clerk/nextjs';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [step, setStep] = useState<'CONTACT' | 'OTP' | 'SUCCESS'>('CONTACT');
    const [contactInfo, setContactInfo] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { signIn } = useSignIn();
    const { signUp } = useSignUp();
    const { setActive } = useClerk();

    const handleSendCode = async () => {
        if (!signIn || !signUp || !contactInfo) return;

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo);
        const isPhone = /^\+[1-9]\d{6,14}$/.test(contactInfo.replace(/\s+/g, ''));

        if (!isEmail && !isPhone) {
            toast.error("Please enter a valid email or phone number starting with '+' (e.g., +1234...)");
            return;
        }

        setIsLoading(true);
        const identifier = isPhone ? contactInfo.replace(/\s+/g, '') : contactInfo;
        const strategy = isPhone ? 'phone_code' : 'email_code';

        try {
            // Attempt Sign In First
            await signIn.create({ identifier });
            
            // Prepare OTP
            await (signIn as any).prepareFirstFactor({ 
                strategy: strategy as 'phone_code' | 'email_code',
                phoneNumberId: (signIn as any).supportedFirstFactors?.find((f: any) => f.strategy === 'phone_code')?.phoneNumberId,
                emailAddressId: (signIn as any).supportedFirstFactors?.find((f: any) => f.strategy === 'email_code')?.emailAddressId
            });

            setAuthMode('signin');
            setStep('OTP');
        } catch (err: any) {
            // If user not found, fallback to Sign Up
            if (err.errors?.[0]?.code === 'form_identifier_not_found') {
                try {
                    if (isPhone) {
                        await signUp.create({ phoneNumber: identifier });
                        await (signUp as any).preparePhoneNumberVerification({ strategy: 'phone_code' });
                    } else {
                        await signUp.create({ emailAddress: identifier });
                        await (signUp as any).prepareEmailAddressVerification({ strategy: 'email_code' });
                    }
                    setAuthMode('signup');
                    setStep('OTP');
                } catch (signUpErr: any) {
                    toast.error(signUpErr.errors?.[0]?.longMessage || 'Failed to create account');
                }
            } else {
                toast.error(err.errors?.[0]?.longMessage || 'Failed to send code');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newOtp.every(v => v !== '')) {
            verifyOtp(newOtp.join(''));
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyOtp = async (code: string) => {
        if (!signIn || !signUp) return;
        setIsLoading(true);
        
        try {
            const isPhone = /^\+[1-9]\d{6,14}$/.test(contactInfo.replace(/\s+/g, ''));
            
            if (authMode === 'signin') {
                const result = await (signIn as any).attemptFirstFactor({ 
                    strategy: isPhone ? 'phone_code' : 'email_code', 
                    code 
                });
                
                if (result.status === 'complete') {
                    await setActive({ session: result.createdSessionId });
                    handleSuccess();
                }
            } else {
                let result;
                if (isPhone) {
                    result = await (signUp as any).attemptPhoneNumberVerification({ code });
                } else {
                    result = await (signUp as any).attemptEmailAddressVerification({ code });
                }
                
                if (result.status === 'complete') {
                    await setActive({ session: result.createdSessionId });
                    handleSuccess();
                }
            }
        } catch (err: any) {
            toast.error(err.errors?.[0]?.longMessage || 'Invalid code');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = () => {
        setStep('SUCCESS');
        setTimeout(() => {
            onClose();
            // Reset state
            setTimeout(() => {
                setStep('CONTACT');
                setContactInfo('');
                setOtp(['', '', '', '', '', '']);
            }, 500);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden flex flex-col"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 text-gray-500">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8 pt-12">
                        {step === 'CONTACT' && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                    <Smartphone className="w-8 h-8 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-black mb-2">Welcome to Nexmart</h2>
                                <p className="text-gray-500 mb-8 font-medium">Enter your email or phone number to sign in or create an account.</p>

                                <div className="w-full relative">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type="text"
                                        placeholder="Email or Phone (e.g. +1234...)"
                                        value={contactInfo}
                                        onChange={(e) => setContactInfo(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
                                    />
                                </div>

                                <button 
                                    onClick={handleSendCode}
                                    disabled={!contactInfo || isLoading}
                                    className="w-full mt-4 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-all"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </motion.div>
                        )}

                        {step === 'OTP' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center">
                                <h2 className="text-2xl font-black mb-2">Check your device</h2>
                                <p className="text-gray-500 mb-8 font-medium">We sent a 6-digit code to <br/><span className="text-black font-bold">{contactInfo}</span></p>

                                <div className="flex gap-2 justify-center w-full mb-8">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { inputRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        />
                                    ))}
                                </div>

                                {isLoading && (
                                    <div className="flex items-center gap-2 text-blue-600 font-medium animate-pulse">
                                        <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {step === 'SUCCESS' && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-8">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
                                    <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
                                </motion.div>
                                <h2 className="text-3xl font-black mb-2 text-green-600">Verified!</h2>
                                <p className="text-gray-500 font-medium">Logging you in securely...</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
