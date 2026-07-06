import { Head, Link } from '@inertiajs/react';
import { Hero } from '@/Components/ui/animated-hero';
import { Badge } from '@/Components/ui/glass-card';
import { LiquidGlassCard } from '@/Components/ui/liquid-weather-glass';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import {
    ArrowRight, Ticket, Shield, CreditCard, Star, TrendingUp,
    Users, HeartHandshake,
    Globe, Zap,
    Calendar, LogIn, User
} from 'lucide-react';

const stats = [
    { label: 'Active Users', value: '12,000+', icon: Users },
    { label: 'Events Hosted', value: '850+', icon: TrendingUp },
    { label: 'Tickets Sold', value: '50,000+', icon: Ticket },
    { label: 'Happy Customers', value: '98%', icon: Star },
];

const features = [
    { icon: Ticket, title: 'Digital Tickets', desc: 'QR-verified digital tickets — no printing, no hassle, no scams. Instant delivery to your inbox.' },
    { icon: Shield, title: 'Secure Checkout', desc: 'Payments processed by Stripe. Your financial data never touches our servers. PCI compliant.' },
    { icon: CreditCard, title: 'Instant Purchase', desc: 'Buy tickets in seconds and get your QR codes immediately. No waiting, no delays.' },
    { icon: HeartHandshake, title: 'Fair Refunds', desc: 'Hassle-free refunds and transfers. We believe in putting our customers first, always.' },
    { icon: Globe, title: 'Global Reach', desc: 'Attend events from anywhere. Virtual and in-person events across multiple cities.' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed. Browse, buy, and get your tickets in under 60 seconds.' },
];

const testimonials = [
    { name: 'Sarah Chen', role: 'Event Organizer', avatar: 'SC', text: 'SecureTicket made selling tickets effortless. The QR check-in system saved us hours at the door.' },
    { name: 'Marcus Rivera', role: 'Concert Goer', avatar: 'MR', text: 'I love how fast it is. Found a show, bought tickets, and got my QR code in under a minute.' },
    { name: 'Emily Watson', role: 'Venue Manager', avatar: 'EW', text: 'The security features are outstanding. No more fake tickets or scalpers at our venue.' },
];

const faqs = [
    { q: 'How do I buy tickets?', a: 'Browse events, select your quantity, and checkout securely with Stripe. Your tickets arrive instantly via QR code.' },
    { q: 'Are my payments secure?', a: 'Absolutely. All payments are processed by Stripe, the industry standard for secure online transactions.' },
    { q: 'Can I get a refund?', a: 'Yes, refunds are handled per event policy. Contact the organizer or our support team for assistance.' },
    { q: 'How do I use my QR ticket?', a: 'Present your QR code at the venue entrance. The organizer scans it for instant, paperless entry.' },
];

export default function Welcome({ canLogin, canRegister, events }) {
    return (
        <div className="min-h-screen bg-mesh-light">
            <Head title="SecureTicket" />

            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-foreground">
                        Secure<span className="text-primary">Ticket</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('events.index')}
                            className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-all duration-200"
                            title="Events"
                        >
                            <Calendar className="w-4 h-4" />
                        </Link>
                        <a
                            href="#features"
                            className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-all duration-200 hidden sm:flex"
                            title="Features"
                        >
                            <Star className="w-4 h-4" />
                        </a>
                        {canLogin ? (
                            <Link
                                href={route('login')}
                                className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-all duration-200"
                                title="Sign In"
                            >
                                <LogIn className="w-4 h-4" />
                            </Link>
                        ) : (
                            <Link
                                href={route('dashboard')}
                                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all duration-200"
                                title="Dashboard"
                            >
                                <User className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <Hero />

            <section className="py-16 px-6 relative bg-mesh-light/50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {stats.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                                    <LiquidGlassCard draggable={false} borderRadius="16px" glowIntensity="xs" shadowIntensity="xs" className="p-6 text-center">
                                        <div className="w-11 h-11 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-3 shadow-sm">
                                            <Icon className="w-5.5 h-5.5 text-primary" />
                                        </div>
                                        <p className="text-2xl font-bold text-foreground">{s.value}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                                    </LiquidGlassCard>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 animate-slide-up">
                        <Badge className="bg-white/60 backdrop-blur-sm border border-white/30 text-foreground">
                            Why Choose Us
                        </Badge>
                        <h2 className="text-3xl font-bold text-foreground mt-4">Everything you need</h2>
                        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Secure, fast, and reliable ticketing platform trusted by thousands.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                    <LiquidGlassCard draggable={false} borderRadius="16px" glowIntensity="xs" shadowIntensity="xs" className="p-6 h-full">
                                        <div className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-5 shadow-sm">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                                    </LiquidGlassCard>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-mesh-light/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-slide-up">
                        <Badge className="bg-white/60 backdrop-blur-sm border border-white/30 text-foreground">
                            Featured Events
                        </Badge>
                        <h2 className="text-3xl font-bold text-foreground mt-4">Upcoming events you'll love</h2>
                        <p className="text-muted-foreground mt-2">Discover and book tickets for the best events in town.</p>
                    </div>

                    {events.length === 0 ? (
                        <div className="text-center py-20 animate-scale-in">
                            <LiquidGlassCard draggable={false} borderRadius="16px" glowIntensity="xs" shadowIntensity="xs" className="p-12 max-w-md mx-auto">
                                <p className="text-muted-foreground text-lg">No upcoming events yet.</p>
                                <p className="text-muted-foreground/60 text-sm mt-1">Check back soon.</p>
                            </LiquidGlassCard>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event, i) => (
                                <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12 animate-slide-up">
                        <Button size="lg" className="gap-2" asChild>
                            <Link href={route('events.index')}>
                                View All Events <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 animate-slide-up">
                        <Badge className="bg-white/60 backdrop-blur-sm border border-white/30 text-foreground">
                            Testimonials
                        </Badge>
                        <h2 className="text-3xl font-bold text-foreground mt-4">What people say</h2>
                        <p className="text-muted-foreground mt-2">Trusted by event organizers and attendees alike.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                                <LiquidGlassCard draggable={false} borderRadius="16px" glowIntensity="xs" shadowIntensity="xs" className="p-6 h-full">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{t.text}"</p>
                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center text-xs font-bold text-foreground shadow-sm">
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{t.name}</p>
                                            <p className="text-xs text-muted-foreground">{t.role}</p>
                                        </div>
                                    </div>
                                </LiquidGlassCard>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-mesh-light/50">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16 animate-slide-up">
                        <Badge className="bg-white/60 backdrop-blur-sm border border-white/30 text-foreground">
                            FAQ
                        </Badge>
                        <h2 className="text-3xl font-bold text-foreground mt-4">Got questions?</h2>
                        <p className="text-muted-foreground mt-2">Everything you need to know about SecureTicket.</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <LiquidGlassCard draggable={false} borderRadius="16px" glowIntensity="xs" shadowIntensity="xs" className="p-6">
                                    <h3 className="font-semibold text-foreground mb-1">{faq.q}</h3>
                                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                                </LiquidGlassCard>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="animate-scale-in">
                        <LiquidGlassCard draggable={false} borderRadius="24px" glowIntensity="xs" shadowIntensity="xs" className="p-12 md:p-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Ready to find your next event?
                            </h2>
                            <p className="text-muted-foreground mb-8 text-lg max-w-lg mx-auto">
                                Join thousands of users buying and selling tickets on SecureTicket.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <Button size="lg" className="gap-2" asChild>
                                    <Link href={route('events.index')}>
                                        Browse Events <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                                {canRegister && (
                                    <Button size="lg" variant="outline" className="bg-white/70 backdrop-blur-sm border-white/30" asChild>
                                        <Link href={route('register')}>Create Account</Link>
                                    </Button>
                                )}
                            </div>
                        </LiquidGlassCard>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/20 py-12 px-6 bg-white/40 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <Link href="/" className="text-lg font-bold text-foreground">Secure<span className="text-primary">Ticket</span></Link>
                        <p className="text-muted-foreground text-xs mt-1">Security Coursework 2</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href={route('events.index')} className="text-xs text-muted-foreground hover:text-foreground transition">Events</Link>
                        <a href="#features" className="text-xs text-muted-foreground hover:text-foreground transition">Features</a>
                        {canLogin && <Link href={route('login')} className="text-xs text-muted-foreground hover:text-foreground transition">Sign In</Link>}
                        {canRegister && <Link href={route('register')} className="text-xs text-muted-foreground hover:text-foreground transition">Register</Link>}
                    </div>
                </div>
            </footer>
        </div>
    );
}

function EventCard({ event }) {
    const available = event.total_tickets - event.tickets_sold;
    const soldOut = available <= 0;
    const imgId = (event.id % 10) + 1;

    return (
        <Link href={route('events.show', event.id)} className="group block">
            <LiquidGlassCard draggable={false} borderRadius="16px" glowIntensity="xs" shadowIntensity="xs" className="overflow-hidden">
                <div className="h-44 overflow-hidden">
                    <img
                        src={`https://images.unsplash.com/photo-${imgId === 1 ? '1492684223066-81342ee5ff30' : imgId === 2 ? '1501281668745-f7f57925c3b4' : imgId === 3 ? '1470229722913-458c0b6b7b4c' : imgId === 4 ? '1505236858219-8359eb29e329' : imgId === 5 ? '1459749411175-04bf5292ceea' : imgId === 6 ? '1429962714458-bb90b8bd09fc' : imgId === 7 ? '1505373879540-10c566aedd4b' : imgId === 8 ? '1459749411175-04bf5292ceea' : imgId === 9 ? '1493225457125-f2c8a4f6c6b2' : '1472653815458-d4b4a0a2f2b9'}?w=600&h=300&fit=crop`}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${
                            soldOut ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-primary/10 text-primary border border-primary/20'
                        }`}>{soldOut ? 'Sold Out' : `${available} left`}</span>
                        <span className="text-xs text-muted-foreground">{new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <div>
                            <p className="text-xs text-muted-foreground">{event.venue}</p>
                            <p className="text-xs text-muted-foreground/70 mt-0.5">by {event.organizer?.name}</p>
                        </div>
                        <span className="text-foreground font-bold text-lg">{event.ticket_price == 0 ? 'Free' : `Rs ${event.ticket_price}`}</span>
                    </div>
                </div>
            </LiquidGlassCard>
        </Link>
    );
}
