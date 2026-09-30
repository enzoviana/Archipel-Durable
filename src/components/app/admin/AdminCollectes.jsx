import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Check, ChevronDown, Pencil, Plus, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { AdminHeader } from "@/components/app/admin/AdminHeader";
import { COLLECTE_SLOTS, IMAGES, STREAMS } from "@/data/mockData";
import { toast } from "sonner";

const inputCls =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

const IMAGE_POOL = ["cardboard", "metal", "plastic", "glass", "wood", "biowaste", "textile", "electronics", "rubble", "recycling"];
const COLOR_POOL = ["#10B981", "#0284C7", "#B45309", "#475569", "#0D9488", "#92400E", "#65A30D", "#C026D3", "#4F46E5", "#78716C", "#DC2626", "#D97706"];

const EMPTY_STREAM = { name: "", desc: "", factor: 0.8, color: "#10B981", image: "cardboard" };

const StreamFormModal = ({ draft, setDraft, onClose, onSave }) => (
  <Dialog open={!!draft} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-h-[88vh] max-w-lg overflow-y-auto rounded-3xl" data-testid="stream-form-modal">
      <DialogHeader>
        <DialogTitle className="font-heading text-lg font-bold text-slate-900">
          {draft?.id ? "Modifier le flux" : "Nouveau flux de matière"}
        </DialogTitle>
      </DialogHeader>
      {draft && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <input data-testid="stream-name-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Nom du flux (ex : Métal, Bois…) *" required className={inputCls} />
          <input data-testid="stream-desc-input" value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} placeholder="Description courte (ex : ferraille, acier, aluminium)" className={inputCls} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Illustration</p>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {IMAGE_POOL.map((key) => (
                <button
                  key={key}
                  type="button"
                  data-testid={`stream-image-${key}`}
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
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Couleur du pavé</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {COLOR_POOL.map((c) => (
                <button
                  key={c}
                  type="button"
                  data-testid={`stream-color-${c.replace("#", "")}`}
                  onClick={() => setDraft({ ...draft, color: c })}
                  className={`h-8 w-8 rounded-full transition-transform duration-200 hover:scale-110 ${draft.color === c ? "ring-4 ring-emerald-500/40 ring-offset-2" : ""}`}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Facteur CO₂ (t évitées / t valorisée)</p>
              <span className="font-mono text-sm font-bold text-forest" data-testid="stream-factor-value">{draft.factor.toFixed(1)}</span>
            </div>
            <Slider value={[draft.factor]} onValueChange={([v]) => setDraft({ ...draft, factor: v })} min={0.1} max={2.5} step={0.1} className="mt-3" />
          </div>
          <button data-testid="stream-save-button" type="submit" className="w-full rounded-full bg-forest py-3 text-sm font-bold text-white transition-colors hover:bg-forest-hover">
            {draft.id ? "Enregistrer les modifications" : "Créer le flux"}
          </button>
        </form>
      )}
    </DialogContent>
  </Dialog>
);

export const AdminCollectes = ({ streams, setStreams, collecteEvents, setCollecteEvents }) => {
  const [streamDraft, setStreamDraft] = useState(null);
  const [addCollecteOpen, setAddCollecteOpen] = useState(false);
  const [newCollecte, setNewCollecte] = useState({ stream: "Papier / Carton", date: "", slot: COLLECTE_SLOTS[0], capacity: 10 });
  const [expanded, setExpanded] = useState(null);
  const [editEvent, setEditEvent] = useState(null);

  const saveStream = () => {
    if (streamDraft.id) {
      setStreams((p) => p.map((s) => (s.id === streamDraft.id ? streamDraft : s)));
      toast.success("Flux mis à jour — visible par les utilisateurs");
    } else {
      setStreams((p) => [...p, { ...streamDraft, id: `s${Date.now()}` }]);
      toast.success("Flux créé — immédiatement disponible dans la page Collectes");
    }
    setStreamDraft(null);
  };

  const submitCollecte = (e) => {
    e.preventDefault();
    setCollecteEvents((p) => [{ id: `e${Date.now()}`, ...newCollecte, capacity: Number(newCollecte.capacity) || 10, inscrits: [] }, ...p]);
    setAddCollecteOpen(false);
    setNewCollecte({ stream: streams[0]?.name || "Papier / Carton", date: "", slot: COLLECTE_SLOTS[0], capacity: 10 });
    toast.success("Collecte créée", { description: "Elle est visible par les abonnés." });
  };

  return (
    <div className="bg-[#F8FAFC] p-4 sm:p-8" data-testid="admin-collectes">
      <AdminHeader overline="Administration" title="Gestion des collectes" />

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">Flux de matière ({streams.length})</h3>
            <p className="mt-0.5 text-xs text-slate-500">Chaque flux apparaît instantanément comme pavé illustré dans la page Collectes des utilisateurs.</p>
          </div>
          <button
            data-testid="admin-stream-add"
            onClick={() => setStreamDraft({ ...EMPTY_STREAM })}
            className="flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-forest-hover"
          >
            <Plus className="h-4 w-4" /> Ajouter un flux
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {streams.map((s) => (
              <motion.div
                layout
                key={s.id}
                data-testid={`admin-stream-${s.id}`}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative h-20 overflow-hidden">
                  <img loading="lazy" src={IMAGES[s.image]} alt={s.name} className="h-full w-full object-cover" />
                  <span className="absolute bottom-2 left-2 h-4 w-4 rounded-full ring-2 ring-white" style={{ backgroundColor: s.color }} />
                </div>
                <div className="p-3">
                  <p className="truncate text-xs font-bold text-slate-900">{s.name}</p>
                  <p className="truncate text-[10px] text-slate-500">{s.desc}</p>
                  <p className="mt-1 font-mono text-[10px] font-bold text-forest">{s.factor} t CO₂/t</p>
                </div>
                <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    data-testid={`admin-stream-edit-${s.id}`}
                    onClick={() => setStreamDraft({ ...s })}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md backdrop-blur-sm transition-colors hover:bg-sky-100 hover:text-sky-700"
                    aria-label="Modifier"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    data-testid={`admin-stream-delete-${s.id}`}
                    onClick={() => {
                      setStreams((p) => p.filter((x) => x.id !== s.id));
                      toast.error(`Flux « ${s.name} » supprimé`);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-sm transition-colors hover:bg-red-500 hover:text-white"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-heading text-base font-bold text-slate-900">Tournées de collecte ({collecteEvents.length})</h3>
          <button
            data-testid="admin-collecte-add-toggle"
            onClick={() => setAddCollecteOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-forest-hover"
          >
            <Plus className="h-4 w-4" /> Nouvelle collecte
          </button>
        </div>

        <AnimatePresence>
          {addCollecteOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={submitCollecte}
              className="overflow-hidden"
              data-testid="admin-collecte-form"
            >
              <div className="mt-4 space-y-3 rounded-2xl border border-emerald-200 bg-mint/40 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {streams.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      data-testid={`admin-collecte-stream-${s.id}`}
                      onClick={() => setNewCollecte({ ...newCollecte, stream: s.name })}
                      className={`rounded-full border px-2.5 py-1.5 text-[10px] font-bold transition-colors ${
                        newCollecte.stream === s.name ? "border-transparent text-white" : "border-slate-200 bg-white text-slate-600"
                      }`}
                      style={newCollecte.stream === s.name ? { backgroundColor: s.color } : undefined}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <input data-testid="admin-collecte-date" type="text" required value={newCollecte.date} onChange={(e) => setNewCollecte({ ...newCollecte, date: e.target.value })} placeholder="Date (ex : Lun. 29 juin) *" className={inputCls} />
                  <select data-testid="admin-collecte-slot" value={newCollecte.slot} onChange={(e) => setNewCollecte({ ...newCollecte, slot: e.target.value })} className={inputCls}>
                    {COLLECTE_SLOTS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <input data-testid="admin-collecte-capacity" type="number" min="1" value={newCollecte.capacity} onChange={(e) => setNewCollecte({ ...newCollecte, capacity: e.target.value })} placeholder="Places" className={inputCls} />
                </div>
                <button data-testid="admin-collecte-submit" type="submit" className="rounded-full bg-forest px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-forest-hover">
                  Créer la collecte
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-4 space-y-2.5">
          <AnimatePresence mode="popLayout">
            {collecteEvents.map((ev) => {
              const isOpen = expanded === ev.id;
              const pendingCount = ev.inscrits.filter((i) => i.status === "en_attente").length;
              return (
                <motion.div layout key={ev.id} data-testid={`admin-collecte-${ev.id}`} exit={{ opacity: 0, x: 48 }} className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60">
                  <div className="flex flex-wrap items-center gap-3 p-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-forest">
                      <CalendarDays className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900">{ev.stream}</p>
                      <p className="text-[11px] text-slate-500">{ev.date} · {ev.slot} · {ev.inscrits.length}/{ev.capacity} places</p>
                    </div>
                    {pendingCount > 0 && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">{pendingCount} à approuver</span>
                    )}
                    <button
                      data-testid={`admin-collecte-edit-${ev.id}`}
                      onClick={() => setEditEvent({ ...ev })}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-sky-100 hover:text-sky-700"
                      aria-label="Modifier"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      data-testid={`admin-collecte-expand-${ev.id}`}
                      onClick={() => setExpanded(isOpen ? null : ev.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-emerald-100 hover:text-forest"
                      aria-label="Voir les inscrits"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <button
                      data-testid={`admin-collecte-delete-${ev.id}`}
                      onClick={() => {
                        setCollecteEvents((p) => p.filter((x) => x.id !== ev.id));
                        toast.error("Collecte supprimée", { description: "Les inscrits seront notifiés." });
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="space-y-1.5 border-t border-slate-200 bg-white p-3.5" data-testid={`admin-inscrits-${ev.id}`}>
                          {ev.inscrits.length === 0 && <p className="text-[11px] text-slate-400">Aucun inscrit pour le moment.</p>}
                          {ev.inscrits.map((ins, idx) => (
                            <div key={`${ev.id}-${idx}`} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
                              <span className="flex-1 text-xs font-semibold text-slate-700">{ins.name}</span>
                              <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${ins.status === "confirme" ? "bg-mint text-forest" : "bg-amber-100 text-amber-800"}`}>
                                {ins.status === "confirme" ? "Confirmé" : "En attente"}
                              </span>
                              {ins.status === "en_attente" && (
                                <button
                                  data-testid={`admin-inscrit-approve-${ev.id}-${idx}`}
                                  onClick={() => {
                                    setCollecteEvents((p) =>
                                      p.map((x) => (x.id === ev.id ? { ...x, inscrits: x.inscrits.map((y, yi) => (yi === idx ? { ...y, status: "confirme" } : y)) } : x))
                                    );
                                    toast.success(`${ins.name} confirmé sur la collecte`);
                                  }}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white transition-colors hover:bg-emerald-400"
                                  aria-label="Approuver"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <StreamFormModal draft={streamDraft} setDraft={setStreamDraft} onClose={() => setStreamDraft(null)} onSave={saveStream} />

      <Dialog open={!!editEvent} onOpenChange={(o) => !o && setEditEvent(null)}>
        <DialogContent className="max-w-md rounded-3xl" data-testid="collecte-edit-modal">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold text-slate-900">Modifier la tournée</DialogTitle>
          </DialogHeader>
          {editEvent && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCollecteEvents((p) => p.map((x) => (x.id === editEvent.id ? { ...editEvent, capacity: Number(editEvent.capacity) || 10 } : x)));
                setEditEvent(null);
                toast.success("Tournée mise à jour");
              }}
              className="space-y-3"
            >
              <input data-testid="collecte-edit-date" value={editEvent.date} onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })} className={inputCls} required />
              <select data-testid="collecte-edit-slot" value={editEvent.slot} onChange={(e) => setEditEvent({ ...editEvent, slot: e.target.value })} className={inputCls}>
                {COLLECTE_SLOTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <input data-testid="collecte-edit-capacity" type="number" min="1" value={editEvent.capacity} onChange={(e) => setEditEvent({ ...editEvent, capacity: e.target.value })} className={inputCls} />
              <button data-testid="collecte-edit-save" type="submit" className="w-full rounded-full bg-forest py-3 text-sm font-bold text-white transition-colors hover:bg-forest-hover">
                Enregistrer
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
