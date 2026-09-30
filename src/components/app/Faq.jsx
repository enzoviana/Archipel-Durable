import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FAQ_ITEMS } from "@/data/mockData";
import { toast } from "sonner";

export const Faq = ({ items, canManage = false, onAdd, onDelete }) => {
  const faqs = items || FAQ_ITEMS;
  const [openId, setOpenId] = useState(faqs[0]?.id ?? null);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState({ q: "", a: "" });

  const submitAdd = (e) => {
    e.preventDefault();
    onAdd?.({ id: `f${Date.now()}`, ...draft });
    setAddOpen(false);
    setDraft({ q: "", a: "" });
    toast.success("Question ajoutée à la FAQ");
  };

  return (
    <section className="bg-[#F8FAFC] py-20 sm:py-28" data-testid="faq-page">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Support</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Questions fréquentes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Tout ce qu'il faut savoir sur la plateforme, les abonnements et les collectes.
            </p>
          </div>
          {canManage && (
            <button
              data-testid="faq-add-button"
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition-colors duration-200 hover:bg-forest-hover"
            >
              <Plus className="h-4 w-4" /> Ajouter une question
            </button>
          )}
        </motion.div>

        <div className="mt-8 space-y-3">
          <AnimatePresence mode="popLayout">
            {faqs.map((f, i) => {
              const open = openId === f.id;
              return (
                <motion.div
                  layout
                  key={f.id}
                  data-testid={`faq-item-${f.id}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-200 ${
                    open ? "border-emerald-300 shadow-lg shadow-emerald-900/5" : "border-slate-200 hover:border-emerald-200"
                  }`}
                >
                  <button
                    data-testid={`faq-toggle-${f.id}`}
                    onClick={() => setOpenId(open ? null : f.id)}
                    className="flex w-full items-center gap-3 p-5 text-left"
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${open ? "bg-forest text-white" : "bg-mint text-forest"}`}>
                      <HelpCircle className="h-4 w-4" />
                    </span>
                    <span className="flex-1 text-sm font-bold text-slate-900">{f.q}</span>
                    {canManage && (
                      <span
                        data-testid={`faq-delete-${f.id}`}
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(f.id);
                          toast.error("Question supprimée");
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-slate-600">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg rounded-3xl" data-testid="faq-add-modal">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-bold text-slate-900">Nouvelle question</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Visible immédiatement dans la FAQ de tous les utilisateurs.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitAdd} className="space-y-4">
            <input
              data-testid="faq-q-input"
              value={draft.q}
              onChange={(e) => setDraft({ ...draft, q: e.target.value })}
              placeholder="Question *"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <textarea
              data-testid="faq-a-input"
              value={draft.a}
              onChange={(e) => setDraft({ ...draft, a: e.target.value })}
              placeholder="Réponse *"
              required
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              data-testid="faq-submit-button"
              type="submit"
              className="w-full rounded-full bg-forest py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-forest-hover"
            >
              Publier la question
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
