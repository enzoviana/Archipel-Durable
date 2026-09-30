import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Coins, Leaf, Wind, X, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { AnimatedValue } from "@/components/AnimatedCounter";
import { STREAMS } from "@/data/mockData";

const fmtInt = (v) => Math.round(v).toLocaleString("fr-FR");

export const ImpactWidget = ({ impact }) => {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(10);
  const [streamId, setStreamId] = useState("papier");

  const stream = STREAMS.find((s) => s.id === streamId);
  const simCo2 = volume * 12 * stream.factor;
  const simSavings = volume * 12 * (45 + stream.factor * 30);
  const simCars = simCo2 / 2.2;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="impact-panel"
            data-testid="impact-widget-panel"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 z-[65] max-h-[70vh] w-[340px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:right-6"
          >
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-heading text-sm font-bold text-slate-900">
                <Leaf className="h-4 w-4 text-emerald-600" /> Mon impact en direct
              </p>
              <button
                data-testid="impact-widget-close"
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-mint p-3 text-center">
                <Wind className="mx-auto h-4 w-4 text-forest" />
                <p className="mt-1 font-mono text-sm font-bold text-forest" data-testid="impact-co2">
                  <AnimatedValue value={impact.co2} format={fmtInt} />
                </p>
                <p className="text-[9px] font-semibold text-forest/70">kg CO₂ évités</p>
              </div>
              <div className="rounded-2xl bg-amber-100 p-3 text-center">
                <Coins className="mx-auto h-4 w-4 text-amber-700" />
                <p className="mt-1 font-mono text-sm font-bold text-amber-800" data-testid="impact-savings">
                  <AnimatedValue value={impact.savings} format={fmtInt} />
                </p>
                <p className="text-[9px] font-semibold text-amber-700/70">€ économisés</p>
              </div>
              <div className="rounded-2xl bg-sky-100 p-3 text-center">
                <Zap className="mx-auto h-4 w-4 text-sky-700" />
                <p className="mt-1 font-mono text-sm font-bold text-sky-800" data-testid="impact-count">{impact.entries.length}</p>
                <p className="text-[9px] font-semibold text-sky-700/70">collectes</p>
              </div>
            </div>

            {impact.entries.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {impact.entries.slice(-3).reverse().map((e, i) => (
                  <motion.p
                    key={`${e.label}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-semibold text-slate-600"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {e.label} <span className="ml-auto font-mono text-forest">+{fmtInt(e.co2)} kg</span>
                  </motion.p>
                ))}
              </div>
            )}
            {impact.entries.length === 0 && (
              <p className="mt-3 rounded-xl border border-dashed border-slate-200 p-3 text-center text-[10px] font-medium text-slate-400">
                Inscrivez-vous à une collecte : l'impact se calcule automatiquement ici.
              </p>
            )}

            <div className="my-4 border-t border-slate-100" />

            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Simulateur rapide</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {STREAMS.map((s) => (
                <button
                  key={s.id}
                  data-testid={`impact-sim-${s.id}`}
                  onClick={() => setStreamId(s.id)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                    streamId === s.id ? "border-transparent text-white" : "border-slate-200 text-slate-500 hover:border-emerald-300"
                  }`}
                  style={streamId === s.id ? { backgroundColor: s.color } : undefined}
                >
                  {s.name.split(" /")[0].split(" &")[0]}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Slider value={[volume]} onValueChange={([v]) => setVolume(v)} min={1} max={100} step={1} className="flex-1" data-testid="impact-sim-slider" />
              <span className="w-12 text-right font-mono text-xs font-bold text-forest" data-testid="impact-sim-volume">{volume} t/mois</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="font-mono text-xs font-bold text-forest" data-testid="impact-sim-co2">{fmtInt(simCo2)} t</p>
                <p className="text-[9px] text-slate-400">CO₂ / an</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="font-mono text-xs font-bold text-amber-700" data-testid="impact-sim-savings">{fmtInt(simSavings)} €</p>
                <p className="text-[9px] text-slate-400">économies / an</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="flex items-center justify-center gap-0.5 font-mono text-xs font-bold text-sky-700" data-testid="impact-sim-cars">
                  <Car className="h-3 w-3" /> {fmtInt(simCars)}
                </p>
                <p className="text-[9px] text-slate-400">voitures équiv.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        data-testid="impact-widget-button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="animate-pulse-ring fixed bottom-5 right-4 z-[65] flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white shadow-xl shadow-emerald-900/30 sm:right-6"
        aria-label="Mon impact"
      >
        {open ? <X className="h-6 w-6" /> : <Leaf className="h-6 w-6" />}
        {impact.entries.length > 0 && !open && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-amber-950">
            {impact.entries.length}
          </span>
        )}
      </motion.button>
    </>
  );
};
