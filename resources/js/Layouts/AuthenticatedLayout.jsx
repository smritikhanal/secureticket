import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { LayoutDashboard, CalendarDays, Tickets, ShoppingBag, UserCog, Settings, PlusCircle, Shield, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Dashboard', href: 'dashboard', icon: LayoutDashboard },
    { label: 'Browse Events', href: 'events.index', icon: CalendarDays },
    { label: 'My Tickets', href: 'tickets.index', icon: Tickets },
    { label: 'Orders', href: 'orders.index', icon: ShoppingBag },
    { label: 'Profile & Security', href: 'profile.edit', icon: UserCog },
];

const organizerItems = [
    { label: 'Manage Events', href: 'events.mine', icon: Settings },
    { label: 'Create Event', href: 'events.create', icon: PlusCircle },
];

const adminItems = [
    { label: 'Admin Panel', href: 'admin.dashboard', icon: Shield },
];

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isActive = (name) => route().current(name) || route().current(`${name}*`);

    const filteredItems = [...navItems];
    if (user.role === 'organizer' || user.role === 'admin') filteredItems.push(...organizerItems);
    if (user.role === 'admin') filteredItems.push(...adminItems);

    return (
        <div className="min-h-screen bg-mesh">
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/70 backdrop-blur-xl border-r border-white/20 flex flex-col transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
                    <Link href={route('dashboard')} className="text-lg font-bold text-foreground flex items-center gap-2">
Secure<span className="text-primary">Ticket</span>
                    </Link>
                </div>
                <div className="px-6 py-4 border-b border-white/10 shrink-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-white/20 text-muted-foreground uppercase bg-white/30">{user.role}</span>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {filteredItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        const linkClass = cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                            active
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-muted-foreground hover:bg-white/50 hover:text-foreground'
                        );
                        const iconClass = cn('w-5 h-5 shrink-0 transition-transform duration-200', active ? 'scale-110' : 'group-hover:scale-110');

                        if (item.href === 'events.index') {
                            return (
                                <a
                                    key={item.href}
                                    href={route(item.href)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setSidebarOpen(false)}
                                    className={linkClass}
                                >
                                    <Icon className={iconClass} />
                                    {item.label}
                                </a>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={route(item.href)}
                                onClick={() => setSidebarOpen(false)}
                                className={linkClass}
                            >
                                <Icon className={iconClass} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="px-3 py-4 border-t border-white/10 shrink-0">
                    <Link
                        href={route('logout')} method="post" as="button"
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        Logout
                    </Link>
                </div>
            </aside>

            <div className="lg:pl-64">
                <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-white/20 lg:hidden">
                    <div className="flex items-center justify-between h-14 px-4">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition">
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href={route('dashboard')} className="text-lg font-bold text-foreground flex items-center gap-2">
                            Secure<span className="text-primary">Ticket</span>
                        </Link>
                        <div className="w-10" />
                    </div>
                </div>
                <main className="min-h-[calc(100vh-3.5rem)] animate-slide-up">{children}</main>
            </div>
        </div>
    );
}
