export function GrainOverlay({ opacity = 0.045 }: { opacity?: number }) {
    return (
        <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay"
            style={{ opacity }}
        >
            <filter id="grain-filter">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.85"
                    numOctaves={3}
                    stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain-filter)" />
        </svg>
    );
}