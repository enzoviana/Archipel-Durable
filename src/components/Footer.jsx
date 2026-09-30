import { useState } from "react";
import { Heart, Leaf, Linkedin, Mail, MapPin, Recycle, Send } from "lucide-react";
import { toast } from "sonner";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    toast.success("Inscription à la newsletter confirmée", {
      description: "Recevez chaque mois les synergies et actualités du territoire.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-forest-deep text-emerald-50" data-testid="footer">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-forest-deep">
                <Recycle className="h-5 w-5" />
              </span>
              <span className="font-heading text-lg font-bold text-white">
                Archipel <span className="text-emerald-400">Durable</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-emerald-100/60">
              Hub d'écologie industrielle et territoriale du littoral nord. Nous connectons les acteurs du Boulonnais, du Calaisis et du Dunkerquois pour transformer les déchets en ressources.
            </p>
            <p className="mt-4 flex items-center gap-2 text-xs text-emerald-100/60">
              <MapPin className="h-4 w-4 text-emerald-400" /> Port de Capécure, Boulogne-sur-Mer
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Modules</p>
            <ul className="mt-4 space-y-2.5 text-xs text-emerald-100/70">
              <li><a href="#bourse" className="transition-colors hover:text-white">Bourse d'Échange</a></li>
              <li><a href="#collectes" className="transition-colors hover:text-white">Collectes de déchets</a></li>
              <li><a href="#simulateur" className="transition-colors hover:text-white">Simulateur d'impact</a></li>
              <li><a href="#rdv" className="transition-colors hover:text-white">Prendre rendez-vous</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Territoires</p>
            <ul className="mt-4 space-y-2.5 text-xs text-emerald-100/70">
              <li>Boulonnais</li>
              <li>Calaisis</li>
              <li>Dunkerquois</li>
            </ul>
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-emerald-400">Suivez-nous</p>
            <div className="mt-3 flex gap-2">
              {[Linkedin, Mail, Leaf].map((Icon, i) => (
                <a
                  key={i}
                  href="#top"
                  data-testid={`footer-social-${i}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-emerald-200 transition-colors hover:border-emerald-400 hover:text-emerald-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Newsletter du territoire</p>
            <p className="mt-3 text-xs leading-relaxed text-emerald-100/60">
              Synergies du mois, nouvelles filières et événements, directement dans votre boîte mail.
            </p>
            <form onSubmit={subscribe} className="mt-4 flex overflow-hidden rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
              <input
                data-testid="footer-newsletter-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre e-mail"
                className="w-full bg-transparent px-4 py-3 text-xs text-white outline-none placeholder:text-emerald-100/40"
              />
              <button
                data-testid="footer-newsletter-submit"
                type="submit"
                className="flex items-center gap-1.5 bg-emerald-500 px-4 text-xs font-bold text-forest-deep transition-colors hover:bg-emerald-400"
              >
                <Send className="h-3.5 w-3.5" />
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-emerald-100/40 sm:flex-row">
          <p>© 2026 Archipel Durable — Fondé par Angélique Baudin</p>
          <p className="flex items-center gap-1.5">
            Conçu avec <Heart className="h-3 w-3 text-emerald-400" /> pour l'économie circulaire du littoral
          </p>
        </div>
      </div>
    </footer>
  );
};
