import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { GlassForm } from '@/Components/ui/glass-card';
import { LogIn } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '', password: '', remember: false,
    });
    const submit = (e) => { e.preventDefault(); post(route('login')); };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh-light px-4">
            <Head title="Sign In" />
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-foreground">
                        Secure<span className="text-primary">Ticket</span>
                    </Link>
                    <div className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-sm border border-white/30 text-foreground text-xs font-semibold px-3 py-1 rounded-full mt-3">
                        Welcome back
                    </div>
                </div>

                <GlassForm>
                    {status && (
                        <div className="mb-4 text-sm text-green-700 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl px-4 py-3">{status}</div>
                    )}
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground"
                                placeholder="you@example.com" required autoFocus />
                            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground"
                                placeholder="Enter your password" required />
                            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)}
                                    className="rounded border-white/30 text-primary focus:ring-primary bg-white/50" />
                                Remember me
                            </label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-sm text-primary hover:text-primary/80 transition font-medium">Forgot password?</Link>
                            )}
                        </div>
                        <Button type="submit" disabled={processing} className="w-full gap-2">
                            {processing ? 'Signing in...' : 'Sign In'}
                            <LogIn className="w-4 h-4" />
                        </Button>
                    </form>
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Don't have an account?{' '}
                        <Link href={route('register')} className="text-primary hover:text-primary/80 transition font-medium">Register</Link>
                    </p>
                </GlassForm>
            </div>
        </div>
    );
}
