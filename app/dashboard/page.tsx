'use client';
import { useEffect, useState } from 'react';
import TradeForm from '@/components/TradeForm';
import PerformanceAnalytics from '@/components/PerformanceAnalytics';
import TradeStatsDashboard from '@/components/TradeStats'; // Keeping the chart for Center View
import Sidebar from '@/components/Sidebar';
import TradeList from '@/components/TradeList'; // We'll re-use this for "Recent Trades"
import api from '@/utils/api';
import { Trade, TradeStats } from '@/types';
import { Search } from 'lucide-react';

export default function Dashboard() {
    const [view, setView] = useState('dashboard'); // 'dashboard' | 'new-trade'
    const [trades, setTrades] = useState<Trade[]>([]);
    const [stats, setStats] = useState<TradeStats>({
        totalTrades: 0,
        totalProfit: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        dailyPL: []
    });
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const fetchData = async () => {
        try {
            const [tradesRes, statsRes] = await Promise.all([
                api.get('/trades'),
                api.get('/trades/stats')
            ]);
            setTrades(tradesRes.data.trades);
            setStats(statsRes.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error(error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const res = await api.post(endpoint, {
                email,
                password,
                name: 'Trader'
            });
            localStorage.setItem('token', res.data.token);
            fetchData();
        } catch (error) {
            alert('Authentication failed');
        }
    };

    if (loading) return <div className="text-[#8B949E] flex justify-center items-center h-screen bg-[#0D1117]">Loading...</div>;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0D1117] flex justify-center items-center p-4">
                <div className="pj-card p-8 w-full max-w-md bg-[#161B22]">
                    <div className="text-center mb-8">
                        <h1 className="text-[#00DCA3] text-2xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-[#8B949E] text-sm">Sign in to access your trading journal</p>
                    </div>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="pj-label">Email</label>
                            <input
                                className="pj-input"
                                value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="trader@example.com"
                            />
                        </div>
                        <div>
                            <label className="pj-label">Password</label>
                            <input
                                className="pj-input"
                                value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="........"
                            />
                        </div>
                        <button className="pj-btn-primary mt-6">
                            {isRegister ? 'Create Account' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center mt-6 text-[#8B949E] text-sm cursor-pointer hover:text-white" onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? 'Have an account? Sign In' : "Don't have an account? Sign up"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#0D1117] text-[#EAECEF] font-sans overflow-hidden flex">
            <Sidebar onViewChange={setView} />

            <div className="flex-1 flex flex-col ml-64 p-8 overflow-hidden">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {view === 'dashboard' ? 'Dashboard' : 'New Trade Entry'}
                        </h2>
                        {view === 'dashboard' && <p className="text-[#8B949E] text-sm">Welcome back, Trader</p>}
                    </div>

                    <div className="flex gap-4">
                        <button className="px-4 py-2 rounded-lg bg-[#161B22] border border-[#30363D] text-[#8B949E] text-sm hover:text-white flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#da3633]"></div> Become a Mentor
                        </button>
                        <button className="px-6 py-2 rounded-lg bg-[#ffb700] text-black font-bold text-sm shadow-lg hover:bg-[#ffc800]">
                            Subscribe
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}

                {view === 'new-trade' ? (
                    <div className="flex-1 max-w-2xl mx-auto w-full">
                        <TradeForm onSuccess={() => { setView('dashboard'); fetchData(); }} />
                    </div>
                ) : (
                    <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">

                        {/* Left: Recent Trades (3 cols) */}
                        <div className="col-span-3 flex flex-col gap-4">
                            <h3 className="text-white font-medium">Recent Trades</h3>
                            <div className="flex-1 pj-card overflow-hidden flex flex-col">
                                <TradeList trades={trades} onUpdate={fetchData} />
                            </div>
                        </div>

                        {/* Center: Main Stage / Chart (6 cols) */}
                        <div className="col-span-6 flex flex-col items-center justify-center pj-card p-6 bg-[#0B0E11] relative">
                            {stats.totalTrades > 0 ? (
                                <div className="w-full h-full">
                                    <TradeStatsDashboard stats={stats} />
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-[#8B949E] mb-4">No trades selected</p>
                                    <span
                                        onClick={() => setView('new-trade')}
                                        className="text-[#00DCA3] cursor-pointer hover:underline"
                                    >
                                        Create your first trade
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Right: Analytics (3 cols) */}
                        <div className="col-span-3 h-full">
                            <PerformanceAnalytics stats={stats} trades={trades} />
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
