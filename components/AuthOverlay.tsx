'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import ForgotPasswordFlow from './ForgotPasswordFlow';

interface Props {
    onAuth: (data: any, isRegister: boolean) => void;
}

export default function AuthOverlay({ onAuth }: Props) {
    const [isRegister, setIsRegister] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = isRegister
            ? { name, email, password }
            : { email, password };
        onAuth(data, isRegister);
    };

    if (showForgotPassword) {
        return (
            <ForgotPasswordFlow
                onBack={() => setShowForgotPassword(false)}
                onSuccess={() => setShowForgotPassword(false)}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#161B22] w-full max-w-[400px] rounded-2xl shadow-2xl border border-[#30363D] relative overflow-hidden">

                {/* Close Button */}
                <Link href="/">
                    <button className="absolute top-4 right-4 text-[#8B949E] hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </Link>

                <div className="p-8 pt-10">
                    <div className="text-center mb-8">
                        <h2 className="text-[#00DCA3] text-2xl font-bold mb-2">
                            {isRegister ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-[#8B949E] text-xs">
                            {isRegister ? 'Sign up to start your journey' : 'Sign in to access your trading journal'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isRegister && (
                            <div className="space-y-1.5">
                                <label className="text-[#8B949E] text-[10px] font-medium uppercase tracking-wider ml-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#0D1117] border border-[#30363D] text-[#EAECEF] px-4 py-3 rounded-lg focus:border-[#00DCA3] outline-none transition-all placeholder:text-[#30363D] text-sm"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[#8B949E] text-[10px] font-medium uppercase tracking-wider ml-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-[#0D1117] border border-[#30363D] text-[#EAECEF] px-4 py-3 rounded-lg focus:border-[#00DCA3] outline-none transition-all placeholder:text-[#30363D] text-sm"
                                placeholder="trader@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[#8B949E] text-[10px] font-medium uppercase tracking-wider ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-[#0D1117] border border-[#30363D] text-[#EAECEF] px-4 py-3 rounded-lg focus:border-[#00DCA3] outline-none transition-all placeholder:text-[#30363D] text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        {!isRegister && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-[#8B949E] hover:text-[#00DCA3] text-xs transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button className="w-full bg-[#00DCA3] hover:bg-[#00bda0] text-black font-bold py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(0,220,163,0.2)] mt-2 text-sm">
                            {isRegister ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-[#8B949E] text-xs">
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}
                            <span
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-[#EAECEF] hover:text-[#00DCA3] ml-1 cursor-pointer font-medium transition-colors"
                            >
                                {isRegister ? 'Sign In' : 'Sign up'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
