'use client';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    animated?: boolean;
}

export default function Logo({ size = 'md', showText = true, animated = false }: LogoProps) {
    const sizes = {
        sm: { icon: 24, text: 'text-xs' },
        md: { icon: 32, text: 'text-sm' },
        lg: { icon: 48, text: 'text-lg' }
    };

    const currentSize = sizes[size];

    return (
        <div className="flex items-center gap-3">
            {/* P•J Logo Icon */}
            <div className={`relative ${animated ? 'animate-pulse' : ''}`} style={{ width: currentSize.icon, height: currentSize.icon }}>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* P letter with chart integration */}
                    <path
                        d="M20 80V20H40C50 20 55 25 55 35C55 45 50 50 40 50H30"
                        stroke="var(--secondary)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* J letter */}
                    <path
                        d="M80 20V60C80 75 70 80 60 80C50 80 45 75 45 70"
                        stroke="var(--accent)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Chart line integration */}
                    <path
                        d="M25 45L35 35L45 42L55 30L65 38L75 25"
                        stroke="var(--secondary)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.6"
                    />
                    {/* Dot between P and J */}
                    <circle cx="50" cy="50" r="3" fill="var(--accent)" />
                </svg>
            </div>

            {/* Text */}
            {showText && (
                <div className="flex flex-col">
                    <span className={`text-white font-bold ${currentSize.text} tracking-wide leading-tight`}>
                        PERFECT JOURNAL
                    </span>
                    <span className="text-[var(--secondary)] text-[8px] uppercase tracking-widest leading-tight">
                        Precision • Performance • Community
                    </span>
                </div>
            )}
        </div>
    );
}
