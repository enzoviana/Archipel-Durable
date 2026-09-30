import { BadgeCheck, Eye, FlaskConical, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const ROLES = [
  { id: "visitor", label: "Visiteur / Non abonné", icon: Eye, desc: "Aperçu uniquement — coordonnées et actions verrouillées." },
  { id: "abonne", label: "Abonné", icon: BadgeCheck, desc: "Accès complet : contacts, dépôt d'annonces, inscription aux collectes." },
  { id: "admin", label: "Administrateur", icon: ShieldCheck, desc: "Back-office débloqué : validations, espaces publicitaires, réglementation." },
];

const ACTIVE_CLS = {
  visitor: "bg-slate-200 text-slate-800",
  abonne: "bg-emerald-400 text-forest-deep",
  admin: "bg-amber-400 text-amber-950",
};

export const DemoBar = ({ role, setRole }) => (
  <div data-testid="demo-bar" className="bg-forest-deep">
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-1.5 sm:px-6">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300/80">
        <FlaskConical className="h-3.5 w-3.5" />
        Mode démo
      </span>
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        {ROLES.map((r) => {
          const active = role === r.id;
          return (
            <button
              key={r.id}
              data-testid={`demo-role-${r.id}`}
              onClick={() => {
                if (active) return;
                setRole(r.id);
                toast.info(`Rôle actif : ${r.label}`, { description: r.desc });
              }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-colors duration-200 ${
                active ? ACTIVE_CLS[r.id] : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <r.icon className="h-3.5 w-3.5" />
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
