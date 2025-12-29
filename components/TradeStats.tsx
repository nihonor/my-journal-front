'use client';
import { TradeStats } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, Maximize2 } from 'lucide-react';

interface Props {
    stats: TradeStats;
}

export default function TradeStatsDashboard({ stats }: Props) {
    const isProfitable = stats.totalProfit >= 0;
    const accentColor = isProfitable ? '#0ecb81' : '#f6465d';

    return (
        <div className="terminal-panel h-full flex flex-col p-0 overflow-hidden relative">
            {/* Header Ticker */}
            <div className="p-4 border-b border-[#2a2e39] flex justify-between items-start bg-[#151a21]">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-[#eaecef]">P/L Curve</h2>
                        <span className={`text-sm px-2 py-0.5 rounded ${isProfitable ? 'bg-[#0ecb81]/10 text-[#0ecb81]' : 'bg-[#f6465d]/10 text-[#f6465d]'}`}>
                            {stats.winRate.toFixed(1)}% Win Rate
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-3xl font-mono font-medium ${isProfitable ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                            ${stats.totalProfit.toFixed(2)}
                        </span>
                        <span className="text-xs text-[#848e9c]">Net Profit</span>
                    </div>
                </div>

                <div className="flex gap-4 text-xs font-mono">
                    <div className="text-right">
                        <p className="text-[#848e9c]">Wins</p>
                        <p className="text-[#0ecb81]">{stats.winningTrades}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[#848e9c]">Losses</p>
                        <p className="text-[#f6465d]">{stats.losingTrades}</p>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="h-8 border-b border-[#2a2e39] flex items-center px-2 gap-2 bg-[#1e2329]">
                <span className="text-[10px] text-[#eaecef] font-bold px-2 border-r border-[#2a2e39]">Daily</span>
                <Settings size={14} className="text-[#848e9c] ml-auto cursor-pointer hover:text-[#eaecef]" />
                <Maximize2 size={14} className="text-[#848e9c] cursor-pointer hover:text-[#eaecef]" />
            </div>

            {/* Chart */}
            <div className="flex-1 w-full min-h-[300px] bg-[#0b0e11] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.dailyPL} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPl" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={accentColor} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="1 1" stroke="#2a2e39" vertical={false} />
                        <XAxis
                            dataKey="_id"
                            stroke="#848e9c"
                            tick={{ fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#848e9c"
                            tick={{ fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            orientation="right"
                            dx={10}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e2329', border: '1px solid #2a2e39', borderRadius: '4px' }}
                            itemStyle={{ color: '#eaecef', fontFamily: 'monospace' }}
                            labelStyle={{ color: '#848e9c', fontSize: '10px', marginBottom: '4px' }}
                            cursor={{ stroke: '#848e9c', strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke={accentColor}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPl)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="absolute top-4 left-4 text-[10px] text-[#848e9c] font-mono">
                    MA50: <span className="text-[#f6465d]">406.83</span> MA200: <span className="text-[#e2b93d]">400.10</span>
                </div>
            </div>
        </div>
    );
}
