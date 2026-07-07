import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard } from '@/Components/ui/glass-card';
import { Button } from '@/Components/ui/button';
import { User, Lock, Shield, Trash2, Sparkles } from 'lucide-react';

export default function ProfileEdit({ auth, status }) {
    const user = auth.user;
    const profileForm = useForm({ name: user.name, email: user.email });
    const passwordForm = useForm({ current_password: '', password: '', password_confirmation: '' });
    const submitProfile = (e) => { e.preventDefault(); profileForm.patch(route('profile.update')); };
    const submitPassword = (e) => { e.preventDefault(); passwordForm.put(route('password.update'), { onSuccess: () => passwordForm.reset() }); };
    const toggleMfa = () => router.post(user.mfa_enabled ? route('mfa.disable') : route('mfa.enable'));

    return (
        <AuthenticatedLayout>
            <Head title="Profile & Security" />
            <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
                <div className="animate-slide-up">
                    <h1 className="text-3xl font-bold text-foreground">Profile & Security</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your account settings</p>
                </div>
                {status && <div className="animate-slide-up text-sm text-green-700 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl px-4 py-3">{status}</div>}

                <GlassCard className="rounded-2xl p-6 animate-slide-up delay-100">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-sm"><User className="w-5 h-5 text-primary" /></div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Profile Information</h2>
                    </div>
                    <form onSubmit={submitProfile} className="space-y-4">
                        <div><label className="block text-sm font-medium text-foreground mb-1.5">Name</label><input type="text" value={profileForm.data.name} onChange={e => profileForm.setData('name', e.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground" />{profileForm.errors.name && <p className="text-destructive text-xs mt-1">{profileForm.errors.name}</p>}</div>
                        <div><label className="block text-sm font-medium text-foreground mb-1.5">Email</label><input type="email" value={profileForm.data.email} onChange={e => profileForm.setData('email', e.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground" />{profileForm.errors.email && <p className="text-destructive text-xs mt-1">{profileForm.errors.email}</p>}</div>
                        <div className="flex items-center justify-between pt-1"><span className="text-xs text-muted-foreground">Role: <span className="font-medium text-foreground">{user.role}</span></span><Button type="submit" disabled={profileForm.processing}>{profileForm.processing ? 'Saving...' : 'Save'}</Button></div>
                    </form>
                </GlassCard>

                <GlassCard className="rounded-2xl p-6 animate-slide-up delay-200">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-sm"><Lock className="w-5 h-5 text-primary" /></div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Change Password</h2>
                    </div>
                    <form onSubmit={submitPassword} className="space-y-4">
                        {['current_password', 'password', 'password_confirmation'].map(field => (
                            <div key={field}><label className="block text-sm font-medium text-foreground mb-1.5 capitalize">{field.replace(/_/g, ' ')}</label><input type="password" value={passwordForm.data[field]} onChange={e => passwordForm.setData(field, e.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground" />{passwordForm.errors[field] && <p className="text-destructive text-xs mt-1">{passwordForm.errors[field]}</p>}</div>
                        ))}
                        <Button type="submit" disabled={passwordForm.processing}>{passwordForm.processing ? 'Updating...' : 'Update Password'}</Button>
                    </form>
                </GlassCard>

                <GlassCard className="rounded-2xl p-6 animate-slide-up delay-300">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-sm"><Shield className="w-5 h-5 text-primary" /></div>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Two-Factor Authentication</h2>
                    </div>
                    <p className="text-muted-foreground text-sm mb-5">{user.mfa_enabled ? 'MFA is enabled. A 6-digit code will be sent to your email on each login.' : 'Add an extra layer of security to your account.'}</p>
                    <Button onClick={toggleMfa} variant={user.mfa_enabled ? 'secondary' : 'default'}>{user.mfa_enabled ? 'Disable MFA' : 'Enable MFA'}</Button>
                </GlassCard>

                <div className="animate-slide-up delay-400">
                    <GlassCard className="rounded-2xl p-6 border border-red-200/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-red-200/50 flex items-center justify-center shadow-sm"><Trash2 className="w-5 h-5 text-destructive" /></div>
                            <h2 className="text-sm font-semibold text-destructive uppercase tracking-wider">Danger Zone</h2>
                        </div>
                        <p className="text-muted-foreground text-sm mb-5">Permanently delete your account and all data.</p>
                        <Button variant="outline" className="border-red-200/50 text-destructive hover:bg-destructive/10" onClick={e => { if (!confirm('Are you sure? This cannot be undone.')) e.preventDefault(); else router.delete(route('profile.destroy')); }}>Delete Account</Button>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
