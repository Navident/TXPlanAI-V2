import { useContext } from 'react';
import { BusinessContext } from './BusinessContext';

export const useBusiness = () => {
    const context = useContext(BusinessContext);
    return context;
};