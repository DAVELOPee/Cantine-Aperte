import React from 'react';
import type { ActiveView } from '../App';

interface BottomNavBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const HomeIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-1 transition-colors ${isActive ? 'text-white' : 'text-amber-200 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const FiascoIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75V4.5a2.25 2.25 0 012.25-2.25h0a2.25 2.25 0 012.25 2.25v5.25m-4.5 0H8.25a5.25 5.25 0 00-5.25 5.25v2.25a5.25 5.25 0 005.25 5.25h7.5a5.25 5.25 0 005.25-5.25v-2.25a5.25 5.25 0 00-5.25-5.25H9.75z" />
  </svg>
);

const GrapeIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a1.5 1.5 0 00-3 0v.105A3.502 3.502 0 005 5.5a3.5 3.5 0 003.5 3.5h.095a1.5 1.5 0 000-3H8.5a.5.5 0 010-1h.095a1.5 1.5 0 100-3V2zm3.5 4a1.5 1.5 0 013 0v.105A3.502 3.502 0 0115 8.5a3.5 3.5 0 01-3.5 3.5h-.095a1.5 1.5 0 010-3h.095a.5.5 0 000-1h-.095a1.5 1.5 0 01-3-.105V6zM5 14.5a3.5 3.5 0 003.5 3.5h.095a1.5 1.5 0 000-3h-.095a.5.5 0 010-1h.095a1.5 1.5 0 100-3H8.5a3.5 3.5 0 00-3.5 3.5z" clipRule="evenodd" />
  </svg>
);

const CantineIcon = ({ isActive }: { isActive: boolean }) => {
  const iconClass = `transition-colors ${isActive ? 'text-white' : 'text-amber-200 group-hover:text-white'}`;
  return (
    <div className="flex items-center justify-center h-6 mb-1 space-x-1">
      <FiascoIcon className={`h-6 w-6 ${iconClass}`} />
      <GrapeIcon className={`h-5 w-5 ${iconClass}`} />
    </div>
  );
};


const MapIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-1 transition-colors ${isActive ? 'text-white' : 'text-amber-200 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 0l6-3m0 0l-6-4m6 4l6 3" />
    </svg>
);

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors group ${isActive ? 'text-white' : 'text-amber-200 hover:text-white'}`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span>{label}</span>
  </button>
);


const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-brand-primary shadow-[0_-2px_10px_rgba(0,0,0,0.2)] flex justify-around items-center z-30">
      <NavItem
        icon={<HomeIcon isActive={activeView === 'home'} />}
        label="Home"
        isActive={activeView === 'home'}
        onClick={() => setActiveView('home')}
      />
      <NavItem
        icon={<CantineIcon isActive={activeView === 'cantine'} />}
        label="Cantine"
        isActive={activeView === 'cantine'}
        onClick={() => setActiveView('cantine')}
      />
      <NavItem
        icon={<MapIcon isActive={activeView === 'mappa'} />}
        label="Mappa"
        isActive={activeView === 'mappa'}
        onClick={() => setActiveView('mappa')}
      />
    </nav>
  );
};

export default BottomNavBar;