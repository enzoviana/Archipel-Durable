import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck, CalendarCheck, ChevronDown, Coins, Columns2, Download, FileText,
  HelpCircle, LayoutDashboard, Lock, LogOut, MapPin, Menu, Newspaper,
  PanelLeft, PanelTop, Recycle, Repeat, ShieldCheck, Trash2, Trophy, Users, X,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatedValue } from "@/components/AnimatedCounter";
import { DemoBar } from "@/components/app/DemoBar";
import { Dashboard } from "@/components/app/Dashboard";
import { Gamification } from "@/components/app/Gamification";
import { PublishModal } from "@/components/app/PublishModal";
import { ImpactWidget } from "@/components/app/ImpactWidget";
import { Faq } from "@/components/app/Faq";
import { SubscribeModal } from "@/components/app/SubscribeModal";
import { AdminAnnonces } from "@/components/app/admin/AdminAnnonces";
import { AdminCollectes } from "@/components/app/admin/AdminCollectes";
import { AdminComptes } from "@/components/app/admin/AdminComptes";
import { AdminVeille } from "@/components/app/admin/AdminVeille";
import { AdminClassement } from "@/components/app/admin/AdminClassement";
import { AdminRdv } from "@/components/app/admin/AdminRdv";
import { BourseEchange } from "@/components/BourseEchange";
import { Collectes } from "@/components/Collectes";
import { Actualites } from "@/components/Actualites";
import { RendezVous } from "@/components/RendezVous";
import { BOOKING_REQUESTS, CHALLENGES, COLLECTE_EVENTS, FAQ_ITEMS, LISTINGS, MOCK_USERS, NEWS, STREAMS } from "@/data/mockData";

const NAV_ALL = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, roles: ["visitor", "abonne", "admin"] },
  { id: "classement", label: "Classement & Défis", icon: Trophy, roles: ["visitor", "abonne", "admin"] },
  { id: "bourse", label: "Bourse d'Échange", icon: Repeat, roles: ["visitor", "abonne", "admin"] },
  { id: "collectes", label: "Collectes", icon: Trash2, roles: ["visitor", "abonne", "admin"] },
  { id: "veille", label: "Veille", icon: Newspaper, roles: ["visitor", "abonne"] },
  { id: "faq", label: "FAQ", icon: HelpCircle, roles: ["visitor", "abonne", "admin"] },
  { id: "rdv", label: "Rendez-vous", icon: CalendarCheck, roles: ["abonne", "admin"] },
];

const NAV_ADMIN = [
  { id: "admin-annonces", label: "Gestion Annonces", icon: FileText },
  { id: "admin-collectes", label: "Gestion Collectes", icon: Trash2 },
  { id: "admin-comptes", label: "Comptes", icon: Users },
  { id: "admin-veille", label: "Gestion Veille", icon: Newspaper },
];

const LAYOUTS = [
  { id: "sidebar", icon: PanelLeft, label: "Sidebar" },
  { id: "both", icon: Columns2, label: "Sidebar + Topbar" },
  { id: "topbar", icon: PanelTop, label: "Topbar" },
];

const ROLE_META = {
  visitor: { label: "Visiteur", cls: "bg-slate-200 text-slate-700", user: "Visiteur de passage" },
  abonne: { label: "Abonné", cls: "bg-mint text-forest", user: "Entreprise Durable SAS" },
  admin: { label: "Administrateur", cls: "bg-amber-100 text-amber-800", user: "Angélique Baudin" },
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AppShell = ({ role, setRole, territory, onSelectTerritory, onOpenTerritory, onExit }) => {
  const [module, setModule] = useState("dashboard");
  const [layout, setLayout] = useState("sidebar");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listings, setListings] = useState(LISTINGS);
  const [publishOpen, setPublishOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [points, setPoints] = useState(320);
  const [users, setUsers] = useState(MOCK_USERS);
  const [veilles, setVeilles] = useState(NEWS);
  const [faqItems, setFaqItems] = useState(FAQ_ITEMS);
  const [collecteEvents, setCollecteEvents] = useState(COLLECTE_EVENTS);
  const [streams, setStreams] = useState(STREAMS);
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [rdvRequests, setRdvRequests] = useState(BOOKING_REQUESTS);
  const [impact, setImpact] = useState({ co2: 240, savings: 180, entries: [] });
  const isAbonne = role !== "visitor";

  const allowedIds = [...NAV_ALL.filter((n) => n.roles.includes(role)).map((n) => n.id), ...(role === "admin" ? NAV_ADMIN.map((n) => n.id) : [])];
  const activeModule = allowedIds.includes(module) ? module : "dashboard";

  const changeRole = (r) => {
    setRole(r);
    const ids = [...NAV_ALL.filter((n) => n.roles.includes(r)).map((n) => n.id), ...(r === "admin" ? NAV_ADMIN.map((n) => n.id) : [])];
    if (!ids.includes(module)) setModule("dashboard");
  };

  const earnPoints = (n, label) => {
    setPoints((p) => p + n);
    toast.success(`+${n} points — ${label}`, {
      description: "Consultez « Classement & Défis » pour suivre votre progression.",
    });
  };

  const addImpact = (entry) =>
    setImpact((p) => ({ co2: p.co2 + entry.co2, savings: p.savings + entry.savings, entries: [...p.entries, entry] }));

  const subscribeCTA = () => setSubscribeOpen(true);

  const unlockAsAbonne = () => setSubscribeOpen(true);

  const handleSubscribeRequest = (user) => {
    setUsers((p) => [user, ...p]);
  };

  const adminCount = users.filter((u) => u.status === "en_attente").length;

  const navButton = (n, layoutKey, onNavigate, isAdminItem = false) => {
    const active = activeModule === n.id;
    return (
      <button
        key={n.id}
        data-testid={`sidebar-nav-${n.id}`}
        onClick={() => {
          setModule(n.id);
          onNavigate?.();
        }}
        className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
          active ? "text-white" : isAdminItem ? "text-slate-600 hover:bg-amber-50 hover:text-amber-800" : "text-slate-600 hover:bg-emerald-50 hover:text-forest"
        }`}
      >
        {active && (
          <motion.span
            layoutId={`sidebar-pill-${layoutKey}`}
            className={`absolute inset-0 rounded-xl shadow-md ${isAdminItem ? "bg-amber-500" : "bg-forest"}`}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        <n.icon className="relative z-10 h-5 w-5 shrink-0" />
        <span className="relative z-10">{n.label}</span>
        {n.id === "admin-comptes" && adminCount > 0 && (
          <span className="relative z-10 ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {adminCount}
          </span>
        )}
      </button>
    );
  };

  const navItems = (layoutKey, onNavigate) => (
    <>
      {NAV_ALL.filter((n) => n.roles.includes(role)).map((n) => navButton(n, layoutKey, onNavigate))}
      {role === "admin" && (
        <>
          <div className="my-3 flex items-center gap-2 border-t border-slate-200 pt-3">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Administration</span>
          </div>
          {NAV_ADMIN.map((n) => navButton(n, layoutKey, onNavigate, true))}
        </>
      )}
    </>
  );

  const content = {
    dashboard: (
      <Dashboard role={role} territory={territory} onGoModule={setModule} onBecomeAbonne={unlockAsAbonne} listings={listings} points={points} />
    ),
    classement:
      role === "admin" ? (
        <AdminClassement challenges={challenges} setChallenges={setChallenges} />
      ) : (
        <Gamification role={role} points={points} onUnlock={unlockAsAbonne} challenges={challenges} />
      ),
    bourse: (
      <BourseEchange
        canViewContacts={isAbonne}
        onRequestAuth={subscribeCTA}
        listings={listings}
        onPublish={() => (isAbonne ? setPublishOpen(true) : subscribeCTA())}
      />
    ),
    collectes: <Collectes canRegister={isAbonne} onLocked={subscribeCTA} onEarn={earnPoints} onImpact={addImpact} territory={territory} streams={streams} />,
    veille: <Actualites items={veilles} />,
    faq: (
      <Faq
        items={faqItems}
        canManage={role === "admin"}
        onAdd={(f) => setFaqItems((p) => [...p, f])}
        onDelete={(id) => setFaqItems((p) => p.filter((x) => x.id !== id))}
      />
    ),
    rdv: role === "admin" ? <AdminRdv requests={rdvRequests} setRequests={setRdvRequests} /> : <RendezVous />,
    "admin-annonces": <AdminAnnonces listings={listings} setListings={setListings} />,
    "admin-collectes": <AdminCollectes streams={streams} setStreams={setStreams} collecteEvents={collecteEvents} setCollecteEvents={setCollecteEvents} />,
    "admin-comptes": <AdminComptes users={users} setUsers={setUsers} />,
    "admin-veille": <AdminVeille veilles={veilles} setVeilles={setVeilles} />,
  }[activeModule];

  return (
    <div className="min-h-screen bg-slate-100" data-testid="app-shell">
      <div className="sticky top-0 z-50 shadow-sm">
        <DemoBar role={role} setRole={changeRole} />
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                data-testid="topbar-menu-button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-emerald-50 lg:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-white">
                  <Recycle className="h-5 w-5" />
                </span>
                <span className="hidden font-heading text-base font-bold text-forest sm:inline">
                  Archipel <span className="text-emerald-500">Durable</span>
                </span>
              </span>
              <span className="hidden rounded-full bg-forest px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white md:inline">
                Web App
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 md:flex" data-testid="layout-switcher">
                {LAYOUTS.map((l) => (
                  <button
                    key={l.id}
                    data-testid={`layout-${l.id}`}
                    title={`Navigation : ${l.label}`}
                    onClick={() => {
                      setLayout(l.id);
                      toast.info(`Navigation : ${l.label}`);
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ${
                      layout === l.id ? "bg-forest text-white shadow" : "text-slate-500 hover:text-forest"
                    }`}
                  >
                    <l.icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
              <button
                data-testid="topbar-territory-widget"
                onClick={onOpenTerritory}
                className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-mint px-3.5 py-2 text-xs font-bold text-forest transition-colors duration-200 hover:border-emerald-400"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">{territory.name}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {role !== "visitor" ? (
                <span data-testid="topbar-points" className="hidden items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-2 font-mono text-xs font-bold text-amber-800 md:flex">
                  <Coins className="h-4 w-4" />
                  <AnimatedValue value={points} format={(v) => Math.round(v).toLocaleString("fr-FR")} /> pts
                </span>
              ) : (
                <span data-testid="topbar-points-locked" className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-400 md:flex">
                  <Lock className="h-3.5 w-3.5" /> Points verrouillés
                </span>
              )}
              <span data-testid="topbar-role-badge" className={`hidden rounded-full px-3 py-2 text-xs font-bold sm:inline ${ROLE_META[role].cls}`}>
                {ROLE_META[role].label}
              </span>
             
              <button
                data-testid="topbar-exit-button"
                onClick={onExit}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 transition-colors duration-200 hover:border-red-300 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Quitter</span>
              </button>
            </div>
          </div>
        </header>

        {layout !== "sidebar" && (
          <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl" data-testid="topnav">
            <div className="flex gap-1.5 overflow-x-auto px-4 py-2 sm:px-6">
              {NAV_ALL.filter((n) => n.roles.includes(role)).map((n) => {
                const active = activeModule === n.id;
                return (
                  <button
                    key={n.id}
                    data-testid={`topnav-${n.id}`}
                    onClick={() => setModule(n.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors duration-200 ${
                      active ? "bg-forest text-white shadow-md" : "text-slate-600 hover:bg-emerald-50 hover:text-forest"
                    }`}
                  >
                    <n.icon className="h-3.5 w-3.5" />
                    {n.label}
                  </button>
                );
              })}
              {role === "admin" &&
                NAV_ADMIN.map((n) => {
                  const active = activeModule === n.id;
                  return (
                    <button
                      key={n.id}
                      data-testid={`topnav-${n.id}`}
                      onClick={() => setModule(n.id)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors duration-200 ${
                        active ? "bg-amber-500 text-white shadow-md" : "text-amber-700/70 hover:bg-amber-50 hover:text-amber-800"
                      }`}
                    >
                      <n.icon className="h-3.5 w-3.5" />
                      {n.label}
                    </button>
                  );
                })}
            </div>
          </nav>
        )}
      </div>

      <div className="flex items-start">
        {layout !== "topbar" && (
          <aside className="sticky top-[118px] hidden h-[calc(100vh-118px)] w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white p-4 lg:flex" data-testid="sidebar">
            {navItems("desktop")}
            <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4" data-testid="sidebar-user-card">
              <p className="text-xs font-bold text-slate-900">{ROLE_META[role].user}</p>
              <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${ROLE_META[role].cls}`}>
                {ROLE_META[role].label}
              </span>
            </div>
          </aside>
        )}

        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-[60] bg-forest-deep/50 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="fixed inset-y-0 left-0 z-[61] flex w-72 flex-col overflow-y-auto bg-white p-4"
                data-testid="sidebar-mobile"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-heading text-base font-bold text-forest">
                    Archipel <span className="text-emerald-500">Durable</span>
                  </span>
                  <button
                    data-testid="sidebar-mobile-close"
                    onClick={() => setSidebarOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {navItems("mobile", () => setSidebarOpen(false))}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 sm:p-6 lg:p-8"
            >
              <div className="overflow-hidden rounded-3xl border border-slate-200/70 shadow-sm" data-testid={`module-${activeModule}`}>
                {content}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ImpactWidget impact={impact} />
      <PublishModal
        open={publishOpen}
        onOpenChange={setPublishOpen}
        onAdd={(l) => {
          setListings((prev) => [l, ...prev]);
          earnPoints(50, "Annonce publiée");
        }}
      />
      <SubscribeModal open={subscribeOpen} onOpenChange={setSubscribeOpen} onSubmitRequest={handleSubscribeRequest} />
    </div>
  );
};
