import { useState } from "react";
import { Lock, Mail, Recycle, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

export const AuthModal = ({ open, onOpenChange, onSuccess }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSuccess();
    onOpenChange(false);
    toast.success(mode === "login" ? "Bon retour parmi nous !" : "Compte créé — bienvenue dans l'Archipel !", {
      description: "Les coordonnées des annonces sont désormais débloquées.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl" data-testid="auth-modal">
        <DialogHeader>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-white shadow-lg shadow-emerald-900/20">
            <Recycle className="h-7 w-7" />
          </span>
          <DialogTitle className="text-center font-heading text-xl font-bold text-slate-900">
            {mode === "login" ? "Connexion à votre espace" : "Créer votre compte gratuit"}
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-slate-500">
            Débloquez les coordonnées des annonceurs et publiez vos propres annonces.
          </DialogDescription>
        </DialogHeader>

        <div className="mx-auto flex w-full max-w-xs rounded-full border border-slate-200 bg-slate-100 p-1">
          {[
            { id: "login", label: "Connexion" },
            { id: "signup", label: "Inscription" },
          ].map((m) => (
            <button
              key={m.id}
              data-testid={`auth-tab-${m.id}`}
              onClick={() => setMode(m.id)}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-bold transition-colors duration-200 ${
                mode === m.id ? "bg-forest text-white shadow" : "text-slate-500 hover:text-forest"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                data-testid="auth-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom et prénom"
                required
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              data-testid="auth-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse e-mail"
              required
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              data-testid="auth-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              minLength={4}
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button
            data-testid="auth-submit-button"
            type="submit"
            className="w-full rounded-full bg-forest py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-colors duration-200 hover:bg-forest-hover"
          >
            {mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>
        <p className="text-center text-[10px] leading-relaxed text-slate-400">
          Démonstration front-end — aucune donnée n'est transmise ni conservée.
        </p>
      </DialogContent>
    </Dialog>
  );
};
