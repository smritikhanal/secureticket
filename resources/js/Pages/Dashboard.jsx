import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard, Badge } from '@/Components/ui/glass-card';
import { CalendarDays, Tickets, UserCog, Settings, Shield } from 'lucide-react';

const links = [
    { title: 'Browse Events', desc: 'Find and buy tickets', href: 'events.index', icon: CalendarDays },
    { title: 'My Tickets', desc: 'View your purchased tickets', href: 'tickets.index', icon: Tickets },
    { title: 'Profile & Security', desc: 'Update MFA and password', href: 'profile.edit', icon: UserCog },
];

const organizerLinks = [
    { title: 'Manage Events', desc: 'Create and manage your events', href: 'events.mine', icon: Settings },
];

const adminLinks = [
    { title: 'Admin Panel', desc: 'Users, logs, system overview', href: 'admin.dashboard', icon: Shield },
];

export default function Dashboard({ auth }) {
    const user = auth.user;
    const allLinks = [...links];
    if (user.role === 'organizer' || user.role === 'admin') allLinks.push(...organizerLinks);
    if (user.role === 'admin') allLinks.push(...adminLinks);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="mb-10 animate-slide-up">
                    <Badge className="bg-white/60 backdrop-blur-sm border border-white/30 text-foreground">
                        Dashboard
                    </Badge>
                    <h2 className="text-3xl font-bold text-foreground mt-3">Welcome back, {user.name}</h2>
                    <p className="text-muted-foreground mt-1">Here's what you can do on SecureTicket.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {allLinks.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={route(item.href)}
                                className="animate-slide-up"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <GlassCard hover className="p-6 h-full">
                                    <div className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-5 shadow-sm">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                                </GlassCard>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
