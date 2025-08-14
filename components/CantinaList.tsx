
import React, { useState } from 'react';
import CantinaCard from './CantinaCard';
import type { Cantina } from '../types';

interface CantinaListProps {
  cantine: Cantina[];
  onSelectCantina: (cantina: Cantina) => void;
  setStartingPoint: (coords: string) => void;
  startingPoint: string | null;
}

const LocationStatus: React.FC<{ status: 'idle' | 'loading' | 'success' | 'error'; hasStartingPoint: boolean }> = ({ status, hasStartingPoint }) => {
    if (status === 'loading') {
        return <p className="text-sm text-brand-light-text mt-2">Acquisizione della posizione...</p>;
    }
    if (status === 'success' || hasStartingPoint) {
        return <p className="text-sm text-green-600 mt-2">Punto di partenza impostato! Ora scegli la cantina e ti indicherò la strada più breve per raggiungerla!</p>;
    }
    if (status === 'error') {
        return <p className="text-sm text-red-600 mt-2">Impossibile ottenere la posizione. Assicurati di aver dato i permessi.</p>;
    }
    return <p className="text-sm text-brand-light-text mt-2">Imposta la tua posizione per ricevere indicazioni a piedi.</p>;
};

const CantinaList: React.FC<CantinaListProps> = ({ cantine, onSelectCantina, setStartingPoint, startingPoint }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSetStartingPoint = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setStartingPoint(`${latitude},${longitude}`);
        setStatus('success');
      },
      () => {
        setStatus('error');
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <>
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold text-brand-primary mb-2">Benvenuto!</h2>
        <button
          onClick={handleSetStartingPoint}
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          📍 Imposta punto di partenza
        </button>
        <LocationStatus status={status} hasStartingPoint={!!startingPoint} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {cantine.map((cantina) => (
          <CantinaCard key={cantina.id} cantina={cantina} onSelect={onSelectCantina} />
        ))}
      </div>
    </>
  );
};

export default CantinaList;