'use client';
import { useState } from 'react';
import { ArrowLeft, Mail, Lock, CheckCircle } from 'lucide-react';
import api from '@/utils/api';

interface Props {
    onBack: () => void;
    onSuccess: () => void;
}

export default function ForgotPasswordFlow({ onBack, onSuccess }: Props) {
    const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.msg);
            setStep('code');
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to send reset code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }
        setStep('password');
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const res = await api.post('/auth/reset-password', {
                email,
                code,
                newPassword
            });
            setMessage(res.data.msg);
            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#161B22] w-full max-w-[400px] rounded-2xl shadow-2xl border border-[#30363D] relative overflow-hidden">

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 text-[#8B949E] hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="p-8 pt-10">
                    {/* Step 1: Email Input */}
                    {step === 'email' && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-[#00DCA3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="text-[#00DCA3]" size={28} />
                                </div>
                                <h2 className="text-[#00DCA3] text-2xl font-bold mb-2">
                                    Forgot Password?
                                </h2>
                                <p className="text-[#8B949E] text-xs">
                                    Enter your email to receive a verification code
                                </p>
                            </div>

                            <form onSubmit={handleRequestCode} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[#8B949E] text-[10px] font-medium uppercase tracking-wider ml-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-[#0D1117] border border-[#30363D] text-[#EAECEF] px-4 py-3 rounded-lg focus:border-[#00DCA3] outline-none transition-all placeholder:text-[#30363D] text-sm"
                                        placeholder="trader@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-[#da3633]/10 border border-[#da3633]/30 text-[#da3633] px-4 py-2 rounded-lg text-xs">
                                        {error}
                                    </div>
                                )}

                                {message && (
                                    <div className="bg-[#00DCA3]/10 border border-[#00DCA3]/30 text-[#00DCA3] px-4 py-2 rounded-lg text-xs">
                                        {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#00DCA3] hover:bg-[#00bda0] text-black font-bold py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(0,220,163,0.2)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {loading ? 'Sending...' : 'Send Verification Code'}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Step 2: Code Verification */}
                    {step === 'code' && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-[#00DCA3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="text-[#00DCA3]" size={28} />
                                </div>
                                <h2 className="text-[#00DCA3] text-2xl font-bold mb-2">
                                    Check Your Email
                                </h2>
                                <p className="text-[#8B949E] text-xs">
                                    We sent a 6-digit code to <span className="text-[#EAECEF]">{email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyCode} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[#8B949E] text-[10px] font-medium uppercase tracking-wider ml-1">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        className="w-full bg-[#0D1117] border border-[#30363D] text-[#EAECEF] px-4 py-3 rounded-lg focus:border-[#00DCA3] outline-none transition-all placeholder:text-[#30363D] text-center text-2xl font-mono tracking-[0.5em] font-bold"
                                        placeholder="000000"
                                        value={code}
                                        onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-[#da3633]/10 border border-[#da3633]/30 text-[#da3633] px-4 py-2 rounded-lg text-xs">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={code.length !== 6}
                                    className="w-full bg-[#00DCA3] hover:bg-[#00bda0] text-black font-bold py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(0,220,163,0.2)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    Verify Code
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep('email')}
                                    className="w-full text-[#8B949E] hover:text-[#00DCA3] text-xs transition-colors"
                                >
                                    Didn't receive the code? Try again
                                </button>
                            </form>
                        </>
                    )}

                    {/* Step 3: New Password */}
                    {step === 'password' && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-[#00DCA3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="text-[#00DCA3]" size={28} />
                                </div>
                                <h2 className="text-[#00DCA3] text-2xl font-bold mb-2">
                                    Set New Password
                                </h2>
                                <p className="text-[#8B949E] text-xs">
                                    Choose a strong password for your account
                                </p>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[#8B949E] text-[10px] font-medium uppercase tracking-wider ml-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-[#0D1117] border border-[#30363D] text-[#EAECEF] px-4 py-3 rounded-lg focus:border-[#00DCA3] outline-none transition-all placeholder:text-[#30363D] text-sm"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[#8B949E] text-[10px] font-medium uppercase tracking-wider ml-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-[#0D1117] border border-[#30363D] text-[#EAECEF] px-4 py-3 rounded-lg focus:border-[#00DCA3] outline-none transition-all placeholder:text-[#30363D] text-sm"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-[#da3633]/10 border border-[#da3633]/30 text-[#da3633] px-4 py-2 rounded-lg text-xs">
                                        {error}
                                    </div>
                                )}

                                {message && (
                                    <div className="bg-[#00DCA3]/10 border border-[#00DCA3]/30 text-[#00DCA3] px-4 py-2 rounded-lg text-xs flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#00DCA3] hover:bg-[#00bda0] text-black font-bold py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(0,220,163,0.2)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
