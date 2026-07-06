import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
import { Button } from '@/Components/ui/button';
import { GlassForm } from '@/Components/ui/glass-card';
import { UserPlus } from 'lucide-react';

const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-primary', 'bg-green-500'];

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const [strength, setStrength] = useState(null);
    useEffect(() => { if (data.password) setStrength(zxcvbn(data.password)); else setStrength(null); }, [data.password]);
    const submit = (e) => { e.preventDefault(); post(route('register')); };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh-light px-4">
            <Head title="Register" />
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-foreground">
                        Secure<span className="text-primary">Ticket</span>
                    </Link>
                    <div className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-sm border border-white/30 text-foreground text-xs font-semibold px-3 py-1 rounded-full mt-3">
                        Join us today
                    </div>
                </div>
                <GlassForm>
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground"
                                placeholder="John Doe" required autoFocus />
                            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground"
                                placeholder="you@example.com" required />
                            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground"
                                placeholder="Min 12 chars, mixed case, number, symbol" required />
                            {strength !== null && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[0,1,2,3,4].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strengthColor[strength.score] : 'bg-white/30'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Strength: <span className="font-medium text-foreground">{strengthLabel[strength.score]}</span>
                                        {strength.feedback.suggestions[0] && <span className="text-destructive"> &mdash; {strength.feedback.suggestions[0]}</span>}
                                    </p>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">Min 12 chars, uppercase, lowercase, number, symbol</p>
                            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                            <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground"
                                placeholder="Repeat your password" required />
                        </div>
                        <Button type="submit" disabled={processing} className="w-full gap-2">
                            {processing ? 'Creating account...' : 'Create Account'}
                            <UserPlus className="w-4 h-4" />
                        </Button>
                    </form>
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{' '}
                        <Link href={route('login')} className="text-primary hover:text-primary/80 transition font-medium">Sign in</Link>
                    </p>
                </GlassForm>
            </div>
        </div>
    );
}
