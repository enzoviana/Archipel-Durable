import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Apple, CalendarCheck, Check, Cpu, Lock, Mountain, Newspaper, Recycle, Shirt,
  TreePine, Weight, Wine, Wrench,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { COLLECTE_SLOTS, IMAGES, STREAMS } from "@/data/mockData";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const STREAM_ICONS = {
  papier: Newspaper, metal: Wrench, plastique: Recycle, verre: Wine, bois: TreePine,
  biodechets: Apple, textile: Shirt, d3e: Cpu, mineraux: Mountain,
};

export const Collectes = ({ canRegister = true, onLocked, onEarn, onImpact, territory, streams = STREAMS }) => {
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [quantity, setQuantity] = useState("");

  const stream = streams.find((s) => s.id === selected);

  const confirm = () => {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, colors: ["#10B981", "#0F5132", "#F59E0B"] });
    onEarn?.(30, "Inscription à une collecte");
    const qty = Number(quantity) || 0;
    onImpact?.({
      co2: Math.round(qty * stream.factor),
      savings: Math.round((qty * (45 + stream.factor * 30)) / 1000),
      label: `${stream.name} — ${qty} kg`,
    });
    toast.success("Inscription à la collecte confirmée", {
      description: `${stream.name} — ${date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} · ${slot} · ${quantity} kg`,
    });
    setSelected(null);
    setDate(null);
    setSlot(null);
    setQuantity("");
  };

  return (
    <section id="collectes" className="scroll-mt-24 bg-[#F8FAFC] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Module n°2</p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Collectes de déchets mutualisées
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Sélectionnez votre flux de matière, choisissez une date et un créneau : nos tournées passent collecter directement sur votre site.
          </p>
          {territory && (
            <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-mint px-4 py-2" data-testid="collectes-counter">
              <Weight className="h-4 w-4 text-forest" />
              <span className="font-mono text-sm font-bold text-forest">
                <AnimatedCounter key={territory.id} value={territory.stats.tonnes} />
              </span>
              <span className="text-xs font-medium text-forest/70">tonnes valorisées — territoire {territory.name}</span>
            </div>
          )}
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {streams.map((s, i) => {
            const Icon = STREAM_ICONS[s.id] || Recycle;
            const active = selected === s.id;
            return (
              <motion.button
                key={s.id}
                data-testid={`collecte-stream-${s.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelected(active ? null : s.id);
                  setDate(null);
                  setSlot(null);
                }}
                className={`group relative overflow-hidden rounded-3xl border-2 bg-white text-left shadow-sm transition-shadow duration-300 hover:shadow-xl ${
                  active ? "border-emerald-500 ring-4 ring-emerald-500/15" : "border-transparent hover:border-emerald-200"
                }`}
              >
                <div className="relative h-28 overflow-hidden sm:h-32">
                  <img loading="lazy" src={IMAGES[s.image]} alt={s.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <span
                    className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: s.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {active && (
                    <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-heading text-sm font-bold text-slate-900 sm:text-base">{s.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{s.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {stream && (
            <motion.div
              key="collecte-panel"
              data-testid="collecte-panel"
              initial={{ opacity: 0, y: 32, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 16, height: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-8 grid gap-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8 lg:grid-cols-[auto_1fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: stream.color }}>
                      {(() => { const Icon = STREAM_ICONS[stream.id] || Recycle; return <Icon className="h-5 w-5" />; })()}
                    </span>
                    <div>
                      <p className="font-heading text-lg font-bold text-slate-900">Collecte : {stream.name}</p>
                      <p className="text-xs text-slate-500">Choisissez une date de passage</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl border border-slate-200 p-2" data-testid="collecte-calendar">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={{ before: new Date() }}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-slate-900">Créneau de passage</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {COLLECTE_SLOTS.map((s) => (
                      <button
                        key={s}
                        data-testid={`collecte-slot-${s.slice(0, 5).replace(":", "h")}`}
                        onClick={() => setSlot(s)}
                        className={`rounded-xl border px-3 py-3 text-xs font-semibold transition-colors duration-200 ${
                          slot === s
                            ? "border-emerald-500 bg-mint text-forest shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <label className="mt-6 text-sm font-semibold text-slate-900" htmlFor="collecte-quantity">
                    Quantité estimée (kg)
                  </label>
                  <div className="relative mt-2">
                    <Weight className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="collecte-quantity"
                      data-testid="collecte-quantity-input"
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="ex : 250"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      data-testid="collecte-confirm-button"
                      disabled={canRegister ? !date || !slot || !quantity : false}
                      onClick={canRegister ? confirm : onLocked}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-colors duration-200 enabled:hover:bg-forest-hover disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {canRegister ? <CalendarCheck className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      {canRegister ? "Confirmer mon inscription" : "Réservé aux abonnés"}
                    </button>
                    <p className="mt-3 text-center text-[11px] text-slate-400">
                      Confirmation immédiate — un rappel vous sera envoyé la veille du passage.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
