import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { CANTINE_DATA } from '../constants';
import type { Cantina } from '../types';

interface PlannerPageProps {
    startingPoint: string | null;
    setStartingPoint: (coords: string) => void;
}

const LocationStatus: React.FC<{ status: 'idle' | 'loading' | 'success' | 'error'; hasStartingPoint: boolean }> = ({ status, hasStartingPoint }) => {
    if (status === 'loading') {
        return <p className="text-sm text-brand-light-text mt-2">Acquisizione della posizione...</p>;
    }
    if (status === 'success' || hasStartingPoint) {
        return <p className="text-sm text-green-600 mt-2">Punto di partenza impostato! Ora puoi generare un percorso.</p>;
    }
    if (status === 'error') {
        return <p className="text-sm text-red-600 mt-2">Impossibile ottenere la posizione. Assicurati di aver dato i permessi.</p>;
    }
    return null;
};

const Spinner = () => (
    <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
    </div>
);

// Componente per visualizzare l'itinerario in modo sicuro
const RouteDisplay: React.FC<{ route: string }> = ({ route }) => {
    // Funzione per renderizzare una singola riga, gestendo il grassetto
    const renderLine = (line: string, index: number) => {
        if (line.trim() === '') return null;

        // Divide la riga in base al testo in grassetto (**testo**), mantenendo i delimitatori
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(part => part);

        return (
            <p key={index} className="mb-2 text-brand-text">
                {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="text-brand-primary">{part.slice(2, -2)}</strong>;
                    }
                    return <span key={i}>{part}</span>;
                })}
            </p>
        );
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl animate-fade-in">
            <h3 className="text-2xl font-serif font-bold text-brand-primary mb-4">🗺️ Il tuo Itinerario Personalizzato</h3>
            <div className="space-y-2">
                {route.split('\n').map(renderLine)}
            </div>
        </div>
    );
};


const PlannerPage: React.FC<PlannerPageProps> = ({ startingPoint, setStartingPoint }) => {
    const [selectedCantine, setSelectedCantine] = useState<number[]>([]);
    const [route, setRoute] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSetStartingPoint = () => {
        if (!navigator.geolocation) {
          setLocationStatus('error');
          return;
        }
        setLocationStatus('loading');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setStartingPoint(`${latitude},${longitude}`);
            setLocationStatus('success');
          },
          () => {
            setLocationStatus('error');
          },
          { enableHighAccuracy: true }
        );
    };

    const handleToggleCantina = (id: number) => {
        setSelectedCantine(prev => 
            prev.includes(id) ? prev.filter(cantinaId => cantinaId !== id) : [...prev, id]
        );
    };

    const handleGenerateRoute = async () => {
        if (!startingPoint) {
            setError("Per favore, imposta prima il tuo punto di partenza.");
            return;
        }
        if (selectedCantine.length < 2) {
            setError("Seleziona almeno due cantine per creare un percorso.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setRoute(null);
        
        // Controlla esplicitamente se la chiave API è disponibile.
        // In un'app web, `process.env` non è definito di default.
        // Questo controllo fornisce un messaggio di errore chiaro all'utente.
        if (typeof process === 'undefined' || !process.env.API_KEY) {
            setError("La chiave API di Gemini non è configurata. Per favore, ottieni una chiave API e assicurati che sia accessibile all'applicazione.");
            setIsLoading(false);
            return;
        }

        const cantineToVisit = CANTINE_DATA.filter(c => selectedCantine.includes(c.id));
        const cantineListPrompt = cantineToVisit.map(c => `- ${c.name} (situata in ${c.locationName})`).join('\n');

        const prompt = `Sei una guida turistica esperta per un festival enogastronomico sull'Isola del Giglio. Il tuo compito è creare un percorso a piedi ottimizzato ed efficiente per un visitatore.

Il visitatore si trova attualmente alle seguenti coordinate: ${startingPoint}.

Desidera visitare le seguenti cantine:
${cantineListPrompt}

Fornisci un itinerario a piedi chiaro, passo dopo passo, in italiano. Il percorso deve essere logico e facile da seguire per le strette vie di Giglio Castello. Inizia l'itinerario dal punto di partenza dell'utente. Concludi il percorso all'ultima cantina. Sii amichevole e incoraggiante. Usa la formattazione **grassetto** per evidenziare i nomi dei luoghi o le direzioni chiave.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setRoute(response.text);
        } catch (err) {
            console.error("Error generating route:", err);
            let errorMessage = "Si è verificato un errore durante la generazione del percorso. Potrebbe essere un problema di rete o con l'API di Gemini.";
            if (err instanceof Error) {
                 errorMessage += ` Dettagli: ${err.message}`;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-serif font-bold text-brand-primary mb-2">Pianifica il tuo Percorso</h2>
                <p className="text-brand-light-text">Seleziona le cantine, imposta la partenza e lascia che l'IA crei il tour perfetto per te!</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-brand-primary mb-4">1. Imposta il tuo punto di partenza</h3>
                <p className="text-sm text-brand-text mb-4">Ci serve la tua posizione per calcolare il percorso migliore.</p>
                <button
                    onClick={handleSetStartingPoint}
                    disabled={locationStatus === 'loading'}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    📍 Usa la mia posizione attuale
                </button>
                <LocationStatus status={locationStatus} hasStartingPoint={!!startingPoint} />
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-brand-primary mb-4">2. Scegli le tue tappe</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CANTINE_DATA.map(cantina => (
                        <label key={cantina.id} className={`flex items-center p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedCantine.includes(cantina.id) ? 'bg-amber-100 border-brand-secondary' : 'bg-gray-50 border-gray-200 hover:border-amber-400'}`}>
                            <input
                                type="checkbox"
                                checked={selectedCantine.includes(cantina.id)}
                                onChange={() => handleToggleCantina(cantina.id)}
                                className="h-5 w-5 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"
                            />
                            <span className="ml-3 font-medium text-brand-text">{cantina.name}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            <div className="text-center">
                 <button
                    onClick={handleGenerateRoute}
                    disabled={isLoading || !startingPoint || selectedCantine.length < 2}
                    className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? 'Creazione percorso...' : 'Genera Percorso Ottimizzato'}
                </button>
            </div>

            {isLoading && <Spinner />}
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow-md text-center">{error}</div>}
            {route && <RouteDisplay route={route} />}
        </div>
    );
};

export default PlannerPage;