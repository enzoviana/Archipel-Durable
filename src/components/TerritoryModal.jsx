import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Weight, Wind, Building2, MousePointerClick } from "lucide-react";
import { MapContainer, TileLayer, Circle, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TERRITORIES } from "@/data/mockData";
import { toast } from "sonner";

const ZONES = [
  { id: "dunkerquois", center: [51.038, 2.376], radius: 15000 },
  { id: "calaisis", center: [50.953, 1.855], radius: 13500 },
  { id: "boulonnais", center: [50.726, 1.611], radius: 15000 },
];

const pinIcon = (zone, color, testidPrefix) =>
  L.divIcon({
    className: "terr-pin-wrapper",
    html: `<div data-testid="${testidPrefix}-${zone.id}" class="terr-marker" style="background:${color}"><span></span></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 22],
  });

const MapSizer = () => {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 350);
    return () => clearTimeout(t);
  }, [map]);
  return null;
};

export const TerritoryMap = ({ active, hovered, onHover, onPick, height = 360, testidPrefix = "territory-zone" }) => (
  <div className="overflow-hidden rounded-2xl border border-emerald-100 shadow-inner" data-testid="territory-map">
    <MapContainer
      center={[50.86, 1.98]}
      zoom={9}
      scrollWheelZoom={false}
      zoomControl={true}
      style={{ height, width: "100%" }}
    >
      <MapSizer />
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {ZONES.map((z) => {
        const t = TERRITORIES.find((tt) => tt.id === z.id);
        const isActive = active === z.id;
        const isHovered = hovered === z.id;
        const handlers = {
          click: () => onPick(t),
          mouseover: () => onHover(z.id),
          mouseout: () => onHover(null),
        };
        return (
          <span key={z.id}>
            <Circle
              center={z.center}
              radius={z.radius}
              pathOptions={{
                color: t.color,
                weight: isActive ? 3 : 2,
                dashArray: isActive ? null : "6 6",
                fillColor: t.color,
                fillOpacity: isActive ? 0.32 : isHovered ? 0.24 : 0.12,
              }}
              eventHandlers={handlers}
            />
            <Marker position={z.center} icon={pinIcon(z, t.color, testidPrefix)} eventHandlers={handlers}>
              <Tooltip permanent direction="bottom" offset={[0, 6]} className={`terr-label terr-label-${z.id}`}>
                {t.name}
              </Tooltip>
            </Marker>
          </span>
        );
      })}
    </MapContainer>
  </div>
);

export const TerritoryModal = ({ open, onClose, territory, onSelect }) => {
  const [preview, setPreview] = useState(null);

  const handleSelect = (t) => {
    onSelect(t);
    setPreview(null);
    toast.success(`Territoire sélectionné : ${t.name}`, {
      description: "Les statistiques et services sont désormais contextualisés.",
    });
  };

  const shown = TERRITORIES.find((t) => t.id === preview) || territory;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-forest-deep/70 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            data-testid="territory-modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              data-testid="territory-modal-close"
              onClick={onClose}
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            >
              <motion.p
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600"
              >
                <MousePointerClick className="h-4 w-4" /> Bienvenue sur Archipel Durable
              </motion.p>
              <motion.h2
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                Cliquez sur votre territoire
              </motion.h2>
              <motion.p
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="mt-1.5 text-sm text-slate-500"
              >
                Carte du littoral Nord / Pas-de-Calais — cliquez sur une zone ou un marqueur : annonces, collectes et statistiques s'adaptent instantanément.
              </motion.p>

              <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="mt-5">
                <TerritoryMap
                  active={territory.id}
                  hovered={preview}
                  onHover={setPreview}
                  onPick={handleSelect}
                />
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                className="mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-emerald-100 bg-[#F8FAFC] p-4"
                data-testid="territory-map-stats"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint text-forest">
                    <Weight className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-mono text-sm font-bold text-slate-900">{shown.stats.tonnes.toLocaleString("fr-FR")} t</p>
                    <p className="text-[10px] font-medium text-slate-500">valorisées</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Wind className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-mono text-sm font-bold text-slate-900">{shown.stats.co2.toLocaleString("fr-FR")} t</p>
                    <p className="text-[10px] font-medium text-slate-500">CO₂ évitées</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-mono text-sm font-bold text-slate-900">{shown.stats.entreprises}</p>
                    <p className="text-[10px] font-medium text-slate-500">entreprises</p>
                  </div>
                </div>
              </motion.div>
              <p className="mt-3 text-center text-[11px] font-medium text-slate-400">
                Zone survolée ou active : <span className="font-bold text-forest">{shown.name}</span> — cliquez directement sur la carte pour la choisir.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
