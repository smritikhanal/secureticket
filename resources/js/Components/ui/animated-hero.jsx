import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/Components/ui/button";

function Hero() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["secure", "fast", "simple", "reliable", "smart"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col"
            style={{
                background: "linear-gradient(180deg, #eef2ff 0%, #ffffff 50%, #ffffff 100%)",
            }}
        >
            {/* Dashed circles */}
            <div className="absolute inset-0 pointer-events-none select-none">
                <svg className="absolute animate-spin-slow"
                    style={{ left: "3%", top: "3%", width: "200px", height: "200px" }}
                    viewBox="0 0 200 200" fill="none"
                >
                    <circle cx="100" cy="100" r="75" stroke="#818cf8" strokeWidth="2" strokeDasharray="8 12" opacity="0.6" />
                </svg>
                <svg className="absolute animate-spin-slower"
                    style={{ right: "5%", top: "55%", width: "260px", height: "260px" }}
                    viewBox="0 0 260 260" fill="none"
                >
                    <circle cx="130" cy="130" r="100" stroke="#a78bfa" strokeWidth="2" strokeDasharray="10 16" opacity="0.55" />
                </svg>
                <svg className="absolute animate-spin-slow"
                    style={{ right: "8%", top: "5%", width: "130px", height: "130px" }}
                    viewBox="0 0 130 130" fill="none"
                >
                    <circle cx="65" cy="65" r="45" stroke="#818cf8" strokeWidth="2" strokeDasharray="5 10" opacity="0.5" />
                </svg>
            </div>

            {/* Centered Content */}
            <div className="flex-1 flex items-center justify-center container mx-auto px-6">
                <div className="flex gap-8 items-center justify-center flex-col">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/40 shadow-sm px-4 py-1.5 rounded-full text-sm font-medium text-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            Discover upcoming events
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 ml-1 animate-pulse-soft" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex gap-4 flex-col"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-bold leading-tight">
                            <span className="text-foreground">Ticket buying,</span>
                            <br />
                            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                                &nbsp;
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute font-bold"
                                        style={{
                                            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text",
                                        }}
                                        initial={{ opacity: 0, y: "-100" }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                        animate={
                                            titleNumber === index
                                                ? { y: 0, opacity: 1 }
                                                : {
                                                    y: titleNumber > index ? -150 : 150,
                                                    opacity: 0,
                                                }
                                        }
                                    >
                                        {title}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                            Buy and sell event tickets with confidence. QR-verified entry,
                            secure payments via Stripe, and zero hassle.
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-row gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
                    >
                        <Button size="lg" className="gap-3 rounded-full shadow-md" asChild>
                            <a href={route("events.index")}>
                                Browse Events <ArrowRight className="w-4 h-4" />
                            </a>
                        </Button>
                        <Button size="lg" className="gap-3 rounded-full bg-white/70 backdrop-blur-sm border border-white/40 text-foreground hover:bg-white/90 shadow-md" asChild>
                            <a href={route("register")}>
                                Get Started <Sparkles className="w-4 h-4" />
                            </a>
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Animated Scroll Indicator */}
            <motion.div
                className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
            >
                <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
                <ChevronDown className="w-5 h-5 animate-scroll-bounce" />
            </motion.div>

            {/* Animated Wavy Divider */}
            <div className="relative w-full h-[100px] pointer-events-none" style={{ zIndex: 0 }}>
                <svg className="absolute bottom-0 w-full h-full animate-wave" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
                    <path d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z" fill="url(#waveGrad)" opacity="0.35" />
                    <defs>
                        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                    </defs>
                </svg>
                <svg className="absolute bottom-0 w-full h-full animate-wave-reverse" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
                    <path d="M0 80C240 20 480 100 720 40C960 100 1200 20 1440 80V120H0V80Z" fill="url(#waveGrad2)" opacity="0.2" />
                    <defs>
                        <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}

export { Hero };
