import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard } from '@/Components/ui/glass-card';
import { cn } from '@/lib/utils';

export default function AdminLogs({ logs, actions, filters }) {
    const [action, setAction] = useState(filters.action || '');
    const filter = (val) => { setAction(val); router.get(route('admin.logs'), { action: val }, { preserveState: true }); };
    const actionColor = { login: 'text-green-600', login_failed: 'text-destructive', register: 'text-primary', logout: 'text-muted-foreground', 'events.store': 'text-primary', 'orders.store': 'text-primary' };

    return (
        <AuthenticatedLayout>
            <Head title="Activity Logs" />
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-slide-up">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
                        <p className="text-muted-foreground text-sm mt-1">Monitor all user actions and security events</p>
                    </div>
                    <select value={action} onChange={e => filter(e.target.value)} className="glass-input rounded-xl px-3 py-2 text-sm text-foreground">
                        <option value="">All Actions</option>
                        {actions.map(a => (<option key={a} value={a}>{a}</option>))}
                    </select>
                </div>
                <div className="animate-slide-up delay-100">
                    <GlassCard className="rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/30">
                                        <th className="text-left px-5 py-3.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">Action</th>
                                        <th className="text-left px-5 py-3.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">User</th>
                                        <th className="text-left px-5 py-3.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">IP Address</th>
                                        <th className="text-left px-5 py-3.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">Metadata</th>
                                        <th className="text-left px-5 py-3.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.data.map(log => (
                                        <tr key={log.id} className="border-b border-white/10 hover:bg-white/30 transition">
                                            <td className="px-5 py-3.5"><span className={cn('text-xs font-mono font-medium', actionColor[log.action] || 'text-muted-foreground')}>{log.action}</span></td>
                                            <td className="px-5 py-3.5"><p className="text-foreground text-xs">{log.user?.name || '\u2014'}</p><p className="text-muted-foreground text-xs">{log.user?.email ?? 'guest'}</p></td>
                                            <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{log.ip_address}</td>
                                            <td className="px-5 py-3.5 text-muted-foreground text-xs font-mono max-w-xs truncate">{log.metadata ? JSON.stringify(log.metadata) : '\u2014'}</td>
                                            <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">{new Date(log.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {logs.last_page > 1 && (
                            <div className="flex justify-center gap-2 px-5 py-4 border-t border-white/10">
                                {logs.links.map((link, i) => (
                                    <button key={i} onClick={() => link.url && router.get(link.url)} disabled={!link.url}
                                        className={cn('text-xs px-3 py-1.5 rounded-lg border transition font-medium backdrop-blur-sm',
                                            link.active ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'border-white/30 text-muted-foreground hover:text-foreground hover:bg-white/50 disabled:opacity-30')}
                                        >{link.label}</button>
                                ))}
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
