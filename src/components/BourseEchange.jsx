import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Boxes, Building2, Factory, Gift, LayoutGrid, Lock, Mail, MapPin,
  Phone, Scale, Search, ShieldCheck, Tag, Truck, User, Wrench,
} from "lucide-react";
import { IMAGES, LISTINGS } from "@/data/mockData";

const TABS = [
  { id: "particuliers", label: "Particuliers", icon: User },
  { id: "pro", label: "Professionnels", icon: Building2 },
];

const FILTERS = [
  { id: "all", label: "Tous", icon: LayoutGrid },
  { id: "production", label: "Production", icon: Factory },
  { id: "qhse", label: "QHSE", icon: ShieldCheck },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "logistique", label: "Logistique", icon: Truck },
  { id: "autres", label: "Autres & Admin.", icon: Boxes },
];

const CHANNELS = [
  { id: "don", name: "Don", desc: "Donnez une seconde vie à vos matières dormantes.", icon: Gift, image: "cardboard", span: "sm:col-span-2 sm:row-span-2" },
  { id: "recherche", name: "Recherche", desc: "Exprimez un besoin, le territoire répond.", icon: Search, image: "plastic", span: "" },
  { id: "braderie", name: "Braderie", desc: "Ventes solidaires inter-entreprises.", icon: Tag, image: "textile", span: "" },
];

const TYPE_STYLES = {
  don: { label: "Don", cls: "bg-mint text-forest" },
  recherche: { label: "Recherche", cls: "bg-sky-100 text-sky-800" },
  braderie: { label: "Braderie", cls: "bg-amber-100 text-amber-800" },
};

const ContactBox = ({ listing, canViewContacts, onRequestAuth }) => {
  if (canViewContacts) {
    return (
      <div className="mt-4 space-y-1.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-slate-700" data-testid={`listing-contact-${listing.id}`}>
        <p className="font-semibold text-forest">{listing.contact.name} — {listing.contact.person}</p>
        <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-emerald-600" />{listing.contact.phone}</p>
        <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-emerald-600" />{listing.contact.email}</p>
      </div>
    );
  }
  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4" data-testid={`listing-locked-${listing.id}`}>
      <div className="select-none space-y-1.5 text-xs text-slate-600 blur-[5px]" aria-hidden="true">
        <p className="font-semibold">{listing.contact.name} — {listing.contact.person}</p>
        <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{listing.contact.phone}</p>
        <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{listing.contact.email}</p>
      </div>
      <button
        data-testid={`listing-unlock-${listing.id}`}
        onClick={onRequestAuth}
        className="absolute inset-0 flex items-center justify-center gap-2 bg-white/40 text-xs font-bold text-forest backdrop-blur-[2px] transition-colors duration-200 hover:bg-emerald-50/60"
      >
        <Lock className="h-4 w-4" />
        Débloquer les coordonnées
      </button>
    </div>
  );
};

export const BourseEchange = ({ canViewContacts = false, onRequestAuth, listings: listingsProp, onPublish }) => {
  const [tab, setTab] = useState("pro");
  const [service, setService] = useState("all");
  const [channel, setChannel] = useState("all");

  const listings = (listingsProp || LISTINGS).filter(
    (l) => l.audience === tab && (service === "all" || l.service === service) && (channel === "all" || l.type === channel)
  );

  return (
    <section id="bourse" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Module n°1</p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            La Bourse d'Échange de matières
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Donnez, recherchez ou bradez vos matières entre acteurs du territoire. Chaque annonce valorisée, c'est de l'enfouissement évité.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <div className="flex rounded-full border border-slate-200 bg-slate-100 p-1" data-testid="bourse-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                data-testid={`bourse-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                  tab === t.id ? "text-white" : "text-slate-600 hover:text-forest"
                }`}
              >
                {tab === t.id && (
                  <motion.span layoutId="bourse-tab-pill" className="absolute inset-0 rounded-full bg-forest shadow-md" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <t.icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                data-testid={`bourse-filter-${f.id}`}
                onClick={() => setService(f.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors duration-200 ${
                  service === f.id
                    ? "border-emerald-500 bg-mint text-forest shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-forest"
                }`}
              >
                <f.icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 grid auto-rows-[190px] grid-cols-1 gap-4 sm:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <motion.button
              key={c.id}
              data-testid={`bourse-channel-${c.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setChannel((v) => (v === c.id ? "all" : c.id))}
              className={`group relative overflow-hidden rounded-3xl text-left shadow-md transition-shadow duration-300 hover:shadow-2xl ${c.span} ${
                channel === c.id ? "ring-4 ring-emerald-500 ring-offset-2" : ""
              }`}
            >
              <img loading="lazy" src={IMAGES[c.image]} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/30 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-6">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <c.icon className="h-5 w-5" />
                </span>
                <p className="font-heading text-xl font-bold text-white">{c.name}</p>
                <p className="mt-1 text-xs text-emerald-50/80">{c.desc}</p>
                {channel === c.id && (
                  <span className="absolute right-4 top-4 rounded-full bg-emerald-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-forest-deep">
                    Filtre actif
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-slate-900" data-testid="bourse-results-count">
              {listings.length} annonce{listings.length > 1 ? "s" : ""} disponible{listings.length > 1 ? "s" : ""}
            </h3>
            {channel !== "all" && (
              <button data-testid="bourse-clear-channel" onClick={() => setChannel("all")} className="text-xs font-semibold text-emerald-600 hover:text-forest">
                Réinitialiser le canal
              </button>
            )}
          </div>

          <motion.div layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {listings.map((l) => (
                <motion.article
                  layout
                  key={l.id}
                  data-testid={`listing-card-${l.id}`}
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6 }}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-900/10"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img loading="lazy" src={IMAGES[l.image]} alt={l.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${TYPE_STYLES[l.type].cls}`}>
                      {TYPE_STYLES[l.type].label}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur-sm">
                      {FILTERS.find((f) => f.id === l.service)?.label}
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 className="font-heading text-base font-semibold leading-snug text-slate-900">{l.title}</h4>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-emerald-600" />{l.location}</span>
                      <span className="flex items-center gap-1"><Scale className="h-3.5 w-3.5 text-emerald-600" />{l.quantity}</span>
                    </div>
                    <ContactBox listing={l} canViewContacts={canViewContacts} onRequestAuth={onRequestAuth} />
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {listings.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center" data-testid="bourse-empty">
              <Search className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-600">Aucune annonce pour cette combinaison de filtres.</p>
              <p className="mt-1 text-xs text-slate-400">Essayez un autre service ou un autre canal.</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-forest p-6 sm:flex-row sm:items-center sm:p-8"
          >
            <div>
              <p className="font-heading text-lg font-bold text-white">Vous avez une matière à proposer ?</p>
              <p className="mt-1 text-sm text-emerald-100/80">Publiez votre annonce en 2 minutes, elle est visible par tout le territoire.</p>
            </div>
            <button
              data-testid="bourse-publish-button"
              onClick={onPublish || onRequestAuth}
              className="group flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-bold text-forest-deep transition-colors duration-200 hover:bg-emerald-300"
            >
              Déposer une annonce
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
