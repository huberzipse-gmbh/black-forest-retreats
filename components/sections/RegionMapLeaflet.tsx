"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStrings } from "@/lib/i18n/useStrings";

// Neuenbürg, Nordschwarzwald.
const NEUENBUERG: [number, number] = [48.8466, 8.5953];

/**
 * Eigener Marker im Marken-Look (Messing/brass Pin), damit Leaflets kaputtes
 * Default-Icon (404 auf marker-icon.png unter Bundlern) gar nicht erst geladen wird.
 * divIcon rendert reines HTML/SVG → kein externer Asset-Request.
 */
const brassPin = L.divIcon({
  className: "bf-map-pin",
  html: `
    <span class="bf-map-pin__pulse"></span>
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none"
      stroke="#0f1813" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"
        fill="#c9a96a" stroke="#0f1813"/>
      <circle cx="12" cy="9" r="2.5" fill="#faf7f1" stroke="#0f1813"/>
    </svg>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 32],
  popupAnchor: [0, -30],
});

/**
 * Leaflet misst beim Mount manchmal Breite 0 (Container noch nicht gelayoutet
 * bzw. außerhalb des Viewports beim Lazy-Load). invalidateSize() nach dem Mount
 * und bei jeder Größenänderung des Containers → Kacheln füllen die ganze Fläche.
 */
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const fix = () => map.invalidateSize();
    fix();
    const t1 = setTimeout(fix, 150);
    const t2 = setTimeout(fix, 600);

    const container = map.getContainer();
    const ro = new ResizeObserver(fix);
    ro.observe(container);
    window.addEventListener("resize", fix);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("resize", fix);
    };
  }, [map]);

  return null;
}

export default function RegionMapLeaflet() {
  const t = useStrings();

  return (
    <MapContainer
      center={NEUENBUERG}
      zoom={12}
      scrollWheelZoom={false}
      className="bf-map h-full w-full"
      style={{ background: "var(--color-cream-100)" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={NEUENBUERG} icon={brassPin}>
        <Popup>
          <span className="bf-map-popup">{t.map.marker}</span>
        </Popup>
      </Marker>
      <MapResizer />
    </MapContainer>
  );
}
