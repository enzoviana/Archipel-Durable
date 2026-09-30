import { useState } from "react";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { TerritoryModal } from "@/components/TerritoryModal";
import { Hero } from "@/components/Hero";
import { BourseEchange } from "@/components/BourseEchange";
import { Collectes } from "@/components/Collectes";
import { Simulateur } from "@/components/Simulateur";
import { Actualites } from "@/components/Actualites";
import { RendezVous } from "@/components/RendezVous";
import { AuthModal } from "@/components/AuthModal";
import { Footer } from "@/components/Footer";
import { AppShell } from "@/components/app/AppShell";
import { TERRITORIES } from "@/data/mockData";

function App() {
  const [view, setView] = useState("landing");
  const [role, setRole] = useState("visitor");
  const [territory, setTerritory] = useState(TERRITORIES[0]);
  const [territoryOpen, setTerritoryOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const enterApp = () => {
    setView("app");
    setTerritoryOpen(true);
  };

  if (view === "app") {
    return (
      <div className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased">
        <Toaster position="top-center" richColors />
        <AppShell
          role={role}
          setRole={setRole}
          territory={territory}
          onSelectTerritory={setTerritory}
          onOpenTerritory={() => setTerritoryOpen(true)}
          onExit={() => setView("landing")}
        />
        <TerritoryModal
          open={territoryOpen}
          onClose={() => setTerritoryOpen(false)}
          territory={territory}
          onSelect={(t) => {
            setTerritory(t);
            setTerritoryOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased">
      <Toaster position="top-center" richColors />
      <Navbar
        territory={territory}
        onOpenTerritory={() => setTerritoryOpen(true)}
        isLoggedIn={isLoggedIn}
        onOpenAuth={() => (isLoggedIn ? enterApp() : setAuthOpen(true))}
      />
      <TerritoryModal
        open={territoryOpen}
        onClose={() => setTerritoryOpen(false)}
        territory={territory}
        onSelect={(t) => {
          setTerritory(t);
          setTerritoryOpen(false);
        }}
      />
      <main>
        <Hero territory={territory} />
        <BourseEchange canViewContacts={isLoggedIn} onRequestAuth={() => setAuthOpen(true)} />
        <Collectes territory={territory} />
        <Simulateur />
        <Actualites />
        <RendezVous />
      </main>
      <Footer />
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => {
          setIsLoggedIn(true);
          setRole("abonne");
          enterApp();
        }}
      />
    </div>
  );
}

export default App;
