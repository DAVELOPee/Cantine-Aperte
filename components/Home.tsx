import React from 'react';

const GrapeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brand-secondary mb-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a1.5 1.5 0 00-3 0v.105A3.502 3.502 0 005 5.5a3.5 3.5 0 003.5 3.5h.095a1.5 1.5 0 000-3H8.5a.5.5 0 010-1h.095a1.5 1.5 0 100-3V2zm3.5 4a1.5 1.5 0 013 0v.105A3.502 3.502 0 0115 8.5a3.5 3.5 0 01-3.5 3.5h-.095a1.5 1.5 0 010-3h.095a.5.5 0 000-1h-.095a1.5 1.5 0 01-3-.105V6zM5 14.5a3.5 3.5 0 003.5 3.5h.095a1.5 1.5 0 000-3h-.095a.5.5 0 010-1h.095a1.5 1.5 0 100-3H8.5a3.5 3.5 0 00-3.5 3.5z" clipRule="evenodd" />
    </svg>
);

const Home: React.FC = () => {
  return (
    <div className="text-center animate-fade-in p-4 md:p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <GrapeIcon />
        <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">
          Benvenuto a Cantine Aperte!
        </h2>
        <p className="text-brand-text text-lg mb-2">
          L'evento più atteso dell'anno all'Isola del Giglio.
        </p>
        <p className="text-brand-light-text">
          Usa la barra di navigazione qui sotto per scoprire le cantine e visualizzarle sulla mappa interattiva.
        </p>
      </div>
    </div>
  );
};

export default Home;