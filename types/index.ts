export interface Trade {
    _id?: string;
    pair: string;
    type: 'Long' | 'Short';
    lot_size: number;
    entry_price: number;
    exit_price?: number;
    stop_loss?: number;
    take_profit?: number;
    profit_loss?: number;
    notes?: string;
    status: 'Open' | 'Closed' | 'Pending';
    trade_date: string;
}

export interface TradeStats {
    totalTrades: number;
    totalProfit: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    dailyPL: { _id: string; total: number }[];
}
