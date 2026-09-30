import { BadgeCheck, ShieldCheck } from "lucide-react";

export const AdminHeader = ({ overline, title, right }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-600">
        <ShieldCheck className="h-3.5 w-3.5" /> {overline}
      </p>
      <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
    </div>
    <div className="flex items-center gap-2">
      {right}
      <span className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-800">
        <BadgeCheck className="h-4 w-4" />
        Angélique Baudin — Fondatrice
      </span>
    </div>
  </div>
);
