import { motion } from "framer-motion";
import {
  ArrowRight, BadgeCheck, CalendarCheck, Crown, Gift, Lock, Medal, Minus, Repeat,
  Sprout, TrendingDown, TrendingUp, Trophy, Waves, Zap,
} from "lucide-react";
import { AnimatedValue } from "@/components/AnimatedCounter";
import { BADGES, CHALLENGES, IMAGES, LEADERBOARD, LEVELS } from "@/data/mockData";

const fmtInt = (v) => Math.round(v).toLocaleString("fr-FR");

const BADGE_ICONS = { sprout: Sprout, gift: Gift, calendar: CalendarCheck, repeat: Repeat, trophy: Trophy, waves: Waves };

const ME = { id: "me", name: "Entreprise Durable SAS", you: true, avatar: "https://i.pravatar.cc/96?img=68", trend: 2 };

const TrendIcon = ({ trend }) =>
  trend > 0 ? (
    <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600"><TrendingUp className="h-3.5 w-3.5" />{trend}</span>
  ) : trend < 0 ? (
    <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-500"><TrendingDown className="h-3.5 w-3.5" />{Math.abs(trend)}</span>
  ) : (
    <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400"><Minus className="h-3.5 w-3.5" /></span>
  );

const PODIUM_ORDER = [1, 0, 2];
const PODIUM_META = [
  { height: "h-24", ring: "ring-amber-400", medal: "text-amber-400" },
  { height: "h-16", ring: "ring-slate-300", medal: "text-slate-400" },
  { height: "h-12", ring: "ring-amber-700", medal: "text-amber-700" },
];

export const Gamification = ({ role, points, onUnlock, challenges = CHALLENGES }) => {
  const isVisitor = role === "visitor";

  const levelIdx = LEVELS.reduce((acc, l, i) => (points >= l.min ? i : acc), 0);
  const level = LEVELS[levelIdx];
  const next = LEVELS[levelIdx + 1];
  const progress = next ? Math.min(100, Math.round(((points - level.min) / (next.min - level.min)) * 100)) : 100;

  const sorted = [...LEADERBOARD, { ...ME, points }].sort((a, b) => b.points - a.points);
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  const myRank = sorted.findIndex((e) => e.id === "me") + 1;

  return (
    <div className="bg-[#F8FAFC] p-4 sm:p-8" data-testid="gamification">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Gamification</p>
      <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Classement & Défis du territoire
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
        Chaque action circulaire vous rapporte des points : annonce publiée <span className="font-bold text-forest">+50 pts</span>, collecte réservée <span className="font-bold text-forest">+30 pts</span>. Grimpez au classement !
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <div className="space-y-6">
          {isVisitor ? (
            <div className="relative overflow-hidden rounded-3xl bg-forest-deep p-8 text-center text-white" data-testid="level-card-locked">
              <div className="select-none blur-[4px]" aria-hidden="true">
                <p className="font-mono text-5xl font-bold text-emerald-300">320 pts</p>
                <div className="mx-auto mt-4 h-3 max-w-xs rounded-full bg-white/10" />
                <p className="mt-3 text-xs text-emerald-100/60">Niveau « Arbre »</p>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-forest-deep/60 p-6 backdrop-blur-[2px]">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-300">
                  <Lock className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm font-bold">Votre progression vous attend</p>
                <p className="mt-1 max-w-xs text-xs text-emerald-100/70">
                  Points, niveaux, badges et défis sont réservés aux abonnés.
                </p>
                <button
                  data-testid="gamification-unlock-cta"
                  onClick={onUnlock}
                  className="mt-4 flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 text-xs font-bold text-forest-deep transition-colors duration-200 hover:bg-emerald-300"
                >
                  <BadgeCheck className="h-4 w-4" /> Débloquer avec l'abonnement
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="dot-map relative overflow-hidden rounded-3xl bg-forest-deep p-6 text-white sm:p-7"
              data-testid="level-card"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 rounded-full bg-emerald-400/15 px-3.5 py-1.5 text-xs font-bold text-emerald-300">
                  <Sprout className="h-4 w-4" /> Niveau « {level.name} »
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-100/60">
                  <Zap className="h-3.5 w-3.5 text-amber-300" /> Rang #{myRank}
                </span>
              </div>
              <p className="mt-5 font-mono text-5xl font-bold text-emerald-300" data-testid="level-points">
                <AnimatedValue value={points} format={fmtInt} />
                <span className="ml-2 text-lg font-semibold text-emerald-300/60">pts</span>
              </p>
              <div className="mt-5">
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                    data-testid="level-progress"
                  />
                </div>
                <p className="mt-2 text-[11px] font-medium text-emerald-100/60">
                  {next ? `Plus que ${fmtInt(next.min - points)} pts avant le niveau « ${next.name} »` : "Niveau maximum atteint — légende du territoire !"}
                </p>
              </div>
            </motion.div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="flex items-center gap-2 font-heading text-base font-bold text-slate-900">
              <Medal className="h-4 w-4 text-emerald-600" /> Badges à débloquer
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {BADGES.map((b, i) => {
                const unlocked = !isVisitor && points >= b.threshold;
                const Icon = BADGE_ICONS[b.icon];
                return (
                  <motion.div
                    key={b.id}
                    data-testid={`badge-${b.id}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                    whileHover={{ y: -4 }}
                    className={`relative rounded-2xl border p-4 text-center transition-shadow duration-300 hover:shadow-md ${
                      unlocked ? "border-emerald-200 bg-mint/50" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl ${
                        unlocked ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className={`mt-2.5 text-xs font-bold ${unlocked ? "text-forest" : "text-slate-500"}`}>{b.name}</p>
                    <p className="mt-1 text-[10px] leading-snug text-slate-400">{b.desc}</p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        unlocked ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {unlocked ? "Débloqué" : `${b.threshold} pts`}
                    </span>
                    {!unlocked && (
                      <span className="absolute right-2.5 top-2.5 text-slate-300">
                        <Lock className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" data-testid="leaderboard">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-heading text-base font-bold text-slate-900">
              <Trophy className="h-4 w-4 text-amber-500" /> Classement des entreprises
            </h3>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Saison d'été 2026</span>
          </div>

          <div className="mt-6 flex items-end justify-center gap-3 sm:gap-5" data-testid="podium">
            {PODIUM_ORDER.map((idx) => {
              const e = podium[idx];
              const meta = PODIUM_META[idx];
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.12, duration: 0.5 }}
                  className="flex w-24 flex-col items-center sm:w-28"
                >
                  <div className="relative">
                    {idx === 0 && <Crown className="absolute -top-5 left-1/2 h-5 w-5 -translate-x-1/2 text-amber-400" />}
                    <img
                      loading="lazy"
                      src={e.avatar}
                      alt={e.name}
                      className={`h-14 w-14 rounded-full object-cover ring-4 sm:h-16 sm:w-16 ${meta.ring} ${e.you ? "ring-emerald-500" : ""}`}
                    />
                  </div>
                  <p className="mt-2 max-w-full truncate text-center text-[11px] font-bold text-slate-800">
                    {e.name} {e.you && <span className="text-emerald-600">(vous)</span>}
                  </p>
                  <p className="font-mono text-xs font-bold text-forest">{fmtInt(e.points)} pts</p>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    transition={{ delay: 0.3 + idx * 0.12, duration: 0.5 }}
                    className={`mt-2 flex w-full items-start justify-center rounded-t-xl pt-1.5 ${meta.height} ${
                      idx === 0 ? "bg-gradient-to-b from-amber-300 to-amber-100" : idx === 1 ? "bg-gradient-to-b from-slate-200 to-slate-100" : "bg-gradient-to-b from-amber-700/20 to-amber-700/5"
                    }`}
                  >
                    <span className={`font-mono text-sm font-bold ${meta.medal}`}>{idx + 1}</span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 space-y-2">
            {rest.map((e, i) => (
              <motion.div
                layout
                key={e.id}
                data-testid={`leaderboard-row-${e.id}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className={`flex items-center gap-3 rounded-2xl border p-3 ${
                  e.you ? "border-emerald-300 bg-mint/50 ring-2 ring-emerald-500/20" : "border-slate-100 bg-slate-50/60"
                }`}
              >
                <span className="w-6 text-center font-mono text-sm font-bold text-slate-400">{i + 4}</span>
                <img loading="lazy" src={e.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                <p className="min-w-0 flex-1 truncate text-xs font-bold text-slate-800">
                  {e.name} {e.you && <span className="font-semibold text-emerald-600">(vous)</span>}
                </p>
                <TrendIcon trend={e.trend} />
                <span className="w-16 text-right font-mono text-xs font-bold text-forest">{fmtInt(e.points)} pts</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-slate-900">
          <Zap className="h-4 w-4 text-amber-500" /> Défis en cours
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {challenges.map((c, i) => {
            const pct = Math.min(100, Math.round((c.current / c.target) * 100));
            const done = c.current >= c.target;
            return (
              <motion.div
                key={c.id}
                data-testid={`challenge-${c.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative h-24 overflow-hidden">
                  <img loading="lazy" src={IMAGES[c.image]} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-amber-950 shadow-md">
                    +{c.points} pts
                  </span>
                  {done && (
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                      Terminé
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-slate-900">{c.title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-500">{c.desc}</p>
                  <div className="mt-3">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full rounded-full ${done ? "bg-emerald-500" : "bg-gradient-to-r from-emerald-500 to-emerald-400"}`}
                      />
                    </div>
                    <p className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                      <ArrowRight className="h-3 w-3 text-emerald-500" />
                      {c.current} / {c.target} {c.unit}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
