import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Plus, Users, Activity,
    Settings, Trophy, Play, LogOut, Sparkles,
    Star, Zap, Shield, BarChart2, Download,
    Bell, Moon, Globe, Lock, Eye, Cpu,
    Medal, Flame, Target, ChevronRight,
    Mail, Trash2, Edit3, Search, Filter,
    TrendingUp, AlertTriangle, CheckCircle,
    XCircle, Clock, Hash, Camera, Copy,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { fetchDashboardThunk } from '../../features/dashboard/dashboardSlice';
import { selectAuth, selectDashboard } from '../../store/store';

// ─── Shared UI Atoms ──────────────────────────────────────────────
const Tag = ({ children, color = "stone" }) => {
    const colors = {
        green: "bg-green-100 border-green-500 text-green-700",
        yellow: "bg-yellow-100 border-yellow-500 text-yellow-700",
        stone: "bg-stone-100 border-stone-400 text-stone-600",
        blue: "bg-blue-100 border-blue-500 text-blue-700",
        purple: "bg-purple-100 border-purple-500 text-purple-700",
        red: "bg-red-100 border-red-500 text-red-700",
    };
    return (
        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border-2 ${colors[color]}`}>
            {children}
        </span>
    );
};

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] ${className}`}>
        {children}
    </div>
);

const NeoButton = ({ children, onClick, variant = "primary", className = "", size = "md" }) => {
    const base = "flex items-center gap-2 font-black uppercase border-2 border-stone-900 rounded-xl transition-all shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(28,25,23,1)] active:translate-y-0 active:shadow-none";
    const variants = {
        primary: "bg-yellow-400 text-stone-900",
        ghost: "bg-white text-stone-900 hover:bg-stone-50",
        danger: "bg-red-400 text-white",
        dark: "bg-stone-900 text-yellow-400",
    };
    const sizes = { sm: "px-3 py-2 text-xs", md: "px-5 py-3 text-sm", lg: "px-7 py-4 text-base" };
    return (
        <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </button>
    );
};

const StatCard = ({ label, value, icon: Icon, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        className="bg-white p-6 rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] flex items-center gap-5"
    >
        <div className={`w-14 h-14 rounded-xl border-2 border-stone-900 flex items-center justify-center ${color} shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] flex-shrink-0`}>
            <Icon size={22} strokeWidth={2.5} className="text-stone-900" />
        </div>
        <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</p>
            <h3 className="text-3xl font-black">{value}</h3>
        </div>
    </motion.div>
);

// ─── PAGE: Dashboard ──────────────────────────────────────────────
function DashboardPage() {
    const { user, stats, spheres } = useSelector(selectDashboard);
    const navigate = useNavigate();
    const safeUser = user || { name: 'Player 1' };
    const summaryStats = [
        { label: "Active Spheres", value: String(stats.activeSpheres ?? 0), icon: Play, color: "bg-green-400" },
        { label: "Total Players", value: String(stats.totalPlayers ?? 0), icon: Users, color: "bg-blue-400" },
        { label: "Avg Score", value: `${stats.avgScore ?? 0}%`, icon: Activity, color: "bg-purple-400" },
    ];
    const recentSpheres = spheres || [];
    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black italic tracking-tighter">
                        HELLO, {safeUser.name.toUpperCase()}
                    </motion.h1>
                    <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">Command Center Ready</p>
                </div>
                <NeoButton
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/create')}
                >
                    <Plus size={20} strokeWidth={3} /> Create Sphere
                </NeoButton>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {summaryStats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.1} />)}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "AI Generator", icon: Cpu, color: "bg-violet-400", desc: "Auto-create questions", action: null },
                    { label: "Live Proctoring", icon: Camera, color: "bg-red-400", desc: "Monitor sessions", action: null },
                    { label: "Export Data", icon: Download, color: "bg-cyan-400", desc: "CSV / PDF report", action: null },
                    { label: "Smart Invite", icon: Mail, color: "bg-orange-400", desc: "Send via email", action: () => navigate('/join') },
                ].map((a, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.07 }}>
                        <Card
                            className="p-5 cursor-pointer hover:bg-[#FFFDF0] transition-colors group"
                            onClick={a.action || undefined}
                        >
                            <div className={`w-10 h-10 rounded-xl border-2 border-stone-900 flex items-center justify-center ${a.color} mb-3 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] group-hover:-translate-y-0.5 transition-transform`}>
                                <a.icon size={18} strokeWidth={2.5} className="text-stone-900" />
                            </div>
                            <p className="font-black text-sm uppercase">{a.label}</p>
                            <p className="text-xs text-stone-400 font-semibold mt-1">{a.desc}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent Spheres Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                    <div className="p-6 border-b-2 border-stone-900 flex justify-between items-center bg-stone-50 rounded-t-2xl">
                        <h2 className="text-xl font-black uppercase flex items-center gap-2">
                            <Sparkles size={20} className="text-yellow-500" /> Recent Activity
                        </h2>
                        <button className="text-xs font-bold uppercase text-stone-400 hover:text-stone-900 transition-colors">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white border-b-2 border-stone-200">
                                    {["Sphere Name", "Type", "Players", "Score", "Status"].map(h => (
                                        <th key={h} className="p-4 text-xs font-bold uppercase text-stone-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentSpheres.slice(0, 4).map(s => (
                                    <tr key={s.id} className="border-b border-stone-100 hover:bg-[#FFFDF0] transition-colors group cursor-pointer">
                                        <td className="p-4 font-bold text-stone-900 group-hover:text-yellow-600 transition-colors">{s.title}</td>
                                        <td className="p-4 text-sm font-semibold text-stone-500 uppercase">{s.type}</td>
                                        <td className="p-4 text-sm font-bold text-stone-600">{s.players}</td>
                                        <td className="p-4 text-sm font-bold text-stone-600">{s.score > 0 ? `${s.score}%` : "—"}</td>
                                        <td className="p-4">
                                            <Tag color={s.status === "Active" ? "green" : s.status === "Completed" ? "stone" : "yellow"}>
                                                {s.status}
                                            </Tag>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}

// ─── PAGE: My Spheres ─────────────────────────────────────────────
function MySpheresPage() {
    const { spheres } = useSelector(selectDashboard);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const statuses = ["All", "Active", "Completed", "Draft"];
    const allSpheres = spheres || [];
    const filtered = allSpheres.filter(s =>
        (filter === "All" || s.status === filter) &&
        s.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-5xl font-black italic tracking-tighter">MY SPHERES</h1>
                    <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">Manage your test rooms</p>
                </div>
                <NeoButton variant="primary"><Plus size={18} strokeWidth={3} /> New Sphere</NeoButton>
            </header>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search spheres..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-stone-900 font-bold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)]"
                    />
                </div>
                <div className="flex gap-2">
                    {statuses.map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-4 py-3 rounded-xl border-2 border-stone-900 font-black text-xs uppercase transition-all ${filter === s ? 'bg-stone-900 text-yellow-400 shadow-[2px_2px_0px_0px_#facc15]' : 'bg-white text-stone-600 hover:bg-stone-50'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sphere Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AnimatePresence>
                    {filtered.map((s, i) => (
                        <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.06 }}>
                            <Card className="p-6 hover:bg-[#FFFDF0] transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-black text-lg group-hover:text-yellow-600 transition-colors">{s.title}</h3>
                                        <p className="text-xs font-bold text-stone-400 uppercase mt-1">{s.type} · {s.created}</p>
                                    </div>
                                    <Tag color={s.status === "Active" ? "green" : s.status === "Completed" ? "stone" : "yellow"}>
                                        {s.status}
                                    </Tag>
                                </div>
                                <div className="flex items-center gap-6 mb-5">
                                    <div className="flex items-center gap-2 text-sm font-bold text-stone-600">
                                        <Users size={14} /> {s.players} players
                                    </div>
                                    {s.score > 0 && (
                                        <div className="flex items-center gap-2 text-sm font-bold text-stone-600">
                                            <Activity size={14} /> {s.score}% avg
                                        </div>
                                    )}
                                </div>
                                {s.score > 0 && (
                                    <div className="w-full bg-stone-100 rounded-full h-2 border border-stone-300 mb-5">
                                        <div className="h-2 rounded-full bg-yellow-400 border-r border-stone-900 transition-all" style={{ width: `${s.score}%` }} />
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <NeoButton size="sm" variant="ghost"><Edit3 size={12} /> Edit</NeoButton>
                                    <NeoButton size="sm" variant="ghost"><Play size={12} /> Launch</NeoButton>
                                    <NeoButton size="sm" variant="ghost"><BarChart2 size={12} /> Stats</NeoButton>
                                    <button className="ml-auto p-2 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── PAGE: Students + Leaderboard ────────────────────────────────
function StudentsPage() {
    const { students, leaderboard } = useSelector(selectDashboard);
    const [tab, setTab] = useState("roster");
    const badgeColor = { Gold: "yellow", Silver: "stone", Bronze: "red" };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-5xl font-black italic tracking-tighter">STUDENTS</h1>
                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">Roster & live leaderboard</p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-5">
                <StatCard label="Total Students" value={String((students || []).length)} icon={Users} color="bg-blue-400" delay={0} />
                <StatCard label="Active Now" value={String((students || []).filter((s) => s.active).length)} icon={Zap} color="bg-green-400" delay={0.1} />
                <StatCard label="Top Score" value={`${Math.max(...(students || []).map((s) => s.avgScore ?? 0), 0)}%`} icon={Star} color="bg-yellow-400" delay={0.2} />
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {["roster", "leaderboard"].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-5 py-3 rounded-xl border-2 border-stone-900 font-black text-xs uppercase transition-all ${tab === t ? 'bg-stone-900 text-yellow-400 shadow-[3px_3px_0px_0px_#facc15]' : 'bg-white text-stone-600 hover:bg-stone-50'}`}>
                        {t === "roster" ? "👥 Roster" : "🏆 Leaderboard"}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {tab === "roster" ? (
                    <motion.div key="roster" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <Card>
                            <div className="p-5 border-b-2 border-stone-900 bg-stone-50 rounded-t-2xl flex justify-between items-center">
                                <h2 className="font-black uppercase text-base flex items-center gap-2"><Users size={16} /> All Students</h2>
                                <NeoButton size="sm" variant="ghost"><Download size={12} /> Export</NeoButton>
                            </div>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-stone-200">
                                        {["Name", "Email", "Spheres", "Avg Score", "Badge", "Status"].map(h => (
                                            <th key={h} className="p-4 text-xs font-bold uppercase text-stone-400">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(students || []).map(s => (
                                        <tr key={s.id} className="border-b border-stone-100 hover:bg-[#FFFDF0] transition-colors group cursor-pointer">
                                            <td className="p-4 font-bold group-hover:text-yellow-600 transition-colors">{s.name}</td>
                                            <td className="p-4 text-xs text-stone-400 font-semibold">{s.email}</td>
                                            <td className="p-4 font-bold">{s.spheres}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-sm">{s.avgScore}%</span>
                                                    <div className="w-16 bg-stone-100 rounded-full h-1.5 border border-stone-200">
                                                        <div className="h-1.5 rounded-full bg-yellow-400" style={{ width: `${s.avgScore}%` }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4"><Tag color={badgeColor[s.badge]}>{s.badge}</Tag></td>
                                            <td className="p-4">
                                                <span className={`flex items-center gap-1 text-xs font-bold ${s.active ? 'text-green-600' : 'text-stone-400'}`}>
                                                    <span className={`w-2 h-2 rounded-full ${s.active ? 'bg-green-500' : 'bg-stone-300'}`} />
                                                    {s.active ? "Online" : "Offline"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div key="lb" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                        {(leaderboard || []).map((p, i) => (
                            <motion.div key={p.rank} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                                <Card className={`p-5 flex items-center gap-5 ${i === 0 ? 'border-yellow-400 bg-yellow-50' : ''}`}>
                                    <span className="text-2xl w-8 text-center">{p.badge}</span>
                                    <div className={`w-10 h-10 rounded-xl border-2 border-stone-900 flex items-center justify-center font-black text-lg ${i === 0 ? 'bg-yellow-400' : 'bg-stone-100'}`}>
                                        {p.rank}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black">{p.name}</p>
                                        <p className="text-xs text-stone-400 font-bold uppercase">🔥 {p.streak} day streak</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-2xl">{p.score.toLocaleString()}</p>
                                        <p className="text-xs font-bold text-stone-400 uppercase">pts</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── PAGE: Settings ───────────────────────────────────────────────
function SettingsPage() {
    const { user } = useSelector(selectDashboard);
    const safeUser = user || { name: 'Player 1', email: 'player1@sphere.test', role: 'Admin' };
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [proctoring, setProctoring] = useState(false);
    const [clipboard, setClipboard] = useState(true);
    const [tabDetect, setTabDetect] = useState(true);
    const [lang, setLang] = useState("English");

    const Toggle = ({ value, onChange }) => (
        <button onClick={() => onChange(!value)}
            className={`relative w-12 h-6 rounded-full border-2 border-stone-900 transition-colors ${value ? 'bg-yellow-400' : 'bg-stone-200'}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full border-2 border-stone-900 bg-white transition-all ${value ? 'left-6' : 'left-0.5'}`} />
        </button>
    );

    const Section = ({ title, icon: Icon, children }) => (
        <Card>
            <div className="p-5 border-b-2 border-stone-900 bg-stone-50 rounded-t-2xl flex items-center gap-2">
                <Icon size={16} className="text-stone-700" />
                <h2 className="font-black uppercase text-sm">{title}</h2>
            </div>
            <div className="p-5 space-y-4">{children}</div>
        </Card>
    );

    const Row = ({ label, desc, control }) => (
        <div className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
            <div>
                <p className="font-bold text-sm">{label}</p>
                {desc && <p className="text-xs text-stone-400 font-semibold mt-0.5">{desc}</p>}
            </div>
            {control}
        </div>
    );

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-5xl font-black italic tracking-tighter">SETTINGS</h1>
                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">Customize your sphere experience</p>
            </header>

            {/* Profile Card */}
            <Card>
                <div className="p-6 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl border-2 border-stone-900 bg-yellow-400 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] text-3xl font-black">
                        {safeUser.name[0]}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-black">{safeUser.name}</h3>
                        <p className="text-sm font-bold text-stone-400">{safeUser.email}</p>
                        <Tag color="purple">{safeUser.role}</Tag>
                    </div>
                    <NeoButton size="sm" variant="ghost"><Edit3 size={12} /> Edit Profile</NeoButton>
                </div>
            </Card>
        </div>
    );
}


// ─── Sidebar Item ─────────────────────────────────────────────────
function SidebarItem({ icon: Icon, label, active, onClick, badge }) {
    return (
        <button onClick={onClick} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all relative ${active
            ? 'bg-stone-900 text-yellow-400 shadow-[4px_4px_0px_0px_#facc15]'
            : 'bg-transparent text-stone-500 hover:bg-stone-100 hover:text-stone-900'}`}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className="font-bold uppercase text-sm flex-1 text-left">{label}</span>
            {badge && <span className="text-[10px] font-black bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center border border-white">{badge}</span>}
            {active && <ChevronRight size={14} className="text-yellow-400" />}
        </button>
    );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────
export default function Dashboard() {
    const [page, setPage] = useState("dashboard");
    const dispatch = useDispatch();
    const auth = useSelector(selectAuth);
    const { user } = useSelector(selectDashboard);
    const safeUser = user || auth?.user || { name: 'Player 1', email: 'player1@sphere.test' };

    useEffect(() => {
        dispatch(fetchDashboardThunk());
    }, [dispatch]);

    const nav = [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "spheres", icon: Trophy, label: "My Spheres" },
        { id: "students", icon: Users, label: "Students", badge: 3 },
        { id: "settings", icon: Settings, label: "Settings" },
    ];

    const pages = {
        dashboard: DashboardPage,
        spheres: MySpheresPage,
        students: StudentsPage,
        settings: SettingsPage,
    };

    const PageComponent = pages[page];

    return (
        <div className="h-screen w-full bg-[#FFFDF0] font-sans text-stone-900 flex overflow-hidden">

            {/* LEFT SIDEBAR */}
            <aside className="hidden md:flex flex-col w-[260px] border-r-4 border-stone-200 border-dashed bg-white flex-shrink-0 z-20">
                <div className="p-8 border-b-4 border-stone-200 border-dashed">
                    <div className="text-2xl font-black tracking-tighter">
                        Sphere<span className="text-yellow-400">Test</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-400 border border-green-600 animate-pulse" />
                        <span className="text-[10px] font-bold text-stone-400 uppercase">Command Center Live</span>
                    </div>
                </div>

                <nav className="flex-1 flex flex-col gap-2 p-6">
                    {nav.map(n => (
                        <SidebarItem key={n.id} icon={n.icon} label={n.label} active={page === n.id} badge={n.badge} onClick={() => setPage(n.id)} />
                    ))}
                </nav>

                <div className="p-6 border-t-4 border-stone-200 border-dashed space-y-2">
                    <div className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200">
                        <p className="text-xs font-black text-stone-900 uppercase">{safeUser.name}</p>
                        <p className="text-[10px] font-semibold text-stone-400">{safeUser.email}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            dispatch(logout());
                        }}
                        className="flex items-center gap-3 w-full p-3 rounded-xl font-bold text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="uppercase text-sm">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* MOBILE BOTTOM NAV */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-stone-200 border-dashed z-30 flex justify-around px-2 py-2">
                {nav.map(n => (
                    <button key={n.id} onClick={() => setPage(n.id)}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${page === n.id ? 'text-yellow-500' : 'text-stone-400'}`}>
                        <n.icon size={18} strokeWidth={page === n.id ? 2.5 : 2} />
                        <span className="text-[9px] font-black uppercase">{n.label}</span>
                    </button>
                ))}
            </nav>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-full relative overflow-y-auto pb-20 md:pb-0">
                <div className="absolute inset-0 opacity-[0.4] pointer-events-none z-0"
                    style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="relative z-10 p-6 md:p-10 max-w-6xl mx-auto w-full">
                    <AnimatePresence mode="wait">
                        <motion.div key={page} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                            <PageComponent />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}