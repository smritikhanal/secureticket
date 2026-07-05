import { cn } from '@/lib/utils';

export function GlassCard({ children, className, as: Tag = 'div', hover = false, ...props }) {
    return (
        <Tag
            className={cn(
                'glass-card rounded-2xl',
                hover && 'glass-card-hover',
                className
            )}
            {...props}
        >
            {children}
        </Tag>
    );
}

export function GlassForm({ children, className, ...props }) {
    return (
        <div
            className={cn(
                'glass-strong rounded-2xl p-8',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function GlassButton({ children, className, ...props }) {
    return (
        <button
            className={cn(
                'glass-button rounded-xl px-6 py-2.5 font-medium text-foreground active:scale-[0.98]',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export function Badge({ children, className, ...props }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm',
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

export function StatusBadge({ status, children }) {
    const colors = {
        published: 'bg-green-50/80 text-green-700 border border-green-200/50',
        draft: 'bg-white/60 text-muted-foreground border border-white/30',
        cancelled: 'bg-red-50/80 text-red-700 border border-red-200/50',
        completed: 'bg-green-50/80 text-green-700 border border-green-200/50',
        valid: 'bg-green-50/80 text-green-700 border border-green-200/50',
        used: 'bg-white/60 text-muted-foreground border border-white/30',
        active: 'bg-green-50/80 text-green-700 border border-green-200/50',
        locked: 'bg-red-50/80 text-red-700 border border-red-200/50',
    };
    return (
        <span className={cn('text-xs px-2.5 py-0.5 rounded-full font-medium backdrop-blur-sm border', colors[status] || 'bg-white/50 text-muted-foreground border-white/20')}>
            {children || status}
        </span>
    );
}
