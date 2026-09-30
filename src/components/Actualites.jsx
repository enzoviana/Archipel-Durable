import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CalendarDays, FileText, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { IMAGES, NEWS } from "@/data/mockData";
import { toast } from "sonner";

const TAGS = ["Tous", "Réglementation", "Reporting", "Territoire", "Événement"];

const TAG_STYLES = {
  "Réglementation": "bg-amber-100 text-amber-800",
  "Reporting": "bg-sky-100 text-sky-800",
  "Territoire": "bg-mint text-forest",
  "Événement": "bg-fuchsia-100 text-fuchsia-800",
};

export const Actualites = ({ items, canManage = false, onAdd, onDelete }) => {
  const news = items || NEWS;
  const [tag, setTag] = useState("Tous");
  const [article, setArticle] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", tag: "Territoire", excerpt: "", body: "" });

  const filtered = news.filter((n) => tag === "Tous" || n.tag === tag);

  const submitAdd = (e) => {
    e.preventDefault();
    onAdd?.({ id: Date.now(), ...draft, date: "Aujourd'hui", image: "recycling" });
    setAddOpen(false);
    setDraft({ title: "", tag: "Territoire", excerpt: "", body: "" });
    toast.success("Veille publiée", { description: "Elle est visible par tous les utilisateurs." });
  };

  return (
    <section id="actualites" className="scroll-mt-24 bg-[#F8FAFC] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Veille</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Actualités & réglementation
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Loi AGEC, CSRD, initiatives locales : restez informé de ce qui impacte votre gestion des déchets.
            </p>
          </div>
          {canManage && (
            <button
              data-testid="veille-add-button"
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition-colors duration-200 hover:bg-forest-hover"
            >
              <Plus className="h-4 w-4" /> Ajouter une veille
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {TAGS.map((t) => (
            <button
              key={t}
              data-testid={`news-filter-${t.toLowerCase().replace(/[^a-z]/g, "")}`}
              onClick={() => setTag(t)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                tag === t
                  ? "border-emerald-500 bg-forest text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-forest"
              }`}
            >
              {t}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((n, i) => (
              <motion.article
                layout
                key={n.id}
                data-testid={`news-card-${n.id}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => setArticle(n)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative h-36 overflow-hidden">
                  <img loading="lazy" src={IMAGES[n.image]} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${TAG_STYLES[n.tag] || "bg-slate-100 text-slate-700"}`}>
                    {n.tag}
                  </span>
                  {canManage && (
                    <button
                      data-testid={`veille-delete-${n.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(n.id);
                        toast.error("Veille supprimée");
                      }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-sm transition-colors hover:bg-red-500 hover:text-white"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="p-5">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" /> {n.date}
                  </p>
                  <h3 className="mt-2 font-heading text-sm font-bold leading-snug text-slate-900">{n.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{n.excerpt}</p>
                  <span className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
                    Lire l'article
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Dialog open={!!article} onOpenChange={(o) => !o && setArticle(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-3xl" data-testid="news-article-modal">
          {article && (
            <>
              <div className="relative -mx-6 -mt-6 h-52 overflow-hidden">
                <img loading="lazy" src={IMAGES[article.image]} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className={`absolute bottom-4 left-6 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${TAG_STYLES[article.tag] || "bg-slate-100 text-slate-700"}`}>
                  {article.tag}
                </span>
              </div>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl font-bold leading-snug text-slate-900">
                  {article.title}
                </DialogTitle>
              </DialogHeader>
              <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" /> {article.date}
                <span className="mx-1">·</span>
                <FileText className="h-3.5 w-3.5" /> Rédaction Archipel Durable
              </p>
              <p className="text-sm leading-relaxed text-slate-600">{article.body}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg rounded-3xl" data-testid="veille-add-modal">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-bold text-slate-900">Nouvelle veille</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Publiée immédiatement sur la page Veille de tous les utilisateurs.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitAdd} className="space-y-4">
            <input
              data-testid="veille-title-input"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Titre de la veille *"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <div className="flex flex-wrap gap-2">
              {TAGS.filter((t) => t !== "Tous").map((t) => (
                <button
                  key={t}
                  type="button"
                  data-testid={`veille-tag-${t.toLowerCase().replace(/[^a-z]/g, "")}`}
                  onClick={() => setDraft({ ...draft, tag: t })}
                  className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                    draft.tag === t ? "border-emerald-500 bg-mint text-forest" : "border-slate-200 text-slate-600 hover:border-emerald-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              data-testid="veille-excerpt-input"
              value={draft.excerpt}
              onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
              placeholder="Résumé court *"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <textarea
              data-testid="veille-body-input"
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              placeholder="Contenu de l'article *"
              required
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              data-testid="veille-submit-button"
              type="submit"
              className="w-full rounded-full bg-forest py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-forest-hover"
            >
              Publier la veille
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
