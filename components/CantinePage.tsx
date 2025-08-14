import React, { useState, useEffect } from 'react';
import CantinaList from './CantinaList';
import CantinaDetail from './CantinaDetail';
import type { Cantina } from '../types';
import { CANTINE_DATA } from '../constants';

interface CantinePageProps {
    startingPoint: string | null;
    setStartingPoint: (coords: string) => void;
}

const CantinePage: React.FC<CantinePageProps> = ({ startingPoint, setStartingPoint }) => {
  const [selectedCantina, setSelectedCantina] = useState<Cantina | null>(null);

  useEffect(() => {
    // Scroll to top when the view changes
    window.scrollTo(0, 0);
  }, [selectedCantina]);

  const handleSelectCantina = (cantina: Cantina) => {
    setSelectedCantina(cantina);
  };

  const handleCloseDetail = () => {
    setSelectedCantina(null);
  };

  return (
    <>
      {selectedCantina ? (
        <CantinaDetail 
          cantina={selectedCantina} 
          onBack={handleCloseDetail} 
          startingPoint={startingPoint}
        />
      ) : (
        <CantinaList 
          cantine={CANTINE_DATA} 
          onSelectCantina={handleSelectCantina} 
          setStartingPoint={setStartingPoint}
          startingPoint={startingPoint}
        />
      )}
    </>
  );
};

export default CantinePage;
