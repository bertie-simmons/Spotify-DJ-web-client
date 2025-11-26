import React, { createContext, useContext, useState, useCallback } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
    const context = useContext(NavigationContext)

    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};


export const NavigationProvider = ({ children }) => {
  const [history, setHistory] = useState([{ type: 'home' }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // navigate to a new view
  const navigate = useCallback((view) => {
    setHistory(prev => {
      // remove any forward history when navigating to a new view
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, view];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  // navigate back
  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // navigate forward
  const goForward = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, history.length]);
  
};