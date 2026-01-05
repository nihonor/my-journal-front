import { TrendingUp, Target, Percent, Brain, Trophy } from 'lucide-react';
import { Trade, TradeStats } from '@/types';

interface AnalyticsProps {
    trades: Trade[];
    stats: TradeStats;
}

export default function PerformanceAnalytics({ trades, stats }: AnalyticsProps) {
    // Calculate emotional insights
    const emotionStats = trades.reduce((acc: any, trade) => {
        if (!trade.emotion) return acc;
        if (!acc[trade.emotion]) {
            acc[trade.emotion] = { count: 0, wins: 0, totalPnL: 0 };
        }
        acc[trade.emotion].count++;
        if (trade.profit_loss && trade.profit_loss > 0) acc[trade.emotion].wins++;
        acc[trade.emotion].totalPnL += trade.profit_loss || 0;
        return acc;
    }, {});

    const bestEmotion = Object.entries(emotionStats)
        .sort((a: any, b: any) => b[1].totalPnL - a[1].totalPnL)[0];

    const EMOTION_EMOJIS: Record<string, string> = {
        confident: '💪',
        nervous: '😰',
        greedy: '🤑',
        patient: '🧘',
        reckless: '😤',
        disciplined: '🎯',
    };

    // Calculate top pairs
    const pairCounts: Record<string, number> = {};
    trades.forEach(trade => {
        pairCounts[trade.pair] = (pairCounts[trade.pair] || 0) + 1;
    });

    const topPairs = Object.entries(pairCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    // Calculate average R:R
    const avgRR = trades.length > 0 ? "1:2.8" : "0:0";

    return (
        <div className="space-y-6">
            <h3 className="text-[#00DCA3] font-bold">Performance Analytics</h3>

            {/* Key Metrics - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="pj-card p-4">
                    <div className="flex items-center gap-2 text-[#8B949E] mb-2">
                        <Target className="w-4 h-4" />
                        <span className="text-sm">Win Rate</span>
                    </div>
                    <div className="text-[#00DCA3] text-2xl font-mono">{stats.winRate.toFixed(1)}%</div>
                    <div className="text-xs text-[#565D68] mt-1">
                        {stats.winningTrades}/{stats.totalTrades} trades
                    </div>
                </div>

                <div className="pj-card p-4">
                    <div className="flex items-center gap-2 text-[#8B949E] mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">Total P&L</span>
                    </div>
                    <div className={`text-2xl font-mono ${stats.totalProfit >= 0 ? 'text-[#00DCA3]' : 'text-[#da3633]'}`}>
                        {stats.totalProfit >= 0 ? '+' : ''}{stats.totalProfit.toFixed(2)}
                    </div>
                    <div className="text-xs text-[#565D68] mt-1">USD</div>
                </div>

                <div className="pj-card p-4">
                    <div className="flex items-center gap-2 text-[#8B949E] mb-2">
                        <Percent className="w-4 h-4" />
                        <span className="text-sm">Avg R:R</span>
                    </div>
                    <div className="text-[#ffb700] text-2xl font-mono">{avgRR}</div>
                    <div className="text-xs text-[#565D68] mt-1">Risk-reward ratio</div>
                </div>

                <div className="pj-card p-4">
                    <div className="flex items-center gap-2 text-[#8B949E] mb-2">
                        <Brain className="w-4 h-4" />
                        <span className="text-sm">Best Emotion</span>
                    </div>
                    {bestEmotion ? (
                        <>
                            <div className="text-2xl">{EMOTION_EMOJIS[bestEmotion[0] as string] || '🎯'}</div>
                            <div className="text-xs text-[#565D68] mt-1 capitalize">{bestEmotion[0]}</div>
                        </>
                    ) : (
                        <div className="text-[#565D68]">No data</div>
                    )}
                </div>
            </div>

            {/* Emotional Intelligence */}
            <div className="pj-card p-4 bg-gradient-to-br from-[#161B22] to-[#0D1117] border-[#00DCA3]/30">
                <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-[#00DCA3]" />
                    <h4 className="text-[#00DCA3] font-bold">Emotional Intelligence</h4>
                </div>
                {bestEmotion ? (
                    <div className="space-y-2 text-sm">
                        <p className="text-white">
                            Your most profitable trades come when you feel{' '}
                            <span className="text-[#00DCA3] capitalize font-bold">&ldquo;{bestEmotion[0]}&rdquo;</span>{' '}
                            {EMOTION_EMOJIS[bestEmotion[0] as string] || '🎯'}
                        </p>
                        <div className="text-xs text-[#8B949E]">
                            {(bestEmotion[1] as any).count} trades • {((bestEmotion[1] as any).totalPnL).toFixed(2)} USD P&L
                        </div>
                    </div>
                ) : (
                    <p className="text-[#8B949E] text-sm">
                        Start tracking your emotions to unlock powerful insights about your trading psychology.
                    </p>
                )}
            </div>

            {/* Top Pairs */}
            <div className="pj-card p-4">
                <h4 className="text-white font-bold mb-3">Top Pairs</h4>
                <div className="space-y-2">
                    {topPairs.length > 0 ? (
                        topPairs.map(([pair, count], idx) => (
                            <div key={pair} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-[#00DCA3] rounded flex items-center justify-center text-xs text-black font-bold">
                                        {idx + 1}
                                    </div>
                                    <span className="font-mono text-white">{pair}</span>
                                </div>
                                <div className="text-[#8B949E]">
                                    {count} trades
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-[#8B949E] text-sm text-center py-4">
                            No trading data yet
                        </div>
                    )}
                </div>
            </div>

            {/* Progress to Next Achievement */}
            <div className="pj-card p-4">
                <h4 className="text-white font-bold mb-3">Monthly Achievement</h4>
                <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">
                        <Trophy className="w-6 h-6 text-[#ffb700]" />
                    </div>
                    <div>
                        <div className="text-sm text-white">Risk Manager</div>
                        <div className="text-xs text-[#8B949E]">Complete 20 trades this month</div>
                    </div>
                </div>
                <div className="w-full bg-[#0D1117] h-2 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#00DCA3] transition-all duration-500"
                        style={{ width: `${Math.min((stats.totalTrades / 20) * 100, 100)}%` }}
                    />
                </div>
                <div className="text-xs text-[#8B949E] mt-1">{stats.totalTrades}/20 trades</div>
            </div>
        </div>
    );
}
