import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { GlassForm, Badge } from '@/Components/ui/glass-card';
import { Mail } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const submit = (e) => { e.preventDefault(); post(route('verification.send')); };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh-light px-4">
            <Head title="Email Verification" />
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-foreground">Secure<span className="text-primary">Ticket</span></Link>
                    <Badge className="bg-white/60 backdrop-blur-sm border border-white/30 text-foreground mt-3">
                        Verify Email
                    </Badge>
                </div>
                <GlassForm className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-5 shadow-sm">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground mb-2">Verify your email</h1>
                    <p className="text-muted-foreground text-sm mb-6">
                        Thanks for signing up! Click the link we sent to your email to verify your account.
                    </p>
                    {status === 'verification-link-sent' && (
                        <div className="mb-4 text-sm text-green-700 bg-green-50/80 border border-green-200/50 rounded-xl px-4 py-3">
                            A new verification link has been sent to your email.
                        </div>
                    )}
                    <form onSubmit={submit} className="space-y-4">
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Sending...' : 'Resend Verification Email'}
                        </Button>
                    </form>
                    <div className="mt-4">
                        <Link href={route('logout')} method="post" as="button"
                            className="text-sm text-muted-foreground hover:text-foreground transition font-medium">
                            Log Out
                        </Link>
                    </div>
                </GlassForm>
            </div>
        </div>
    );
}
