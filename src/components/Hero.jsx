import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Building2, Landmark, MapPin, Recycle, Weight, Wind } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { IMAGES } from "@/data/mockData";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const BADGES = [
  { icon: Landmark, label: "Région Hauts-de-France" },
  { icon: MapPin, label: "CA du Boulonnais" },
  { icon: BadgeCheck, label: "ADEME" },
  { icon: Recycle, label: "Économie circulaire" },
];

export const Hero = ({ territory }) => {
  const counters = [
    { icon: Weight, label: "Tonnes valorisées", value: territory.stats.tonnes, testid: "counter-tonnes" },
    { icon: Wind, label: "Tonnes de CO₂ évitées", value: territory.stats.co2, testid: "counter-co2" },
    { icon: Building2, label: "Entreprises connectées", value: territory.stats.entreprises, testid: "counter-entreprises" },
  ];

  return (
    <section id="top" className="relative flex min-h-screen items-end overflow-hidden bg-forest-deep">
      <motion.img
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        src={IMAGES.hero}
        alt="Éoliennes sur le littoral"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/60 to-forest-deep/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/70 via-transparent to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-36 sm:px-6 sm:pb-24"
      >
        <motion.div variants={item} className="flex flex-wrap items-center gap-2">
          {BADGES.map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-50 backdrop-blur-md"
            >
              <b.icon className="h-3.5 w-3.5 text-emerald-300" />
              {b.label}
            </span>
          ))}
        </motion.div>

        <motion.p variants={item} className="mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-300">
          <MapPin className="h-4 w-4" /> Hub d'écologie industrielle — {territory.name}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Les déchets des uns deviennent les{" "}
          <span className="text-emerald-400">ressources des autres</span>.
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-emerald-50/85 sm:text-lg">
          Archipel Durable connecte les entreprises et les habitants du littoral pour échanger des matières,
          mutualiser les collectes et mesurer l'impact réel de l'économie circulaire.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
          <a
            href="#bourse"
            data-testid="hero-cta-bourse"
            className="group flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-bold text-forest-deep shadow-xl shadow-emerald-500/25 transition-colors duration-200 hover:bg-emerald-400"
          >
            Explorer la Bourse d'Échange
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#collectes"
            data-testid="hero-cta-collectes"
            className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/20"
          >
            S'inscrire aux collectes
          </a>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {counters.map((c, i) => (
            <motion.div
              key={c.testid}
              variants={item}
              whileHover={{ y: -6 }}
              className={`rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl ${i === 1 ? "animate-floaty" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-300">
                  <c.icon className="h-5 w-5" />
                </span>
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-100/70">{c.label}</p>
              </div>
              <p className="mt-3 font-mono text-3xl font-bold text-white sm:text-4xl" data-testid={c.testid}>
                <AnimatedCounter key={territory.id} value={c.value} />
              </p>
              <p className="mt-1 text-xs text-emerald-200/60">Territoire {territory.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
