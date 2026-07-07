import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard, StatusBadge } from '@/Components/ui/glass-card';
import { Button } from '@/Components/ui/button';
import { Search, Sparkles } from 'lucide-react';

export default function AdminUsers({ users, search }) {
    const [searchVal, setSearchVal] = useState(search || '');
    const doSearch = (e) => { e.preventDefault(); router.get(route('admin.users'), { search: searchVal }, { preserveState: true }); };
    const updateRole = (userId, role) => { router.patch(route('admin.users.role', userId), { role }); };
    const toggleLock = (userId) => { router.post(route('admin.users.lock', userId)); };
    const deleteUser = (userId) => { if (confirm('Delete this user permanently?')) router.delete(route('admin.users.destroy', userId)); };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Users" />
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-slide-up">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Users</h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage all registered users</p>
                    </div>
                    <form onSubmit={doSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)}
                                placeholder="Search name or email..."
                                className="glass-input rounded-xl pl-9 pr-4 py-2 text-sm w-64 text-foreground placeholder:text-muted-foreground" />
                        </div>
                        <Button type="submit" size="sm" variant="secondary">Search</Button>
                    </form>
                </div>

                <div className="animate-slide-up delay-100">
                    <GlassCard className="rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/30">
                                        <th className="text-left px-5 py-3.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">User</th>
                                        <th className="text-left px-5 py-3.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">Role</th>
                                        <th className="text-left px-5 py-3.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">Status</th>
                                        <th className="text-left px-5 py-3.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">MFA</th>
                                        <th className="text-left px-5 py-3.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">Joined</th>
                                        <th className="text-right px-5 py-3.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map(user => (
                                        <tr key={user.id} className="border-b border-white/10 hover:bg-white/30 transition">
                                            <td className="px-5 py-3.5"><p className="text-foreground font-medium">{user.name}</p><p className="text-muted-foreground text-xs">{user.email}</p></td>
                                            <td className="px-5 py-3.5">
                                                <select value={user.role} onChange={e => updateRole(user.id, e.target.value)}
                                                    className="glass-input text-xs rounded-lg px-2 py-1 text-foreground">
                                                    <option value="user">user</option><option value="organizer">organizer</option><option value="admin">admin</option>
                                                </select>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <StatusBadge status={user.locked_until && new Date(user.locked_until) > new Date() ? 'locked' : 'active'} />
                                            </td>
                                            <td className="px-5 py-3.5"><span className={cn('text-xs font-medium', user.mfa_enabled ? 'text-green-600' : 'text-muted-foreground')}>{user.mfa_enabled ? 'On' : 'Off'}</span></td>
                                            <td className="px-5 py-3.5 text-muted-foreground text-xs">{new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="secondary" onClick={() => toggleLock(user.id)}>
                                                        {user.locked_until && new Date(user.locked_until) > new Date() ? 'Unlock' : 'Lock'}
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => deleteUser(user.id)}>Delete</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {users.last_page > 1 && (
                            <div className="flex justify-center gap-2 px-5 py-4 border-t border-white/10">
                                {users.links.map((link, i) => (
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

function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
