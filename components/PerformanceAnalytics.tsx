'use client';
import { TradeStats } from '@/types';
import { Target, TrendingUp, Brain, Heart, Crosshair } from 'lucide-react';

interface Props {
    stats: TradeStats;
    trades: any[];
}

const StatBox = ({ title, value, sub, icon: Icon }: any) => (
    <div className="pj-card p-4 flex flex-col justify-between h-[110px]">
        <div className="flex justify-between items-start">
            <div className="p-2 bg-[#0D1117] rounded-lg border border-[#30363D]">
                <Icon size={16} className="text-[#8B949E]" />
            </div>
            <span className="text-xs text-[#8B949E]">{title}</span>
        </div>
        <div>
            <h4 className="text-xl font-bold text-[#00DCA3]">{value}</h4>
            <p className="text-[10px] text-[#8B949E]">{sub}</p>
        </div>
    </div>
);

export default function PerformanceAnalytics({ stats, trades }: Props) {
    const isProfitable = stats.totalProfit >= 0;

    // Calculate Avg R:R (mock logic)
    const avgRR = "1:2.8";

    // Most frequent emotion
    const emotions = trades.map(t => t.emotion || 'No data');
    const bestEmotion = emotions.sort((a, b) =>
        emotions.filter(v => v === a).length - emotions.filter(v => v === b).length
    ).pop() || 'No data';

    return (
        <div className="space-y-6 h-full flex flex-col">
            <h3 className="text-[#00DCA3] text-lg font-medium">Performance Analytics</h3>

            <div className="grid grid-cols-2 gap-4">
                <StatBox
                    title="Win Rate"
                    value={`${stats.winRate.toFixed(0)}%`}
                    sub={`${stats.winningTrades}/${stats.totalTrades} trades`}
                    icon={Target}
                />
                <StatBox
                    title="Total P/L"
                    value={`$${stats.totalProfit.toFixed(2)}`}
                    sub="USD"
                    icon={TrendingUp}
                />
                <StatBox
                    title="Avg R:R"
                    value={avgRR}
                    sub="Risk reward ratio"
                    icon={Crosshair}
                />
                <StatBox
                    title="Best Emotion"
                    value={bestEmotion}
                    sub="Most profitable state"
                    icon={Brain}
                />
            </div>

            <div className="pj-card p-6 flex-1 bg-gradient-to-b from-[#161B22] to-[#0D1117]">
                <div className="flex items-center gap-3 mb-4">
                    <Heart className="text-[#00DCA3]" size={20} />
                    <h4 className="text-[#00DCA3] font-medium">Emotional Intelligence</h4>
                </div>
                <p className="text-[#8B949E] text-sm leading-relaxed">
                    Start tracking your emotions to unlock powerful insights about your trading psychology.
                    <br /><br />
                    Patterns will emerge linking specific feelings to your biggest wins and losses.
                </p>
            </div>

            <div className="pj-card p-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-medium">Top Pairs</h4>
                </div>
                <div className="space-y-3">
                    {[{ p: 'EURUSD', c: 21 }, { p: 'GBPUSD', c: 7 }, { p: 'USDJPY', c: 11 }].map((pair, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                                <span className="bg-[#00DCA3] text-black w-5 h-5 rounded flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                <span className="text-[#EAECEF] font-bold">{pair.p}</span>
                            </div>
                            <span className="text-[#8B949E]">{pair.c} trades</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
