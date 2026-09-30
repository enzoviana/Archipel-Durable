import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BadgeCheck, Building2, CalendarCheck, Check, Coins, FileText, Lock,
  MapPin, Medal, Megaphone, Repeat, ShieldCheck, Sparkles, Sprout, Trophy, Users, Wind, X, Zap,
} from "lucide-react";
import { AnimatedCounter, AnimatedValue } from "@/components/AnimatedCounter";
import { ACTIVITY_FEED, BADGES, IMAGES, LEVELS, MY_COLLECTES, PENDING_COMPANIES, PENDING_LISTINGS } from "@/data/mockData";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } };

const GREETING = {
  visitor: { title: "Bienvenue, explorateur", sub: "Vous parcourez la plateforme en accès limité — débloquez tout en un clic." },
  abonne: { title: "Bonjour, Entreprise Durable SAS", sub: "Belle journée pour valoriser vos matières sur le territoire." },
  admin: { title: "Bonjour Angélique", sub: "Vue d'ensemble vivante de votre territoire." },
};

const ROLE_BADGE = { visitor: "bg-slate-200 text-slate-700", abonne: "bg-mint text-forest", admin: "bg-amber-100 text-amber-800" };
const ROLE_LABEL = { visitor: "Visiteur", abonne: "Abonné", admin: "Administrateur" };

const TYPE_BADGE = { don: "bg-mint text-forest", recherche: "bg-sky-100 text-sky-800", braderie: "bg-amber-100 text-amber-800" };

const fmtInt = (v) => Math.round(v).toLocaleString("fr-FR");

const LevelRing = ({ pct }) => (
  <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="10" />
    <motion.circle
      cx="60" cy="60" r="50" fill="none" stroke="#34D399" strokeWidth="10" strokeLinecap="round"
      strokeDasharray={2 * Math.PI * 50}
      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
      animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - pct / 100) }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
    />
  </svg>
);

const StatCard = ({ icon: Icon, label, value, suffix, testid, grad }) => (
  <motion.div
    variants={item}
    whileHover={{ y: -5, rotate: -0.5 }}
    className={`relative overflow-hidden rounded-3xl p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl ${grad}`}
    data-testid={testid}
  >
    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-slate-800 shadow-sm backdrop-blur-sm">
      <Icon className="h-5 w-5" />
    </span>
    <p className="mt-3 font-mono text-2xl font-bold text-slate-900">
      <AnimatedCounter value={value} suffix={suffix} />
    </p>
    <p className="mt-1 text-xs font-semibold text-slate-600">{label}</p>
    <Sparkles className="absolute -right-2 -top-2 h-10 w-10 text-white/40" />
  </motion.div>
);

const LockedStat = ({ icon: Icon, label, grad }) => (
  <motion.div variants={item} className={`relative overflow-hidden rounded-3xl p-5 ${grad}`}>
    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-slate-400">
      <Icon className="h-5 w-5" />
    </span>
    <p className="mt-3 select-none font-mono text-2xl font-bold text-slate-400 blur-[4px]">0 000</p>
    <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-400 shadow-sm">
      <Lock className="h-3.5 w-3.5" />
    </span>
  </motion.div>
);

const QuickAction = ({ image, title, desc, testid, onClick, delay }) => (
  <motion.button
    data-testid={testid}
    onClick={onClick}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -6 }}
    whileTap={{ scale: 0.97 }}
    className="group relative h-40 overflow-hidden rounded-3xl text-left shadow-md transition-shadow duration-300 hover:shadow-2xl"
  >
    <img loading="lazy" src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/30 to-transparent" />
    <div className="relative flex h-full flex-col justify-end p-5">
      <p className="font-heading text-base font-bold text-white">{title}</p>
      <p className="mt-0.5 text-[11px] text-emerald-100/80">{desc}</p>
      <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform duration-300 group-hover:rotate-45">
        <ArrowRight className="h-4 w-4" />
      </span>
    </div>
  </motion.button>
);

export const Dashboard = ({ role, territory, onGoModule, onBecomeAbonne, listings, points = 320 }) => {
  const [companies, setCompanies] = useState(PENDING_COMPANIES);
  const isVisitor = role === "visitor";
  const isAdmin = role === "admin";

  const levelIdx = LEVELS.reduce((acc, l, i) => (points >= l.min ? i : acc), 0);
  const level = LEVELS[levelIdx];
  const next = LEVELS[levelIdx + 1];
  const pct = next ? Math.min(100, Math.round(((points - level.min) / (next.min - level.min)) * 100)) : 100;
  const nextBadge = BADGES.find((b) => points < b.threshold);
  const nextBadgePct = nextBadge ? Math.min(100, Math.round((points / nextBadge.threshold) * 100)) : 100;

  const stats = isAdmin
    ? [
        { icon: FileText, label: "Annonces à valider", value: PENDING_LISTINGS.length, suffix: "", testid: "dash-stat-pending", grad: "bg-amber-100" },
        { icon: Building2, label: "Entreprises à valider", value: companies.length, suffix: "", testid: "dash-stat-companies", grad: "bg-sky-100" },
        { icon: Megaphone, label: "Espaces pub actifs", value: 2, suffix: "", testid: "dash-stat-ads", grad: "bg-mint" },
        { icon: Users, label: "Membres du réseau", value: 628, suffix: "", testid: "dash-stat-members", grad: "bg-fuchsia-100" },
      ]
    : [
        { icon: Repeat, label: "Annonces actives", value: 3, suffix: "", testid: "dash-stat-listings", grad: "bg-mint" },
        { icon: CalendarCheck, label: "Collectes à venir", value: 2, suffix: "", testid: "dash-stat-collectes", grad: "bg-sky-100" },
        { icon: Wind, label: "CO₂ évité ce mois", value: 1240, suffix: " kg", testid: "dash-stat-co2", grad: "bg-emerald-100" },
        { icon: Coins, label: "Économies estimées", value: 840, suffix: " €", testid: "dash-stat-savings", grad: "bg-amber-100" },
      ];

  const lockedDefs = [
    { icon: Repeat, label: "Annonces actives", grad: "bg-slate-100" },
    { icon: CalendarCheck, label: "Collectes à venir", grad: "bg-slate-100" },
    { icon: Wind, label: "CO₂ évité ce mois", grad: "bg-slate-100" },
    { icon: Coins, label: "Économies estimées", grad: "bg-slate-100" },
  ];

  const unlock = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#10B981", "#0F5132", "#F59E0B"] });
    onBecomeAbonne();
    toast.info("Formulaire d'abonnement", { description: "Remplissez vos coordonnées — validation sous 24 h par Angélique." });
  };

  return (
    <div className="bg-[#F8FAFC] p-4 sm:p-8" data-testid="dashboard">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="dot-map relative overflow-hidden rounded-3xl bg-forest-deep p-6 text-white sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${ROLE_BADGE[role]}`} data-testid="dashboard-role-badge">
                {ROLE_LABEL[role]}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                <MapPin className="h-3 w-3" /> {territory.name}
              </span>
            </div>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl" data-testid="dashboard-greeting">
              {GREETING[role].title}
            </h2>
            <p className="mt-1.5 max-w-md text-sm text-emerald-100/70">{GREETING[role].sub}</p>
            {!isVisitor && (
              <button
                data-testid="dash-goto-classement"
                onClick={() => onGoModule("classement")}
                className="group mt-4 flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 text-xs font-bold text-forest-deep transition-colors duration-200 hover:bg-emerald-300"
              >
                <Trophy className="h-4 w-4" />
                Voir le classement & les défis
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}
          </div>

          {!isVisitor ? (
            <div className="flex items-center gap-5" data-testid="dash-level-widget">
              <div className="relative flex items-center justify-center">
                <LevelRing pct={pct} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Sprout className="h-4 w-4 text-emerald-300" />
                  <span className="mt-0.5 font-mono text-lg font-bold text-white" data-testid="dash-points">
                    <AnimatedValue value={points} format={fmtInt} />
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-200/60">points</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/70">Niveau</p>
                <p className="font-heading text-xl font-bold text-emerald-300">« {level.name} »</p>
                <p className="mt-1 text-[11px] text-emerald-100/60">
                  {next ? `${fmtInt(next.min - points)} pts avant « ${next.name} »` : "Niveau maximum !"}
                </p>
                {nextBadge && (
                  <p className="mt-2 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-amber-300">
                    <Medal className="h-3.5 w-3.5" /> Badge « {nextBadge.name} » à {nextBadgePct}%
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm" data-testid="dash-level-locked">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                <Lock className="h-6 w-6" />
              </span>
              <p className="text-center text-xs font-semibold text-emerald-100/80">
                Points, niveaux, badges et classement
                <br />
                réservés aux abonnés
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isVisitor ? lockedDefs.map((s) => <LockedStat key={s.label} {...s} />) : stats.map((s) => <StatCard key={s.testid} {...s} />)}
      </motion.div>

      {isVisitor && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }} className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Coordonnées débloquées", desc: "Contactez directement tous les annonceurs du territoire.", image: IMAGES.wood },
              { title: "Dépôt d'annonces", desc: "Publiez vos dons, recherches et braderies en 2 minutes.", image: IMAGES.cardboard },
              { title: "Inscription aux collectes", desc: "Réservez les tournées de vos 9 flux de matière.", image: IMAGES.recycling },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative h-44 overflow-hidden rounded-3xl shadow-md"
                data-testid={`dash-locked-${i}`}
              >
                <img loading="lazy" src={f.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-forest-deep/70 backdrop-blur-[2px]" />
                <div className="relative flex h-full flex-col justify-between p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md">
                    <Lock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{f.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-emerald-100/75">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button
            data-testid="dashboard-unlock-cta"
            onClick={unlock}
            className="group animate-pulse-ring mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-900/25 transition-colors duration-200 hover:bg-forest-hover sm:w-auto"
          >
            <BadgeCheck className="h-4 w-4" />
            Débloquer mon accès Abonné
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      )}

      {role === "abonne" && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <QuickAction image={IMAGES.cardboard} title="Publier une annonce" desc="+50 pts par annonce" testid="dash-goto-bourse" onClick={() => onGoModule("bourse")} delay={0.2} />
            <QuickAction image={IMAGES.recycling} title="Réserver une collecte" desc="+30 pts par collecte" testid="dash-goto-collectes" onClick={() => onGoModule("collectes")} delay={0.3} />
            <QuickAction image={IMAGES.founder} title="Conseil d'Angélique" desc="Prendre rendez-vous" testid="dash-goto-rdv" onClick={() => onGoModule("rdv")} delay={0.4} />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }} className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" data-testid="dash-my-listings">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-slate-900">Mes annonces récentes</h3>
                <span className="rounded-full bg-mint px-2.5 py-1 text-[10px] font-bold text-forest">3 actives</span>
              </div>
              <div className="mt-4 space-y-2.5">
                {listings.slice(0, 3).map((l) => (
                  <motion.div key={l.id} whileHover={{ x: 4 }} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-2.5">
                    <img loading="lazy" src={IMAGES[l.image]} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${TYPE_BADGE[l.type]}`}>{l.type}</span>
                    <p className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-800">{l.title}</p>
                    <span className="text-[10px] text-slate-400">{l.location}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" data-testid="dash-my-collectes">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-slate-900">Mes prochaines collectes</h3>
                <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold text-sky-700">2 prévues</span>
              </div>
              <div className="mt-4 space-y-2.5">
                {MY_COLLECTES.map((c) => (
                  <motion.div key={c.id} whileHover={{ x: 4 }} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-2.5">
                    <img loading="lazy" src={c.stream.startsWith("Papier") ? IMAGES.cardboard : IMAGES.electronics} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800">{c.stream}</p>
                      <p className="text-[10px] text-slate-500">{c.when}</p>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-forest">{c.qty}</span>
                  </motion.div>
                ))}
              </div>
              <button
                data-testid="dash-collecte-plus"
                onClick={() => onGoModule("collectes")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-300 py-3 text-xs font-bold text-emerald-600 transition-colors duration-200 hover:border-emerald-500 hover:bg-mint/50"
              >
                <Zap className="h-3.5 w-3.5" /> Ajouter une collecte (+30 pts)
              </button>
            </div>
          </motion.div>
        </>
      )}

      {isAdmin && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }} className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" data-testid="dash-companies">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-heading text-base font-bold text-slate-900">
                <Building2 className="h-4 w-4 text-emerald-600" /> Entreprises à valider
              </h3>
              <button data-testid="dash-goto-admin" onClick={() => onGoModule("admin")} className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700">
                Back-office <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-4 space-y-2.5">
              <AnimatePresence mode="popLayout">
                {companies.map((c) => (
                  <motion.div
                    layout
                    key={c.id}
                    data-testid={`dash-company-${c.id}`}
                    exit={{ opacity: 0, x: 48 }}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-forest font-heading text-sm font-bold text-white">
                      {c.name[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800">{c.name}</p>
                      <p className="text-[10px] text-slate-500">{c.sector} · {c.location}</p>
                    </div>
                    <button
                      data-testid={`dash-company-approve-${c.id}`}
                      onClick={() => {
                        setCompanies((p) => p.filter((x) => x.id !== c.id));
                        toast.success(`${c.name} validée — accès abonné activé`);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white transition-colors hover:bg-emerald-400"
                      aria-label="Valider"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      data-testid={`dash-company-reject-${c.id}`}
                      onClick={() => {
                        setCompanies((p) => p.filter((x) => x.id !== c.id));
                        toast.error(`${c.name} refusée`);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                      aria-label="Refuser"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {companies.length === 0 && (
                <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-xs font-medium text-slate-500" data-testid="dash-companies-empty">
                  Toutes les entreprises ont été traitées.
                </p>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" data-testid="dash-activity">
            <h3 className="flex items-center gap-2 font-heading text-base font-bold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Activité récente du territoire
            </h3>
            <ul className="mt-4 space-y-3">
              {ACTIVITY_FEED.map((a, i) => (
                <motion.li
                  key={a}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
                  {a}
                </motion.li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl bg-mint/60 p-4">
              <p className="flex items-center gap-2 text-xs font-bold text-forest">
                <Trophy className="h-4 w-4" /> Votre niveau « {level.name} » — {fmtInt(points)} pts
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
