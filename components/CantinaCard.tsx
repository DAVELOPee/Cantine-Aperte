
import React from 'react';
import type { Cantina } from '../types';

interface CantinaCardProps {
  cantina: Cantina;
  onSelect: (cantina: Cantina) => void;
}

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);


const CantinaCard: React.FC<CantinaCardProps> = ({ cantina, onSelect }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out group"
      onClick={() => onSelect(cantina)}
    >
      <div className="relative">
        <img src={cantina.imageUrl} alt={cantina.name} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h3 className="absolute bottom-0 left-0 p-4 text-xl font-serif font-bold text-white">
          {cantina.name}
        </h3>
      </div>
      <div className="p-4 bg-amber-50">
        <p className="text-sm text-brand-light-text flex items-center">
            <LocationIcon/>
            {cantina.locationName}
        </p>
      </div>
    </div>
  );
};

export default CantinaCard;
