import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { GlassForm, Badge } from '@/Components/ui/glass-card';


export default function PasswordExpired() {
    const { data, setData, post, processing, errors } = useForm({
        password: '', password_confirmation: '',
    });
    const submit = (e) => { e.preventDefault(); post(route('password.change.update')); };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh-light px-4">
            <Head title="Password Expired" />
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-foreground">Secure<span className="text-primary">Ticket</span></Link>
                    <Badge className="bg-white/60 backdrop-blur-sm border border-white/30 text-foreground mt-3">
                        Password Expired
                    </Badge>
                </div>
                <GlassForm>
                    <h1 className="text-xl font-bold text-foreground mb-2">Set a new password</h1>
                    <p className="text-muted-foreground text-sm mb-6">Your password is over 90 days old. Please set a new one to continue.</p>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground" required autoFocus />
                            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                            <p className="text-xs text-muted-foreground mt-1">Min 12 chars, uppercase, lowercase, number, symbol</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                            <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground" required />
                        </div>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Updating...' : 'Set New Password'}
                        </Button>
                    </form>
                </GlassForm>
            </div>
        </div>
    );
}
