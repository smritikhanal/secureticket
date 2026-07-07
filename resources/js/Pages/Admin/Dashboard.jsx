import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard } from '@/Components/ui/glass-card';
import { cn } from '@/lib/utils';
import { Users, FileText, Activity } from 'lucide-react';

export default function AdminDashboard({ stats, recent_logs }) {
    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
                    <p className="text-muted-foreground text-sm mt-1">System overview and management</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-slide-up delay-100">
                    <StatCard label="Total Users" value={stats.total_users} icon={Users} />
                    <StatCard label="Total Events" value={stats.total_events} icon={Activity} />
                    <StatCard label="Total Orders" value={stats.total_orders} icon={FileText} />
                    <StatCard label="Revenue" value={`Rs ${Number(stats.total_revenue).toFixed(2)}`} icon={Users} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 animate-slide-up delay-200">
                    <Link href={route('admin.users')} className="group">
                        <GlassCard hover className="rounded-2xl p-6">
                            <div className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-4 shadow-sm"><Users className="w-6 h-6 text-primary" /></div>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">Manage Users</h3>
                            <p className="text-sm text-muted-foreground mt-1">View, role-change, lock/unlock users</p>
                        </GlassCard>
                    </Link>
                    <Link href={route('admin.logs')} className="group">
                        <GlassCard hover className="rounded-2xl p-6">
                            <div className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-4 shadow-sm"><FileText className="w-6 h-6 text-primary" /></div>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">Activity Logs</h3>
                            <p className="text-sm text-muted-foreground mt-1">Monitor all user actions and security events</p>
                        </GlassCard>
                    </Link>
                </div>

                <GlassCard className="rounded-2xl p-6 animate-slide-up delay-300">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /><h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Activity</h2></div>
                        <Link href={route('admin.logs')} className="text-xs text-primary hover:text-primary/80 transition font-medium">View all &rarr;</Link>
                    </div>
                    <div className="space-y-2">
                        {recent_logs.map(log => (
                            <LogRow key={log.id} log={log} />
                        ))}
                    </div>
                </GlassCard>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value }) {
    return (
        <GlassCard className="rounded-2xl p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
        </GlassCard>
    );
}

function LogRow({ log }) {
    const actionColor = { login: 'text-green-600', login_failed: 'text-destructive', register: 'text-primary', logout: 'text-muted-foreground' };
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
            <div className="flex items-center gap-3">
                <span className={cn('text-xs font-mono font-medium', actionColor[log.action] || 'text-muted-foreground')}>{log.action}</span>
                <span className="text-xs text-muted-foreground">{log.user?.email ?? 'guest'}</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground font-mono">{log.ip_address}</span>
                <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
}
