import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Check, Pencil, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminHeader } from "@/components/app/admin/AdminHeader";
import { IMAGES } from "@/data/mockData";
import { toast } from "sonner";

const TAGS = ["Réglementation", "Reporting", "Territoire", "Événement"];
const TAG_STYLES = {
  "Réglementation": "bg-amber-100 text-amber-800",
  "Reporting": "bg-sky-100 text-sky-800",
  "Territoire": "bg-mint text-forest",
  "Événement": "bg-fuchsia-100 text-fuchsia-800",
};
const IMAGE_POOL = ["cardboard", "metal", "plastic", "glass", "wood", "biowaste", "textile", "electronics", "rubble", "recycling"];
const EMPTY = { title: "", tag: "Territoire", excerpt: "", body: "", image: "recycling" };

const inputCls =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

export const AdminVeille = ({ veilles, setVeilles }) => {
  const [draft, setDraft] = useState(null);

  const save = () => {
    if (draft.id) {
      setVeilles((p) => p.map((v) => (v.id === draft.id ? draft : v)));
      toast.success("Veille mise à jour");
    } else {
      setVeilles((p) => [{ ...draft, id: Date.now(), date: "Aujourd'hui" }, ...p]);
      toast.success("Veille publiée", { description: "Visible immédiatement sur la page Veille des utilisateurs." });
    }
    setDraft(null);
  };

  return (
    <div className="bg-[#F8FAFC] p-4 sm:p-8" data-testid="admin-veille">
      <AdminHeader
        overline="Administration"
        title="Gestion de la Veille"
        right={
          <button
            data-testid="admin-veille-add"
            onClick={() => setDraft({ ...EMPTY })}
            className="flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-forest-hover"
          >
            <Plus className="h-4 w-4" /> Ajouter une veille
          </button>
        }
      />
      <p className="mt-2 text-xs text-slate-500">
        Chaque veille publiée ici (image, titre, description) apparaît instantanément sur la page Veille de tous les utilisateurs.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {veilles.map((v) => (
            <motion.div
              layout
              key={v.id}
              data-testid={`admin-veille-${v.id}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="relative h-32 overflow-hidden">
                <img loading="lazy" src={IMAGES[v.image]} alt="" className="h-full w-full object-cover" />
                <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${TAG_STYLES[v.tag] || "bg-slate-100 text-slate-700"}`}>
                  {v.tag}
                </span>
                <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    data-testid={`admin-veille-edit-${v.id}`}
                    onClick={() => setDraft({ ...v })}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md backdrop-blur-sm transition-colors hover:bg-sky-100 hover:text-sky-700"
                    aria-label="Modifier"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    data-testid={`admin-veille-delete-${v.id}`}
                    onClick={() => {
                      setVeilles((p) => p.filter((x) => x.id !== v.id));
                      toast.error("Veille supprimée");
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-sm transition-colors hover:bg-red-500 hover:text-white"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                  <CalendarDays className="h-3 w-3" /> {v.date}
                </p>
                <p className="mt-1 truncate font-heading text-sm font-bold text-slate-900">{v.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{v.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-h-[88vh] max-w-lg overflow-y-auto rounded-3xl" data-testid="admin-veille-modal">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold text-slate-900">
              {draft?.id ? "Modifier la veille" : "Nouvelle veille"}
            </DialogTitle>
          </DialogHeader>
          {draft && (
            <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-4">
              <input data-testid="admin-veille-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Titre de la veille *" required className={inputCls} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Catégorie</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      data-testid={`admin-veille-tag-${t.toLowerCase().replace(/[^a-z]/g, "")}`}
                      onClick={() => setDraft({ ...draft, tag: t })}
                      className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                        draft.tag === t ? "border-emerald-500 bg-mint text-forest" : "border-slate-200 text-slate-600 hover:border-emerald-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Image d'illustration</p>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {IMAGE_POOL.map((key) => (
                    <button
                      key={key}
                      type="button"
                      data-testid={`admin-veille-image-${key}`}
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
              <input data-testid="admin-veille-excerpt" value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} placeholder="Description courte (visible sur la carte) *" required className={inputCls} />
              <textarea data-testid="admin-veille-body" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Contenu complet de la veille *" required rows={4} className={`${inputCls} resize-none`} />
              <button data-testid="admin-veille-save" type="submit" className="w-full rounded-full bg-forest py-3 text-sm font-bold text-white transition-colors hover:bg-forest-hover">
                {draft.id ? "Enregistrer les modifications" : "Publier la veille"}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
