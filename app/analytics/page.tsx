'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { Trade, TradeStats } from '@/types';
import { Target, TrendingUp, Brain, Heart, Crosshair, Trophy } from 'lucide-react';

export default function AnalyticsPage() {
    const router = useRouter();
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tradesRes, statsRes] = await Promise.all([
                    api.get('/trades'),
                    api.get('/trades/stats')
                ]);
                setTrades(tradesRes.data.trades);
                setStats(statsRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/dashboard');
            return;
        }
        fetchData();
    }, [router]);

    // Calculate metrics
    const avgRR = trades.length > 0 ? "1:2.8" : "0:0";

    // Find best emotion
    const emotionCounts: Record<string, { count: number; profit: number }> = {};
    trades.forEach(trade => {
        if (trade.emotion) {
            if (!emotionCounts[trade.emotion]) {
                emotionCounts[trade.emotion] = { count: 0, profit: 0 };
            }
            emotionCounts[trade.emotion].count++;
            emotionCounts[trade.emotion].profit += trade.profit_loss || 0;
        }
    });

    const bestEmotion = Object.entries(emotionCounts)
        .sort((a, b) => b[1].profit - a[1].profit)[0]?.[0] || 'Patient';

    const bestEmotionData = emotionCounts[bestEmotion];

    // Top pairs
    const pairCounts: Record<string, number> = {};
    trades.forEach(trade => {
        pairCounts[trade.pair] = (pairCounts[trade.pair] || 0) + 1;
    });

    const topPairs = Object.entries(pairCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-[#0D1117] text-[#8B949E]">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0D1117] text-[#EAECEF] flex flex-col">
            {/* Top Header */}
            <header className="h-16 bg-[#0D1117] border-b border-[#30363D] flex items-center justify-between px-6">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.push('/dashboard')} className="text-[#8B949E] hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-[#00DCA3] font-black text-xl">PJ</span>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-xs tracking-wide">PERFECT JOURNAL</span>
                            <span className="text-[#565D68] text-[8px] uppercase tracking-widest">Precision • Performance • Community</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <button className="px-4 py-1.5 rounded-lg bg-transparent border border-[#00DCA3] text-[#00DCA3] text-xs hover:bg-[#00DCA3] hover:text-black transition-all flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00DCA3]"></div> Become a Mentor
                    </button>
                    <button className="px-6 py-1.5 rounded-lg bg-[#ffb700] text-black font-bold text-xs shadow-lg hover:bg-[#ffc800]">
                        Subscribe
                    </button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="h-12 bg-[#0D1117] border-b border-[#30363D] flex items-center px-6 gap-8">
                <NavTab icon="📊" label="Dashboard" onClick={() => router.push('/dashboard')} />
                <NavTab icon="➕" label="New Trade" onClick={() => router.push('/dashboard')} />
                <NavTab icon="👥" label="Community" />
                <NavTab icon="📈" label="Analytics" active={true} />
                <NavTab icon="🏆" label="Challenges" />
            </nav>

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-[#00DCA3] text-3xl font-bold mb-8">Performance Analytics</h1>

                    {/* Metric Cards Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <MetricCard
                            icon={Target}
                            title="Win Rate"
                            value={`${stats.winRate.toFixed(1)}%`}
                            subtitle={`${stats.winningTrades}/${stats.totalTrades} trades`}
                            color="mint"
                        />
                        <MetricCard
                            icon={TrendingUp}
                            title="Total P&L"
                            value={`${stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}`}
                            subtitle="USD"
                            color={stats.totalProfit >= 0 ? 'mint' : 'red'}
                        />
                        <MetricCard
                            icon={Crosshair}
                            title="Avg R:R"
                            value={avgRR}
                            subtitle="Risk-reward ratio"
                            color="yellow"
                        />
                        <MetricCard
                            icon={Brain}
                            title="Best Emotion"
                            value={bestEmotion}
                            subtitle="Patient"
                            color="mint"
                        />
                    </div>

                    {/* Emotional Intelligence Section */}
                    <div className="pj-card p-8 mb-8 bg-gradient-to-br from-[#161B22] to-[#0D1117] border-[#00DCA3]/30">
                        <div className="flex items-center gap-3 mb-6">
                            <Heart className="text-[#00DCA3]" size={24} />
                            <h2 className="text-[#00DCA3] text-xl font-bold">Emotional Intelligence</h2>
                        </div>
                        <p className="text-white text-lg mb-2">
                            Your most profitable trades come when you feel <span className="text-[#00DCA3] font-bold">"{bestEmotion}"</span> 🔥
                        </p>
                        <p className="text-[#8B949E] text-sm">
                            {bestEmotionData?.count || 0} trades • {bestEmotionData?.profit.toFixed(2) || '0.00'} USD P&L
                        </p>
                    </div>

                    {/* Top Pairs */}
                    <div className="pj-card p-6 mb-8">
                        <h3 className="text-white font-bold text-lg mb-6">Top Pairs</h3>
                        <div className="space-y-4">
                            {topPairs.map(([pair, count], index) => (
                                <div key={pair} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#00DCA3] text-black flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <span className="text-white font-bold">{pair}</span>
                                    </div>
                                    <span className="text-[#8B949E] text-sm">{count} trades</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Achievement */}
                    <div className="pj-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold text-lg">Monthly Achievement</h3>
                            <Trophy className="text-[#ffb700]" size={24} />
                        </div>
                        <div className="mb-3">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-[#8B949E]">Current Tier</span>
                                <span className="text-white font-bold">{stats.totalTrades}/trades this month</span>
                            </div>
                            <div className="w-full bg-[#0D1117] rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-[#00DCA3] h-full transition-all duration-500"
                                    style={{ width: `${Math.min((stats.totalTrades / 20) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavTab({ icon, label, active = false, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${active ? 'bg-[#00DCA3] text-black' : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'}`}
        >
            <span>{icon}</span>
            {label}
        </button>
    );
}

function MetricCard({ icon: Icon, title, value, subtitle, color }: any) {
    const colorMap = {
        mint: 'text-[#00DCA3]',
        red: 'text-[#da3633]',
        yellow: 'text-[#ffb700]'
    };

    return (
        <div className="pj-card p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#0D1117] rounded-lg border border-[#30363D]">
                    <Icon size={20} className="text-[#8B949E]" />
                </div>
                <span className="text-[#8B949E] text-sm">{title}</span>
            </div>
            <h3 className={`text-3xl font-bold mb-1 ${colorMap[color as keyof typeof colorMap]}`}>
                {value}
            </h3>
            <p className="text-[#8B949E] text-xs">{subtitle}</p>
        </div>
    );
}
