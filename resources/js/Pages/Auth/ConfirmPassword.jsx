import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { GlassForm } from '@/Components/ui/glass-card';


export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });
    const submit = (e) => { e.preventDefault(); post(route('password.confirm'), { onFinish: () => reset('password') }); };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh-light px-4">
            <Head title="Confirm Password" />
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-foreground">Secure<span className="text-primary">Ticket</span></Link>
                    <div className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-sm border border-white/30 text-foreground text-xs font-semibold px-3 py-1 rounded-full mt-3">
                        Secure Area
                    </div>
                </div>
                <GlassForm>
                    <h1 className="text-xl font-bold text-foreground mb-2">Confirm your password</h1>
                    <p className="text-muted-foreground text-sm mb-6">This is a secure area. Please confirm your password before continuing.</p>
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground" required autoFocus />
                            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                        </div>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Confirming...' : 'Confirm'}
                        </Button>
                    </form>
                </GlassForm>
            </div>
        </div>
    );
}
