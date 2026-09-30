import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BadgeCheck, Building2, CalendarCheck, Check, Clock,
  Leaf, Mail, RotateCcw, User, Video,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { BOOKING_SLOTS, BOOKING_TOPICS, IMAGES } from "@/data/mockData";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const TOPIC_ICONS = { diagnostic: Leaf, collecte: CalendarCheck, synergies: Building2 };

export const RendezVous = () => {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState(null);
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [done, setDone] = useState(false);

  const topicObj = BOOKING_TOPICS.find((t) => t.id === topic);
  const formValid = form.name.trim() && /.+@.+\..+/.test(form.email);

  const reset = () => {
    setStep(0);
    setTopic(null);
    setDate(null);
    setSlot(null);
    setForm({ name: "", email: "", company: "" });
    setDone(false);
  };

  const confirm = () => {
    setDone(true);
    confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors: ["#10B981", "#0F5132", "#F59E0B", "#0284C7"] });
    toast.success("Rendez-vous confirmé avec Angélique Baudin", {
      description: "Une invitation calendrier vient de vous être envoyée par e-mail.",
    });
  };

  return (
    <section id="rdv" className="scroll-mt-24 bg-forest-deep py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Accompagnement</p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Échangez avec la fondatrice
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-100/70 sm:text-base">
            Un diagnostic, un projet de collecte, une synergie à explorer ? Réservez un créneau en visio ou sur site avec Angélique Baudin.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <div className="relative h-64 overflow-hidden">
              <img loading="lazy" src={IMAGES.founder} alt="Angélique Baudin" className="h-full w-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className="font-heading text-xl font-bold text-white">Angélique Baudin</p>
                <p className="text-xs font-medium text-emerald-300">Fondatrice — Archipel Durable</p>
              </div>
            </div>
            <div className="space-y-3 p-5 text-xs text-emerald-100/80">
              <p className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-400" /> 12 ans d'expérience en écologie industrielle</p>
              <p className="flex items-center gap-2"><Video className="h-4 w-4 text-emerald-400" /> Visio ou rendez-vous sur site</p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-400" /> Réponse sous 24 h ouvrées</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            data-testid="booking-panel"
          >
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex min-h-[380px] flex-col items-center justify-center text-center"
                  data-testid="booking-confirmation"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-mint text-forest"
                  >
                    <Check className="h-10 w-10" />
                  </motion.span>
                  <h3 className="mt-6 font-heading text-2xl font-bold text-slate-900">Rendez-vous confirmé !</h3>
                  <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                    <p className="font-semibold text-forest">{topicObj?.label}</p>
                    <p>
                      {date?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} à {slot}
                    </p>
                    <p className="text-xs text-slate-400">Une invitation calendrier a été envoyée à {form.email}</p>
                  </div>
                  <button
                    data-testid="booking-reset-button"
                    onClick={reset}
                    className="mt-8 flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-emerald-400 hover:text-forest"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Prendre un autre rendez-vous
                  </button>
                </motion.div>
              ) : step === 0 ? (
                <motion.div key="s0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Étape 1 / 3</p>
                  <h3 className="mt-1 font-heading text-lg font-bold text-slate-900">Quel est l'objet de votre échange ?</h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {BOOKING_TOPICS.map((t) => {
                      const Icon = TOPIC_ICONS[t.id];
                      return (
                        <button
                          key={t.id}
                          data-testid={`booking-topic-${t.id}`}
                          onClick={() => setTopic(t.id)}
                          className={`rounded-2xl border-2 p-5 text-left transition-colors duration-200 ${
                            topic === t.id ? "border-emerald-500 bg-mint/50" : "border-slate-200 hover:border-emerald-300"
                          }`}
                        >
                          <Icon className={`h-6 w-6 ${topic === t.id ? "text-forest" : "text-slate-400"}`} />
                          <p className="mt-3 text-sm font-bold text-slate-900">{t.label}</p>
                          <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><Clock className="h-3 w-3" /> {t.duration}</p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      data-testid="booking-next-step1"
                      disabled={!topic}
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-white transition-colors enabled:hover:bg-forest-hover disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continuer <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ) : step === 1 ? (
                <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Étape 2 / 3</p>
                  <h3 className="mt-1 font-heading text-lg font-bold text-slate-900">Choisissez votre créneau</h3>
                  <div className="mt-5 grid gap-6 sm:grid-cols-[auto_1fr]">
                    <div className="rounded-2xl border border-slate-200 p-2" data-testid="booking-calendar">
                      <Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Horaires disponibles</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {BOOKING_SLOTS.map((s) => (
                          <button
                            key={s}
                            data-testid={`booking-slot-${s.replace(":", "h")}`}
                            onClick={() => setSlot(s)}
                            className={`rounded-xl border px-3 py-3 text-xs font-semibold transition-colors duration-200 ${
                              slot === s ? "border-emerald-500 bg-mint text-forest shadow-sm" : "border-slate-200 hover:border-emerald-300"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <p className="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
                        {topicObj?.label} · {topicObj?.duration} · visio ou sur site (précisé dans l'invitation).
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button data-testid="booking-back-step2" onClick={() => setStep(0)} className="flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-emerald-300">
                      <ArrowLeft className="h-4 w-4" /> Retour
                    </button>
                    <button
                      data-testid="booking-next-step2"
                      disabled={!date || !slot}
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-white transition-colors enabled:hover:bg-forest-hover disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continuer <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Étape 3 / 3</p>
                  <h3 className="mt-1 font-heading text-lg font-bold text-slate-900">Vos coordonnées</h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        data-testid="booking-name-input"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Nom et prénom *"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        data-testid="booking-email-input"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="E-mail professionnel *"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div className="relative sm:col-span-2">
                      <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        data-testid="booking-company-input"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Entreprise (facultatif)"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl bg-mint/50 p-4 text-xs leading-relaxed text-forest">
                    Récapitulatif : <strong>{topicObj?.label}</strong> — {date?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {slot}.
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button data-testid="booking-back-step3" onClick={() => setStep(1)} className="flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-emerald-300">
                      <ArrowLeft className="h-4 w-4" /> Retour
                    </button>
                    <button
                      data-testid="booking-submit-button"
                      disabled={!formValid}
                      onClick={confirm}
                      className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-forest-deep shadow-lg shadow-emerald-500/30 transition-colors enabled:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <CalendarCheck className="h-4 w-4" /> Confirmer le rendez-vous
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
