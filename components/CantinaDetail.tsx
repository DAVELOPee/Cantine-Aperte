
import React from 'react';
import type { Cantina } from '../types';

interface CantinaDetailProps {
  cantina: Cantina;
  onBack: () => void;
  startingPoint: string | null;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-secondary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
    </svg>
);

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);


const CantinaDetail: React.FC<CantinaDetailProps> = ({ cantina, onBack, startingPoint }) => {
  const mapUrl = startingPoint
    ? `https://www.google.com/maps/dir/?api=1&origin=${startingPoint}&destination=${cantina.coordinates}&travelmode=walking`
    : cantina.mapLink;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
      >
        <BackIcon/>
        Tutte le Cantine
      </button>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <img src={cantina.imageUrl} alt={cantina.name} className="w-full h-64 md:h-80 object-cover" />
        <div className="p-6 md:p-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-2">{cantina.name}</h2>
          <p className="text-lg text-brand-light-text font-semibold mb-4">{cantina.locationName}</p>
          
          <p className="text-brand-text leading-relaxed mb-6">
            {cantina.description}
          </p>

          <div className="flex items-center text-brand-text font-medium mb-6 p-3 bg-amber-50 rounded-lg">
             <ClockIcon/>
             <span>Orario: {cantina.hours}</span>
          </div>
          
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-transform transform hover:scale-105"
          >
            <MapPinIcon/>
            Vai a piedi
          </a>
        </div>
      </div>
    </div>
  );
};

export default CantinaDetail;
