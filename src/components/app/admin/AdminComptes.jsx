import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Check, ChevronDown, Mail, MapPin, Phone, Trash2, User } from "lucide-react";
import { AdminHeader } from "@/components/app/admin/AdminHeader";
import { toast } from "sonner";

const STATUS_BADGE = {
  abonne: { label: "Abonné", cls: "bg-mint text-forest" },
  en_attente: { label: "En attente", cls: "bg-amber-100 text-amber-800" },
  visiteur: { label: "Visiteur", cls: "bg-slate-200 text-slate-600" },
};

export const AdminComptes = ({ users, setUsers }) => {
  const [expanded, setExpanded] = useState(null);
  const sorted = [...users].sort((a, b) => (a.status === "en_attente" ? -1 : 0) - (b.status === "en_attente" ? -1 : 0));
  const pendingCount = users.filter((u) => u.status === "en_attente").length;

  return (
    <div className="bg-[#F8FAFC] p-4 sm:p-8" data-testid="admin-comptes">
      <AdminHeader overline="Administration" title="Comptes inscrits" />

      <div className="mt-5 flex flex-wrap gap-3">
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700" data-testid="admin-users-count">
          {users.length} compte{users.length > 1 ? "s" : ""}
        </span>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800" data-testid="admin-users-pending">
          {pendingCount} demande{pendingCount > 1 ? "s" : ""} d'abonnement à valider
        </span>
      </div>

      <div className="mt-5 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {sorted.map((u) => {
            const isOpen = expanded === u.id;
            return (
              <motion.div
                layout
                key={u.id}
                data-testid={`admin-user-${u.id}`}
                exit={{ opacity: 0, x: 48 }}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${
                  u.status === "en_attente" ? "border-amber-300 ring-2 ring-amber-400/15" : "border-slate-200"
                }`}
              >
                <button
                  data-testid={`admin-user-open-${u.id}`}
                  onClick={() => setExpanded(isOpen ? null : u.id)}
                  className="flex w-full flex-wrap items-center gap-3 p-4 text-left"
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-heading text-sm font-bold text-white ${
                    u.status === "en_attente" ? "bg-gradient-to-br from-amber-400 to-amber-600" : "bg-gradient-to-br from-emerald-400 to-forest"
                  }`}>
                    {u.name[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{u.fullName || u.name} — {u.company}</p>
                    <p className="truncate text-[11px] text-slate-500">{u.email} · {u.territory} · inscrit {u.joined}</p>
                  </div>
                  {u.status === "en_attente" && (
                    <span className="animate-pulse rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950">
                      Nouvelle demande
                    </span>
                  )}
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${STATUS_BADGE[u.status].cls}`} data-testid={`admin-user-status-${u.id}`}>
                    {STATUS_BADGE[u.status].label}
                  </span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="border-t border-slate-100 bg-slate-50/60 p-4" data-testid={`admin-user-details-${u.id}`}>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                          {[
                            { icon: User, label: "Contact", value: u.fullName || u.name },
                            { icon: Building2, label: "Société", value: u.company },
                            { icon: Mail, label: "E-mail", value: u.email },
                            { icon: Phone, label: "Téléphone", value: u.tel || "Non renseigné" },
                          ].map((d) => (
                            <div key={d.label} className="flex items-center gap-2.5 rounded-xl bg-white p-3 shadow-sm">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mint text-forest">
                                <d.icon className="h-3.5 w-3.5" />
                              </span>
                              <div className="min-w-0">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{d.label}</p>
                                <p className="truncate text-xs font-bold text-slate-800">{d.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Territoire : <span className="font-bold text-forest">{u.territory}</span> · Inscrit {u.joined}
                        </p>
                        <div className="mt-3.5 flex flex-wrap gap-2">
                          {u.status !== "abonne" ? (
                            <button
                              data-testid={`admin-user-validate-${u.id}`}
                              onClick={() => {
                                setUsers((p) => p.map((x) => (x.id === u.id ? { ...x, status: "abonne" } : x)));
                                toast.success(`${u.company} validé`, { description: "Le compte passe en statut Abonné avec accès complet." });
                              }}
                              className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-emerald-400"
                            >
                              <Check className="h-3.5 w-3.5" /> Valider → Abonné
                            </button>
                          ) : (
                            <button
                              data-testid={`admin-user-downgrade-${u.id}`}
                              onClick={() => {
                                setUsers((p) => p.map((x) => (x.id === u.id ? { ...x, status: "visiteur" } : x)));
                                toast.info(`${u.company} rétrogradé en Visiteur`);
                              }}
                              className="flex items-center gap-1.5 rounded-full bg-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-300"
                            >
                              <ChevronDown className="h-3.5 w-3.5" /> Rétrograder
                            </button>
                          )}
                          <button
                            data-testid={`admin-user-delete-${u.id}`}
                            onClick={() => {
                              setUsers((p) => p.filter((x) => x.id !== u.id));
                              toast.error(`Compte ${u.company} supprimé`);
                            }}
                            className="flex items-center gap-1.5 rounded-full bg-red-100 px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-200"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Supprimer
                          </button>
                        </div>
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
  );
};
