import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Car, Coins, Route, TreePine, Wind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { AnimatedValue } from "@/components/AnimatedCounter";
import { STREAMS } from "@/data/mockData";

const fmtInt = (v) => Math.round(v).toLocaleString("fr-FR");

export const Simulateur = () => {
  const [volume, setVolume] = useState(20);
  const [streamId, setStreamId] = useState("papier");
  const [distance, setDistance] = useState(30);

  const stream = STREAMS.find((s) => s.id === streamId);

  const results = useMemo(() => {
    const annual = volume * 12;
    const co2 = Math.max(0, annual * stream.factor - annual * distance * 0.00009);
    const savings = annual * (45 + stream.factor * 30);
    return {
      co2,
      savings,
      cars: co2 / 2.2,
      trees: (co2 * 1000) / 25,
      trips: (co2 * 1000) / 44.4,
    };
  }, [volume, stream, distance]);

  return (
    <section id="simulateur" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Impact</p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Simulateur de gains environnementaux
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Déplacez les curseurs et visualisez en temps réel ce que la valorisation de vos déchets ferait gagner au territoire — et à votre budget.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8"
          >
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-semibold text-slate-900">Volume mensuel de déchets</label>
                <span className="font-mono text-lg font-bold text-forest" data-testid="sim-volume-value">{volume} t</span>
              </div>
              <Slider
                data-testid="sim-volume-slider"
                value={[volume]}
                onValueChange={([v]) => setVolume(v)}
                min={1}
                max={200}
                step={1}
                className="mt-4"
              />
              <div className="mt-1 flex justify-between text-[10px] font-medium text-slate-400"><span>1 t</span><span>200 t</span></div>
            </div>

            <div className="mt-8">
              <label className="text-sm font-semibold text-slate-900">Type de matière dominante</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {STREAMS.map((s) => (
                  <button
                    key={s.id}
                    data-testid={`sim-matiere-${s.id}`}
                    onClick={() => setStreamId(s.id)}
                    className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors duration-200 ${
                      streamId === s.id
                        ? "border-transparent text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                    }`}
                    style={streamId === s.id ? { backgroundColor: s.color } : undefined}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-semibold text-slate-900">Distance logistique (aller simple)</label>
                <span className="font-mono text-lg font-bold text-forest" data-testid="sim-distance-value">{distance} km</span>
              </div>
              <Slider
                data-testid="sim-distance-slider"
                value={[distance]}
                onValueChange={([v]) => setDistance(v)}
                min={5}
                max={200}
                step={5}
                className="mt-4"
              />
              <div className="mt-1 flex justify-between text-[10px] font-medium text-slate-400"><span>5 km</span><span>200 km</span></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="dot-map flex flex-col justify-between rounded-3xl bg-forest-deep p-6 text-white sm:p-8"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-300/80">
                  <Wind className="h-4 w-4" /> CO₂ évité / an
                </p>
                <p className="mt-2 font-mono text-4xl font-bold text-emerald-300 sm:text-5xl" data-testid="sim-result-co2">
                  <AnimatedValue value={results.co2} format={fmtInt} />
                  <span className="ml-1 text-lg font-semibold text-emerald-300/70">t</span>
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-300/80">
                  <Coins className="h-4 w-4" /> Économies / an
                </p>
                <p className="mt-2 font-mono text-4xl font-bold text-amber-300 sm:text-5xl" data-testid="sim-result-savings">
                  <AnimatedValue value={results.savings} format={fmtInt} />
                  <span className="ml-1 text-lg font-semibold text-amber-300/70">€</span>
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Car, label: "voitures retirées de la route", value: results.cars, testid: "sim-equiv-cars" },
                { icon: TreePine, label: "arbres plantés équivalents", value: results.trees, testid: "sim-equiv-trees" },
                { icon: Route, label: "trajets Paris–Boulogne évités", value: results.trips, testid: "sim-equiv-trips" },
              ].map((e) => (
                <div key={e.testid} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <e.icon className="h-5 w-5 text-emerald-300" />
                  <p className="mt-2 font-mono text-xl font-bold" data-testid={e.testid}>
                    <AnimatedValue value={e.value} format={fmtInt} />
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-emerald-100/60">{e.label}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[11px] leading-relaxed text-emerald-100/50">
              Estimation indicative basée sur les facteurs d'émission de la Base Carbone® (ADEME) appliqués à la valorisation de {stream.name.toLowerCase()}.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
