'use client';
import { LayoutDashboard, PlusCircle, Users, BarChart2, Award, BookOpen, LogOut } from 'lucide-react';

export default function Sidebar({ onViewChange }: { onViewChange: (view: string) => void }) {
    return (
        <div className="w-64 flex flex-col py-6 px-4 bg-[#0D1117] border-r border-[#30363D] h-screen fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="mb-10 flex items-center gap-3 px-2">
                <span className="text-[#00DCA3] font-black text-2xl tracking-tighter">PJ</span>
                <div className="flex flex-col">
                    <span className="text-white font-bold text-sm tracking-wide">PERFECT JOURNAL</span>
                    <span className="text-[#565D68] text-[8px] uppercase tracking-widest">Precision • Performance</span>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem icon={LayoutDashboard} label="Dashboard" active onClick={() => onViewChange('dashboard')} />
                <NavItem icon={PlusCircle} label="New Trade" onClick={() => onViewChange('new-trade')} />
                <NavItem icon={Users} label="Community" />
                <NavItem icon={BarChart2} label="Analytics" />
                <NavItem icon={Award} label="Challenges" />

                <div className="mt-8 pt-8 border-t border-[#30363D]">
                    <NavItem icon={BookOpen} label="Academy" />
                </div>
            </nav>

            <div className="mt-auto flex items-center gap-3 px-3 py-3 rounded-xl bg-[#161B22] border border-[#30363D] cursor-pointer hover:border-[#00DCA3] transition-all">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-[#00DCA3]"></div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-white">Apprentice</p>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#00DCA3]"></div>
                        <p className="text-[10px] text-[#8B949E]">Online</p>
                    </div>
                </div>
                <LogOut size={14} className="text-[#8B949E] hover:text-[#da3633]" onClick={() => {
                    localStorage.removeItem('token');
                    window.location.reload();
                }} />
            </div>
        </div>
    );
}

function NavItem({ icon: Icon, label, active = false, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${active ? 'bg-[#00DCA3] text-black shadow-[0_0_15px_rgba(0,220,163,0.2)]' : 'text-[#8B949E] hover:bg-[#161B22] hover:text-[#EAECEF]'}`}
        >
            <Icon size={18} />
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}
