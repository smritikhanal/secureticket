import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { GlassForm } from '@/Components/ui/glass-card';


export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token, email, password: '', password_confirmation: '',
    });
    const submit = (e) => { e.preventDefault(); post(route('password.store'), { onFinish: () => reset('password', 'password_confirmation') }); };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh-light px-4">
            <Head title="Reset Password" />
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-foreground">Secure<span className="text-primary">Ticket</span></Link>
                    <div className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-sm border border-white/30 text-foreground text-xs font-semibold px-3 py-1 rounded-full mt-3">
                        Set New Password
                    </div>
                </div>
                <GlassForm>
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground" required autoFocus />
                            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground" required />
                            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                            <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground" required />
                            {errors.password_confirmation && <p className="text-destructive text-xs mt-1">{errors.password_confirmation}</p>}
                        </div>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </form>
                </GlassForm>
            </div>
        </div>
    );
}
