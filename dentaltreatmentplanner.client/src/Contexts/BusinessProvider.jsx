import React, { useState } from 'react';
import { BusinessContext } from './BusinessContext';

// BusinessProvider.js
export const BusinessProvider = ({ children }) => {
    const [businessName, setBusinessName] = useState('');

    console.log("BusinessProvider rendered. Current businessName:", businessName);

    // Wrap setBusinessName to log calls to it
    const handleSetBusinessName = (name) => {
        console.log("Setting businessName to:", name);
        setBusinessName(name);
    };

    return (
        <BusinessContext.Provider value={{ businessName, setBusinessName: handleSetBusinessName }}>
            {children}
        </BusinessContext.Provider>
    );
};

