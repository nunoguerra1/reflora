export function LeafMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M4 20c0-9 6-15 15-16-1 9-7 15-16 16Z"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinejoin="round"
            />
            <path d="M5 19c3-3 6-6 13-14" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
        </svg>
    );
}