import React, { createContext, useContext, useState, useCallback } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
    const context = useContext(NavigationContext)

    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};


