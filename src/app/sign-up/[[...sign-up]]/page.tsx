import { SignUp } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Store
            </Link>
            
            <div className="w-full max-w-md flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                    <span className="text-3xl font-black text-blue-600">N</span>
                </div>
                
                <SignUp 
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "w-full shadow-2xl rounded-[2rem] border-0 p-8",
                            headerTitle: "text-2xl font-black text-black",
                            headerSubtitle: "text-gray-500 font-medium",
                            socialButtonsBlockButton: "rounded-xl border border-gray-200 h-12 text-sm font-bold text-gray-700 hover:bg-gray-50",
                            dividerLine: "bg-gray-200",
                            dividerText: "text-gray-400 font-medium",
                            formFieldInput: "rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 font-medium px-4",
                            formFieldLabel: "text-sm font-bold text-gray-700 mb-1.5",
                            formButtonPrimary: "rounded-xl bg-black hover:bg-gray-800 text-white h-12 font-bold shadow-xl shadow-black/10 mt-2",
                            footerActionText: "text-gray-500 font-medium",
                            footerActionLink: "text-blue-600 font-bold hover:text-blue-700",
                            identityPreviewText: "text-gray-700 font-bold",
                            identityPreviewEditButtonIcon: "text-blue-600"
                        }
                    }}
                />
            </div>
        </div>
    );
}
