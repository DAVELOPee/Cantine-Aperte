import React, { useState } from 'react';
import Home from './components/Home';
import CantinePage from './components/CantinePage';
import MapPage from './components/MapPage';
import BottomNavBar from './components/BottomNavBar';

export type ActiveView = 'home' | 'cantine' | 'mappa';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [startingPoint, setStartingPoint] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <Home />;
      case 'cantine':
        return <CantinePage startingPoint={startingPoint} setStartingPoint={setStartingPoint} />;
      case 'mappa':
        return <MapPage />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen w-full font-sans text-brand-text bg-brand-background">
      <header className="bg-brand-primary/95 shadow-lg p-4 sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wider">CANTINE APERTE</h1>
          <p className="text-lg font-serif italic text-amber-200">Isola del Giglio</p>
        </div>
      </header>

      <main className="p-4 md:p-8 pb-24">
        <div className="container mx-auto">
          {renderContent()}
        </div>
      </main>
      
      <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;