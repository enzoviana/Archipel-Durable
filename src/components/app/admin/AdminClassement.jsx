import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Medal, Minus, Pencil, Plus, RotateCcw, Trash2, TrendingDown, TrendingUp, Trophy, Users, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminHeader } from "@/components/app/admin/AdminHeader";
import { BADGES, IMAGES, LEADERBOARD } from "@/data/mockData";
import { toast } from "sonner";

const IMAGE_POOL = ["cardboard", "metal", "plastic", "glass", "wood", "biowaste", "textile", "electronics", "rubble", "recycling"];

const inputCls =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

const TrendIcon = ({ trend }) =>
  trend > 0 ? (
    <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600"><TrendingUp className="h-3.5 w-3.5" />{trend}</span>
  ) : trend < 0 ? (
    <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-500"><TrendingDown className="h-3.5 w-3.5" />{Math.abs(trend)}</span>
  ) : (
    <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400"><Minus className="h-3.5 w-3.5" /></span>
  );

export const AdminClassement = ({ challenges, setChallenges }) => {
  const [draft, setDraft] = useState(null);
  const sorted = [...LEADERBOARD].sort((a, b) => b.points - a.points);

  const saveChallenge = () => {
    if (draft.id) {
      setChallenges((p) => p.map((c) => (c.id === draft.id ? { ...draft, points: Number(draft.points), target: Number(draft.target) } : c)));
      toast.success("Défi mis à jour");
    } else {
      setChallenges((p) => [{ ...draft, id: `d${Date.now()}`, points: Number(draft.points) || 50, target: Number(draft.target) || 1, current: 0 }, ...p]);
      toast.success("Défi créé — visible par tous les abonnés");
    }
    setDraft(null);
  };

  return (
    <div className="bg-[#F8FAFC] p-4 sm:p-8" data-testid="admin-classement">
      <AdminHeader overline="Administration" title="Classement & Défis — pilotage" />

      <div className="mt-5 flex flex-wrap gap-3">
        <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700" data-testid="admin-rank-count">
          <Users className="h-3.5 w-3.5 text-emerald-600" /> {sorted.length} entreprises classées
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700" data-testid="admin-challenge-count">
          <Zap className="h-3.5 w-3.5 text-amber-500" /> {challenges.length} défis actifs
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
          <Medal className="h-3.5 w-3.5 text-sky-600" /> {BADGES.length} badges disponibles
        </span>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-heading text-base font-bold text-slate-900">
              <Trophy className="h-4 w-4 text-amber-500" /> Classement complet
            </h3>
            <button
              data-testid="admin-season-reset"
              onClick={() => toast.info("Saison réinitialisée (démo)", { description: "Les compteurs repartiraient à zéro pour tous." })}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-[10px] font-bold text-slate-600 transition-colors hover:border-amber-400 hover:text-amber-700"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Nouvelle saison
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {sorted.map((e, i) => (
              <motion.div
                key={e.id}
                data-testid={`admin-rank-${e.id}`}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3"
              >
                <span className={`w-7 text-center font-mono text-sm font-bold ${i < 3 ? "text-amber-500" : "text-slate-400"}`}>{i + 1}</span>
                <img loading="lazy" src={e.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                <p className="min-w-0 flex-1 truncate text-xs font-bold text-slate-800">{e.name}</p>
                <TrendIcon trend={e.trend} />
                <span className="w-16 text-right font-mono text-xs font-bold text-forest">{e.points.toLocaleString("fr-FR")} pts</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-heading text-base font-bold text-slate-900">
              <Zap className="h-4 w-4 text-amber-500" /> Défis ({challenges.length})
            </h3>
            <button
              data-testid="admin-challenge-add"
              onClick={() => setDraft({ title: "", desc: "", points: 50, target: 5, unit: "actions", image: "cardboard" })}
              className="flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-forest-hover"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter un défi
            </button>
          </div>
          <div className="mt-4 space-y-2.5">
            <AnimatePresence mode="popLayout">
              {challenges.map((c) => (
                <motion.div
                  layout
                  key={c.id}
                  data-testid={`admin-challenge-${c.id}`}
                  exit={{ opacity: 0, x: 48 }}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-2.5"
                >
                  <img loading="lazy" src={IMAGES[c.image]} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800">{c.title}</p>
                    <p className="text-[10px] text-slate-500">Objectif : {c.target} {c.unit} · progression moyenne {Math.round((c.current / c.target) * 100)}%</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-800">+{c.points} pts</span>
                  <button
                    data-testid={`admin-challenge-edit-${c.id}`}
                    onClick={() => setDraft({ ...c })}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-sky-100 hover:text-sky-700"
                    aria-label="Modifier"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    data-testid={`admin-challenge-delete-${c.id}`}
                    onClick={() => {
                      setChallenges((p) => p.filter((x) => x.id !== c.id));
                      toast.error("Défi supprimé");
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {challenges.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs font-medium text-slate-500">Aucun défi actif.</p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-h-[88vh] max-w-lg overflow-y-auto rounded-3xl" data-testid="admin-challenge-modal">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold text-slate-900">{draft?.id ? "Modifier le défi" : "Nouveau défi"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <form onSubmit={(e) => { e.preventDefault(); saveChallenge(); }} className="space-y-4">
              <input data-testid="challenge-title-input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Titre du défi *" required className={inputCls} />
              <input data-testid="challenge-desc-input" value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} placeholder="Description *" required className={inputCls} />
              <div className="grid grid-cols-3 gap-3">
                <input data-testid="challenge-points-input" type="number" min="5" value={draft.points} onChange={(e) => setDraft({ ...draft, points: e.target.value })} placeholder="Points" className={inputCls} />
                <input data-testid="challenge-target-input" type="number" min="1" value={draft.target} onChange={(e) => setDraft({ ...draft, target: e.target.value })} placeholder="Objectif" className={inputCls} />
                <input data-testid="challenge-unit-input" value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} placeholder="Unité" className={inputCls} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Image</p>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {IMAGE_POOL.map((key) => (
                    <button
                      key={key}
                      type="button"
                      data-testid={`challenge-image-${key}`}
                      onClick={() => setDraft({ ...draft, image: key })}
                      className={`relative h-14 overflow-hidden rounded-xl transition-transform duration-200 hover:scale-105 ${draft.image === key ? "ring-4 ring-emerald-500" : "ring-1 ring-slate-200"}`}
                    >
                      <img loading="lazy" src={IMAGES[key]} alt={key} className="h-full w-full object-cover" />
                      {draft.image === key && (
                        <span className="absolute inset-0 flex items-center justify-center bg-forest/40">
                          <Check className="h-5 w-5 text-white" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <button data-testid="challenge-save-button" type="submit" className="w-full rounded-full bg-forest py-3 text-sm font-bold text-white transition-colors hover:bg-forest-hover">
                {draft.id ? "Enregistrer" : "Créer le défi"}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
