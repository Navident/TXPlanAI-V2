import { useContext } from 'react';
import { SortContext } from './SortContext'; 

const useSortContext = () => {
    const context = useContext(SortContext);
    if (context === undefined) {
        throw new Error('useSortContext must be used within a provider');
    }
    return context;
};

export default useSortContext;
