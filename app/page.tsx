'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00DCA3] opacity-5 blur-[120px] rounded-full pointing-events-none"></div>

      <div className="z-10 text-center max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-[#00DCA3] font-black text-3xl tracking-tighter">PJ</span>
          <div className="flex flex-col text-left">
            <span className="text-white font-bold text-lg tracking-wide">PERFECT JOURNAL</span>
            <span className="text-[#565D68] text-[10px] uppercase tracking-widest">Precision • Performance • Community</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white to-[#8B949E] bg-clip-text text-transparent">
          Your Trading Diary,<br />Perfected
        </h1>

        <p className="text-[#8B949E] text-lg mb-10 font-light">
          Journal trades. Follow masters. Perfect your craft.
        </p>

        <Link href="/dashboard">
          <button className="bg-[#00DCA3] hover:bg-[#00bda0] text-black font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_20px_rgba(0,220,163,0.4)] transition-all flex items-center gap-2 mx-auto">
            Get Started <ArrowRight size={20} />
          </button>
        </Link>
      </div>

      <div className="absolute bottom-8 text-[#30363D] text-xs">
        © 2025 Perfect Journal. All rights reserved.
      </div>
    </div>
  );
}
