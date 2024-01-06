import { useContext } from 'react';
import { BusinessContext } from './BusinessContext';

export const useBusiness = () => {
    const context = useContext(BusinessContext);
    console.log("useBusiness hook called. Context value:", context);
    return context;
};