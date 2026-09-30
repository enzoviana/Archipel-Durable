import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Recycle, MapPin, Menu, X, User, ChevronDown } from "lucide-react";

const LINKS = [
  { href: "#bourse", label: "Bourse d'Échange" },
  { href: "#collectes", label: "Collectes" },
  { href: "#simulateur", label: "Simulateur" },
  { href: "#actualites", label: "Actualités" },
  { href: "#rdv", label: "Rendez-vous" },
];

export const Navbar = ({ territory, onOpenTerritory, isLoggedIn, onOpenAuth }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "bg-white/85 shadow-lg shadow-emerald-900/5" : "bg-white/60"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" data-testid="nav-logo" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest text-white shadow-md shadow-emerald-900/20">
            <Recycle className="h-5 w-5" />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-forest">
            Archipel <span className="text-emerald-500">Durable</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.href.slice(1)}`}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-emerald-50 hover:text-forest"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            data-testid="nav-territory-button"
            onClick={onOpenTerritory}
            className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-mint px-3.5 py-2 text-sm font-semibold text-forest transition-colors duration-200 hover:border-emerald-400 sm:flex"
          >
            <MapPin className="h-4 w-4" />
            {territory.name}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            data-testid="nav-auth-button"
            onClick={onOpenAuth}
            className="flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition-colors duration-200 hover:bg-forest-hover"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{isLoggedIn ? "Mon espace" : "Se connecter"}</span>
          </button>
          <button
            data-testid="nav-menu-button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-emerald-50 lg:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-emerald-100 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  data-testid={`nav-mobile-link-${l.href.slice(1)}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-forest"
                >
                  {l.label}
                </a>
              ))}
              <button
                data-testid="nav-mobile-territory-button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenTerritory();
                }}
                className="flex items-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-forest"
              >
                <MapPin className="h-4 w-4" /> Territoire : {territory.name}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
