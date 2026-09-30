import { motion, AnimatePresence } from "framer-motion";
import { Building2, CalendarCheck, Check, Clock, Mail, Video, X } from "lucide-react";
import { AdminHeader } from "@/components/app/admin/AdminHeader";
import { toast } from "sonner";

const STATUS_BADGE = {
  en_attente: { label: "En attente", cls: "bg-amber-100 text-amber-800" },
  confirme: { label: "Confirmé", cls: "bg-mint text-forest" },
};

export const AdminRdv = ({ requests, setRequests }) => {
  const pendingCount = requests.filter((r) => r.status === "en_attente").length;

  return (
    <div className="bg-[#F8FAFC] p-4 sm:p-8" data-testid="admin-rdv">
      <AdminHeader overline="Administration" title="Demandes de rendez-vous" />

      <div className="mt-5 flex flex-wrap gap-3">
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700" data-testid="admin-rdv-count">
          {requests.length} demande{requests.length > 1 ? "s" : ""}
        </span>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800" data-testid="admin-rdv-pending">
          {pendingCount} à traiter
        </span>
      </div>

      <div className="mt-5 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {requests.map((r) => (
            <motion.div
              layout
              key={r.id}
              data-testid={`admin-rdv-${r.id}`}
              exit={{ opacity: 0, x: 48 }}
              className={`rounded-2xl border bg-white p-4 shadow-sm ${r.status === "en_attente" ? "border-amber-300 ring-2 ring-amber-400/15" : "border-slate-200"}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mint text-forest">
                  <Video className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">{r.topic}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {r.name} — {r.company}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {r.email}</span>
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-700">
                  <CalendarCheck className="h-3.5 w-3.5 text-emerald-600" /> {r.date}
                  <Clock className="ml-1 h-3.5 w-3.5 text-emerald-600" /> {r.slot}
                </span>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${STATUS_BADGE[r.status].cls}`} data-testid={`admin-rdv-status-${r.id}`}>
                  {STATUS_BADGE[r.status].label}
                </span>
                <div className="flex gap-2">
                  {r.status === "en_attente" && (
                    <button
                      data-testid={`admin-rdv-approve-${r.id}`}
                      onClick={() => {
                        setRequests((p) => p.map((x) => (x.id === r.id ? { ...x, status: "confirme" } : x)));
                        toast.success(`Rendez-vous confirmé avec ${r.company}`, { description: "L'invitation calendrier a été envoyée au demandeur." });
                      }}
                      className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-[10px] font-bold text-white transition-colors hover:bg-emerald-400"
                    >
                      <Check className="h-3.5 w-3.5" /> Confirmer
                    </button>
                  )}
                  <button
                    data-testid={`admin-rdv-delete-${r.id}`}
                    onClick={() => {
                      setRequests((p) => p.filter((x) => x.id !== r.id));
                      toast.error("Demande de rendez-vous supprimée");
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                    aria-label="Supprimer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {requests.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-xs font-medium text-slate-500" data-testid="admin-rdv-empty">
            Aucune demande de rendez-vous pour le moment.
          </p>
        )}
      </div>
    </div>
  );
};
