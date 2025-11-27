import React from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

const NavigationButtons = () => {
  const { goBack, goForward, goHome, canGoBack, canGoForward, currentView } = useNavigation();

  const isOnHome = currentView?.type === 'home';

  return (
    <div className="flex items-center gap-2">
      {/* back Button */}
      <button
        onClick={goBack}
        disabled={!canGoBack}
        className={`p-2 rounded-full transition ${
          canGoBack
            ? 'bg-black bg-opacity-70 text-white hover:bg-opacity-80'
            : 'bg-black bg-opacity-30 text-gray-500 cursor-not-allowed'
        }`}
        title="Go back"
      >
        <ChevronLeft size={20} />
      </button>

      {/* forward Button */}
      <button
        onClick={goForward}
        disabled={!canGoForward}
        className={`p-2 rounded-full transition ${
          canGoForward
            ? 'bg-black bg-opacity-70 text-white hover:bg-opacity-80'
            : 'bg-black bg-opacity-30 text-gray-500 cursor-not-allowed'
        }`}
        title="Go forward"
      >
        <ChevronRight size={20} />
      </button>

      {/* home Button */}
      {!isOnHome && (
        <button
          onClick={goHome}
          className="p-2 rounded-full bg-black bg-opacity-70 text-white hover:bg-opacity-80 transition ml-2"
          title="Go home"
        >
          <Home size={20} />
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;