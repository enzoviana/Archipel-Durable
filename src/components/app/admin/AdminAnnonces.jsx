import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin, Pencil, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminHeader } from "@/components/app/admin/AdminHeader";
import { IMAGES, PENDING_LISTINGS } from "@/data/mockData";
import { toast } from "sonner";

const TYPE_BADGE = {
  don: "bg-mint text-forest",
  recherche: "bg-sky-100 text-sky-800",
  braderie: "bg-amber-100 text-amber-800",
};

const inputCls =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

export const AdminAnnonces = ({ listings, setListings }) => {
  const [pending, setPending] = useState(PENDING_LISTINGS);
  const [editing, setEditing] = useState(null);

  const approve = (id) => {
    setPending((p) => p.filter((x) => x.id !== id));
    toast.success("Annonce validée et publiée");
  };
  const reject = (id) => {
    setPending((p) => p.filter((x) => x.id !== id));
    toast.error("Annonce refusée — l'auteur sera notifié");
  };

  return (
    <div className="bg-[#F8FAFC] p-4 sm:p-8" data-testid="admin-annonces">
      <AdminHeader overline="Administration" title="Bourse d'Échange — supervision" />

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="font-heading text-base font-bold text-slate-900" data-testid="admin-pending-count">
            En attente de validation ({pending.length})
          </h3>
          <div className="mt-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {pending.map((l) => (
                <motion.div layout key={l.id} data-testid={`admin-pending-${l.id}`} exit={{ opacity: 0, x: 48 }} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
                  <img loading="lazy" src={IMAGES[l.image]} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${TYPE_BADGE[l.type]}`}>{l.type}</span>
                    <p className="mt-1 truncate text-sm font-bold text-slate-900">{l.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">{l.author} · <MapPin className="h-3 w-3" /> {l.location}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button data-testid={`admin-approve-${l.id}`} onClick={() => approve(l.id)} className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition-colors hover:bg-emerald-400" aria-label="Valider">
                      <Check className="h-4 w-4" />
                    </button>
                    <button data-testid={`admin-reject-${l.id}`} onClick={() => reject(l.id)} className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200" aria-label="Refuser">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {pending.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs font-medium text-slate-500" data-testid="admin-pending-empty">
                Aucune annonce en attente.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="font-heading text-base font-bold text-slate-900">Toutes les annonces ({listings.length})</h3>
          <div className="mt-4 max-h-[460px] space-y-2 overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {listings.map((l) => (
                <motion.div layout key={l.id} data-testid={`admin-listing-${l.id}`} exit={{ opacity: 0, x: 48 }} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-2.5">
                  <img loading="lazy" src={IMAGES[l.image]} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800">{l.title}</p>
                    <p className="text-[10px] text-slate-500">{l.location} · {l.quantity}</p>
                  </div>
                  <button
                    data-testid={`admin-listing-edit-${l.id}`}
                    onClick={() => setEditing({ ...l })}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-sky-100 hover:text-sky-700"
                    aria-label="Modifier"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    data-testid={`admin-listing-delete-${l.id}`}
                    onClick={() => {
                      setListings((p) => p.filter((x) => x.id !== l.id));
                      toast.error("Annonce supprimée");
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-md rounded-3xl" data-testid="listing-edit-modal">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold text-slate-900">Modifier l'annonce</DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setListings((p) => p.map((x) => (x.id === editing.id ? editing : x)));
                setEditing(null);
                toast.success("Annonce mise à jour");
              }}
              className="space-y-3"
            >
              <input data-testid="listing-edit-title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} required />
              <div className="grid grid-cols-2 gap-3">
                <input data-testid="listing-edit-quantity" value={editing.quantity} onChange={(e) => setEditing({ ...editing, quantity: e.target.value })} className={inputCls} />
                <input data-testid="listing-edit-location" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className={inputCls} />
              </div>
              <button data-testid="listing-edit-save" type="submit" className="w-full rounded-full bg-forest py-3 text-sm font-bold text-white transition-colors hover:bg-forest-hover">
                Enregistrer les modifications
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
