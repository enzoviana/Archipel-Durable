import { useState } from "react";
import { Building2, Weight, Wind } from "lucide-react";
import { TerritoryMap } from "@/components/TerritoryModal";
import { TERRITORIES } from "@/data/mockData";
import { toast } from "sonner";

export const TerritoryView = ({ territory, onSelect }) => {
  const [preview, setPreview] = useState(null);
  const shown = TERRITORIES.find((t) => t.id === preview) || territory;

  return (
    <div className="bg-[#F8FAFC] p-4 sm:p-8" data-testid="territory-view">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Territoire</p>
      <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Votre zone d'activité
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
        Cliquez sur une zone de la carte pour filtrer instantanément toute l'activité locale de la plateforme.
      </p>

      <div className="mt-6 rounded-3xl border border-emerald-100 bg-white p-3 shadow-sm sm:p-4">
        <TerritoryMap
          active={territory.id}
          hovered={preview}
          onHover={setPreview}
          onPick={(t) => {
            onSelect(t);
            toast.success(`Territoire actif : ${t.name}`, {
              description: "Toute la Web App est désormais filtrée sur cette zone.",
            });
          }}
          height={430}
          testidPrefix="territory-view-zone"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3" data-testid="territory-view-stats">
        {[
          { icon: Weight, label: "Tonnes valorisées", value: `${shown.stats.tonnes.toLocaleString("fr-FR")} t`, cls: "bg-mint text-forest" },
          { icon: Wind, label: "Tonnes de CO₂ évitées", value: `${shown.stats.co2.toLocaleString("fr-FR")} t`, cls: "bg-sky-100 text-sky-700" },
          { icon: Building2, label: "Entreprises connectées", value: shown.stats.entreprises, cls: "bg-amber-100 text-amber-700" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${s.cls}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-mono text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs font-medium text-slate-400">
        Zone affichée : <span className="font-bold text-forest">{shown.name}</span>
      </p>
    </div>
  );
};
