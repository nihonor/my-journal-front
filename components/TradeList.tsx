'use client';
import { Trade } from '@/types';
import { format } from 'date-fns';
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '@/utils/api';

interface Props {
    trades: Trade[];
    onUpdate: () => void;
}

export default function TradeList({ trades, onUpdate }: Props) {
    const handleCloseTrade = async (id: string, currentPrice?: number) => {
        const exitPrice = prompt("Enter Exit Price:", currentPrice?.toString());
        if (exitPrice) {
            try {
                await api.put(`/trades/${id}`, {
                    exit_price: parseFloat(exitPrice),
                    status: 'Closed'
                });
                onUpdate();
            } catch (error) {
                alert("Failed to close trade");
            }
        }
    };

    if (trades.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#161B22]">
                <div className="w-12 h-12 rounded-full bg-[#0D1117] flex items-center justify-center mb-4 border border-[#30363D]">
                    <span className="text-2xl">📝</span>
                </div>
                <h4 className="text-white font-medium mb-1">No trades yet</h4>
                <p className="text-[#8B949E] text-xs">Create your first trade to start tracking.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#161B22] border-t border-[#30363D]">
            <div className="p-4 border-b border-[#30363D] flex justify-between items-center bg-[#161B22]">
                <h4 className="text-xs font-bold text-[#8B949E] uppercase tracking-wider">History</h4>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-[#30363D]">
                    {trades.map((trade) => (
                        <div key={trade._id} className="p-4 hover:bg-[#0D1117] transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${trade.type === 'Long' ? 'bg-[#00DCA3]/10 text-[#00DCA3]' : 'bg-[#da3633]/10 text-[#da3633]'}`}>
                                    {trade.type === 'Long' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#EAECEF]">{trade.pair}</p>
                                    <p className="text-[10px] text-[#8B949E]">{format(new Date(trade.trade_date), 'MMM dd, HH:mm')}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className={`text-sm font-mono font-medium ${trade.profit_loss && trade.profit_loss >= 0 ? 'text-[#00DCA3]' : trade.profit_loss ? 'text-[#da3633]' : 'text-[#EAECEF]'}`}>
                                    {trade.profit_loss ? `$${trade.profit_loss.toFixed(2)}` : 'OPEN'}
                                </p>
                                {trade.status === 'Open' ? (
                                    <button
                                        onClick={() => trade._id && handleCloseTrade(trade._id, trade.entry_price)}
                                        className="text-[10px] text-[#da3633] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Close Trade
                                    </button>
                                ) : (
                                    <p className="text-[10px] text-[#8B949E]">{trade.status}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
