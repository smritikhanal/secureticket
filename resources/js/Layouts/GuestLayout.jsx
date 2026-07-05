import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, LogIn, User } from 'lucide-react';

export default function GuestLayout({ children, title }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-mesh-light">
            {title && <Head title={title} />}
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
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all duration-200"
                                title="Dashboard"
                            >
                                <User className="w-4 h-4" />
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-all duration-200"
                                title="Sign In"
                            >
                                <LogIn className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
            <main className="pt-16">{children}</main>
        </div>
    );
}
