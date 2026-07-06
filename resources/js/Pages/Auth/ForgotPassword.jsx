import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { GlassForm } from '@/Components/ui/glass-card';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const submit = (e) => { e.preventDefault(); post(route('password.email')); };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh-light px-4">
            <Head title="Forgot Password" />
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-foreground">Secure<span className="text-primary">Ticket</span></Link>
                    <div className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-sm border border-white/30 text-foreground text-xs font-semibold px-3 py-1 rounded-full mt-3">
                        Reset Password
                    </div>
                </div>
                <GlassForm>
                    <h1 className="text-xl font-bold text-foreground mb-2">Forgot your password?</h1>
                    <p className="text-muted-foreground text-sm mb-6">No problem. Enter your email and we'll send you a reset link.</p>
                    {status && <div className="mb-4 text-sm text-green-700 bg-green-50/80 border border-green-200/50 rounded-xl px-4 py-3">{status}</div>}
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground"
                                placeholder="you@example.com" required autoFocus />
                            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                        </div>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                    <div className="text-center mt-6">
                        <Link href={route('login')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition font-medium">
                            <ArrowLeft className="w-3 h-3" /> Back to sign in
                        </Link>
                    </div>
                </GlassForm>
            </div>
        </div>
    );
}
