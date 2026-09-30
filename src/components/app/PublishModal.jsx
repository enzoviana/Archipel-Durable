import { useState } from "react";
import { Building2, FileText, Gift, MapPin, Scale, Search, Tag, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SERVICES } from "@/data/mockData";
import { toast } from "sonner";

const CHANNELS = [
  { id: "don", label: "Don", icon: Gift, image: "wood" },
  { id: "recherche", label: "Recherche", icon: Search, image: "plastic" },
  { id: "braderie", label: "Braderie", icon: Tag, image: "textile" },
];

const chip = (active) =>
  `rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors duration-200 ${
    active ? "border-emerald-500 bg-mint text-forest shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
  }`;

export const PublishModal = ({ open, onOpenChange, onAdd }) => {
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState("don");
  const [audience, setAudience] = useState("pro");
  const [service, setService] = useState("production");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onAdd({
      id: Date.now(),
      type: channel,
      audience,
      service,
      title,
      location: location || "Boulonnais",
      quantity: quantity || "1 lot",
      image: CHANNELS.find((c) => c.id === channel).image,
      contact: { name: "Mon organisation", person: "Moi", phone: "06 00 00 00 00", email: "moi@organisation.fr" },
    });
    onOpenChange(false);
    toast.success("Annonce publiée", { description: "Elle apparaît maintenant dans la Bourse d'Échange." });
    setTitle("");
    setQuantity("");
    setLocation("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-lg overflow-y-auto rounded-3xl" data-testid="publish-modal">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold text-slate-900">Déposer une annonce</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Votre annonce sera soumise à validation par l'administratrice avant publication (démo : publication immédiate).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Canal</label>
            <div className="mt-2 flex gap-2">
              {CHANNELS.map((c) => (
                <button key={c.id} type="button" data-testid={`publish-channel-${c.id}`} onClick={() => setChannel(c.id)} className={chip(channel === c.id)}>
                  <c.icon className="mr-1.5 inline h-3.5 w-3.5" />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Audience</label>
            <div className="mt-2 flex gap-2">
              <button type="button" data-testid="publish-audience-pro" onClick={() => setAudience("pro")} className={chip(audience === "pro")}>
                <Building2 className="mr-1.5 inline h-3.5 w-3.5" /> Professionnels
              </button>
              <button type="button" data-testid="publish-audience-particuliers" onClick={() => setAudience("particuliers")} className={chip(audience === "particuliers")}>
                <User className="mr-1.5 inline h-3.5 w-3.5" /> Particuliers
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Service interne</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <button key={s.id} type="button" data-testid={`publish-service-${s.id}`} onClick={() => setService(s.id)} className={chip(service === s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              data-testid="publish-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'annonce *"
              required
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Scale className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                data-testid="publish-quantity-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantité (ex : 500 kg)"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                data-testid="publish-location-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Commune"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <button
            data-testid="publish-submit-button"
            type="submit"
            className="w-full rounded-full bg-forest py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-colors duration-200 hover:bg-forest-hover"
          >
            Publier mon annonce
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
