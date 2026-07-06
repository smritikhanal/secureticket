import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { GlassForm, Badge } from '@/Components/ui/glass-card';
import { Shield } from 'lucide-react';

export default function MfaVerify({ status }) {
    const { data, setData, post, processing, errors } = useForm({ code: '' });
    const submit = (e) => { e.preventDefault(); post(route('mfa.verify.submit')); };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh-light px-4">
            <Head title="Verify Login" />
            <div className="w-full max-w-sm animate-slide-up">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-foreground">Secure<span className="text-primary">Ticket</span></Link>
                    <Badge className="bg-white/60 backdrop-blur-sm border border-white/30 text-foreground mt-3">
                        Two-Factor Auth
                    </Badge>
                </div>
                <GlassForm className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-5 shadow-sm">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground mb-2">Check your email</h1>
                    <p className="text-muted-foreground text-sm mb-6">We sent a 6-digit code to your email. It expires in 5 minutes.</p>
                    {status && <p className="mb-4 text-sm text-green-700 bg-green-50/80 border border-green-200/50 rounded-xl px-4 py-2">{status}</p>}
                    <form onSubmit={submit} className="space-y-4">
                        <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} maxLength={6}
                            placeholder="000000"
                            className="glass-input w-full text-center text-2xl tracking-[0.5em] rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground font-mono"
                            required autoFocus />
                        {errors.code && <p className="text-destructive text-xs">{errors.code}</p>}
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Verifying...' : 'Verify Code'}
                        </Button>
                    </form>
                    <button onClick={() => router.post(route('mfa.resend'))}
                        className="mt-4 text-sm text-muted-foreground hover:text-foreground transition font-medium">
                        Resend code
                    </button>
                </GlassForm>
            </div>
        </div>
    );
}
