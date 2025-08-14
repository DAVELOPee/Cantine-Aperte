import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Map, Marker } from 'mapbox-gl';
import { CANTINE_DATA } from '../constants';
import type { Cantina } from '../types';

// IMPORTANTE: Sostituisci questo segnaposto con il tuo vero token di Mapbox.
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGF2ZWxvb3BlMTAiLCJhIjoiY21lYW50dXoxMHZscDJsczhhdjJ0MWVpdSJ9.7TSwtISQVP8bzV5o7LsLTw';

const FlyToMeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 0010 16.57l5.416 1.934a1 1 0 001.325-1.096l-1.92-6.857a1 1 0 00-.545-.733l-5.45-2.725z" />
        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    </svg>
);


const MapPage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const userMarker = useRef<Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once

    if (!MAPBOX_ACCESS_TOKEN || MAPBOX_ACCESS_TOKEN.includes('INCOLLA_QUI')) {
        setError(
`Token di accesso Mapbox non configurato.
Per visualizzare la mappa, per favore segui questi passaggi:

1. Vai su account.mapbox.com e crea un account (è gratuito).
2. Crea un nuovo 'public access token' dalla tua dashboard.
3. Assicurati che non abbia restrizioni di URL (o che l'URL dell'app sia autorizzato).
4. Copia il token e incollalo per sostituire il segnaposto nella variabile \`MAPBOX_ACCESS_TOKEN\` all'inizio del file \`components/MapPage.tsx\`.`
        );
        return;
    }
    
    try {
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite view with streets
          center: [10.922, 42.359], // Center on Giglio Castello
          zoom: 1.5, // Start zoomed out
          pitch: 0,
          bearing: 0,
        });
        
        map.current = mapInstance;

        mapInstance.on('error', (e) => {
            console.error('Mapbox error:', e.error);
            let errorMessage = `Si è verificato un errore con la mappa: ${e.error?.message || 'Errore sconosciuto.'}`;
            if (e.error?.message && e.error.message.toLowerCase().includes('authorized')) {
                errorMessage += "\n\nQuesto errore indica spesso un problema con il token Mapbox. Verifica che sia corretto, attivo e non abbia restrizioni di URL che potrebbero bloccare questa applicazione."
            } else {
                errorMessage += "\n\nControlla il tuo token Mapbox e la connessione internet."
            }
            setError(errorMessage);
            map.current?.remove();
            map.current = null;
        });

        mapInstance.on('load', () => {
            setIsMapReady(true);
            // Add markers for cantine
            CANTINE_DATA.forEach((cantina: Cantina) => {
                const [lat, lng] = cantina.coordinates.split(',').map(Number);
                const el = document.createElement('div');
                el.style.backgroundImage = 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%238C2D19%22%20width%3D%2230px%22%20height%3D%2230px%22%3E%3Cpath%20stroke%3D%22%23FFF8F0%22%20stroke-width%3D%221%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M9.75%209.75V4.5a2.25%202.25%200%20012.25-2.25h0a2.25%202.25%200%20012.25%202.25v5.25m-4.5%200H8.25a5.25%205.25%200%2000-5.25%205.25v2.25a5.25%205.25%200%20005.25%205.25h7.5a5.25%205.25%200%20005.25-5.25v-2.25a5.25%205.25%200%2000-5.25-5.25H9.75z%22%20%2F%3E%3C%2Fsvg%3E")';
                el.style.width = '30px';
                el.style.height = '30px';
                el.style.backgroundSize = '100%';
                el.style.cursor = 'pointer';
                
                const popup = new mapboxgl.Popup({ offset: 25 }) 
                    .setHTML(`<h3 style="color: #8C2D19; font-weight: bold; margin: 0;">${cantina.name}</h3><p style="margin: 0;">${cantina.locationName}</p>`);

                new mapboxgl.Marker(el)
                    .setLngLat([lng, lat])
                    .setPopup(popup)
                    .addTo(mapInstance);
            });
        });

    } catch (err: any) {
        console.error("Failed to initialize Mapbox:", err);
        setError(`Impossibile inizializzare la mappa. Errore: ${err.message || 'Errore sconosciuto.'}`);
    }


    return () => {
        map.current?.remove();
        map.current = null;
    }
  }, []);

  const handleFlyToUserLocation = () => {
    if (!navigator.geolocation) {
        setError("Geolocalizzazione non supportata dal tuo browser.");
        return;
    }
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        if (map.current) {
            map.current.flyTo({
                center: [longitude, latitude],
                zoom: 16,
                pitch: 60, // angle for 3d effect
                bearing: -20,
                speed: 0.8,
                curve: 1,
                essential: true,
            });

            // If user marker already exists, just move it. Otherwise, create it.
            if (userMarker.current) {
                userMarker.current.setLngLat([longitude, latitude]);
            } else {
                userMarker.current = new mapboxgl.Marker({ color: '#D97706' })
                    .setLngLat([longitude, latitude])
                    .setPopup(new mapboxgl.Popup().setHTML("<h3>La tua posizione</h3>"))
                    .addTo(map.current);
            }
        }
    }, () => {
        setError("Impossibile ottenere la posizione. Assicurati di aver concesso i permessi al browser.");
    }, { enableHighAccuracy: true });
  }

  if (error) {
    return (
        <div className="text-center p-4 md:p-8 bg-white rounded-lg shadow-lg animate-fade-in">
            <h3 className="text-2xl font-bold text-red-600 mb-4">Errore Mappa</h3>
            <p className="text-brand-text text-left whitespace-pre-line">{error}</p>
        </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-220px)] rounded-lg shadow-lg overflow-hidden animate-fade-in">
        <div ref={mapContainer} className="absolute top-0 bottom-0 w-full h-full" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <button
                onClick={handleFlyToUserLocation}
                disabled={!isMapReady}
                className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <FlyToMeIcon />
                Portami alla mia posizione
            </button>
        </div>
        <style>{`.mapboxgl-popup-content { font-family: 'Roboto', sans-serif; padding: 10px 15px; }`}</style>
    </div>
  );
};

export default MapPage;