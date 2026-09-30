import { useState } from "react";
import { Building2, Mail, MapPin, Phone, Send, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TERRITORIES } from "@/data/mockData";
import { toast } from "sonner";

const inputCls =
  "w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

export const SubscribeModal = ({ open, onOpenChange, onSubmitRequest }) => {
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", tel: "", societe: "", territory: "Boulonnais" });

  const submit = (e) => {
    e.preventDefault();
    onSubmitRequest({
      id: `u${Date.now()}`,
      name: `${form.prenom} ${form.nom[0] || ""}.`,
      fullName: `${form.prenom} ${form.nom}`,
      company: form.societe,
      email: form.email,
      tel: form.tel,
      territory: form.territory,
      status: "en_attente",
      joined: "à l'instant",
    });
    onOpenChange(false);
    setForm({ prenom: "", nom: "", email: "", tel: "", societe: "", territory: "Boulonnais" });
    toast.success("Demande d'abonnement envoyée", {
      description: "Angélique Baudin validera votre compte sous 24 h ouvrées.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl" data-testid="subscribe-modal">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold text-slate-900">Demande d'abonnement</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed text-slate-500">
            Vos coordonnées sont transmises à l'administratrice, qui valide manuellement chaque compte entreprise.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input data-testid="subscribe-prenom" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} placeholder="Prénom *" required className={inputCls} />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input data-testid="subscribe-nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Nom *" required className={inputCls} />
            </div>
          </div>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input data-testid="subscribe-societe" value={form.societe} onChange={(e) => setForm({ ...form, societe: e.target.value })} placeholder="Société *" required className={inputCls} />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input data-testid="subscribe-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="E-mail professionnel *" required className={inputCls} />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input data-testid="subscribe-tel" type="tel" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} placeholder="Téléphone *" required className={inputCls} />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select data-testid="subscribe-territory" value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })} className={inputCls}>
              {TERRITORIES.map((t) => (
                <option key={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <button
            data-testid="subscribe-submit-button"
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-forest py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-colors duration-200 hover:bg-forest-hover"
          >
            <Send className="h-4 w-4" /> Envoyer ma demande
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
