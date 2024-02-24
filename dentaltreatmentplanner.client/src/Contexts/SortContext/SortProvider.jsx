import { useState, useCallback, useEffect } from 'react';
import { SortContext } from './SortContext';

export const SortProvider = ({ children }) => {

    const [alignment, setAlignment] = useState('default');
    const [activeTxCategories, setActiveTxCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [initialRenderComplete, setInitialRenderComplete] = useState(false); 

    useEffect(() => { //select all categories when they are fetched / updated
        setSelectedCategories(new Set(activeTxCategories));
    }, [activeTxCategories]);

    const handleAlignmentChange = (newAlignment) => {
        setAlignment(newAlignment);
    };

    const initActiveTxCategories = (categories) => {
        setActiveTxCategories(categories);
    };

    const toggleSelectAll = (isSelected) => {
        if (isSelected) {
            // When selecting all, add all category names to the set
            setSelectedCategories(new Set(activeTxCategories));
        } else {
            // When deselecting all, clear the set
            setSelectedCategories(new Set());
        }
    };

    const updateSelectedCategories = (category) => {
        setSelectedCategories((prevSelectedCategories) => {
            const newSelectedCategories = new Set(prevSelectedCategories);
            if (newSelectedCategories.has(category)) {
                newSelectedCategories.delete(category);
            } else {
                newSelectedCategories.add(category);
            }
            console.log("Updated Selected Categories:", Array.from(newSelectedCategories));

            return newSelectedCategories;
        });
    };

    const setRenderComplete = (value) => {
        setInitialRenderComplete(value);
    };

    return (
        <SortContext.Provider value={{
            alignment, setAlignment,
            handleAlignmentChange,
            activeTxCategories, initActiveTxCategories,
            selectedCategories, updateSelectedCategories, toggleSelectAll,
            initialRenderComplete, setRenderComplete
        }}>
            {children}
        </SortContext.Provider>
    );
};
