import { useState, useCallback, useEffect } from 'react';
import { SortContext } from './SortContext';

export const SortProvider = ({ children }) => {

    const [alignment, setAlignment] = useState('default');

    const handleAlignmentChange = (newAlignment) => {
        setAlignment(newAlignment);
    };

    return (
        <SortContext.Provider value={{
            alignment, setAlignment,
            handleAlignmentChange
        }}>
            {children}
        </SortContext.Provider>
    );
};
