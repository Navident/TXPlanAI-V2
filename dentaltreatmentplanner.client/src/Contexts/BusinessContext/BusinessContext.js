import { createContext } from 'react';

export const BusinessContext = createContext({
    businessName: '',
    setBusinessName: () => { },
    patients: [],
    setPatients: () => { },
    searchQuery: '',
    setSearchQuery: () => { },
    filteredPatients: [],
    setFilteredPatients: () => { },
    selectedPatient: null, 
    setSelectedPatient: () => { },
    treatmentPhases: [], 
    setTreatmentPhases: () => { },
});
