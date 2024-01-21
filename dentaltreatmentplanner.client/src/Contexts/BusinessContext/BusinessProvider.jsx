import { useState, useEffect } from 'react';
import { BusinessContext } from './BusinessContext';
import { getPatientsForUserFacility } from '../../ClientServices/apiService';
import { getTreatmentPhases } from '../../ClientServices/apiService';

export const BusinessProvider = ({ children }) => {
    const [businessName, setBusinessName] = useState('');
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [treatmentPhases, setTreatmentPhases] = useState([]);

    // Fetch patients whenever the businessName changes
    useEffect(() => {
        fetchPatientsForFacility();
    }, []);

    useEffect(() => {
        const filtered = searchQuery
            ? patients.filter(patient =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : patients;
        setFilteredPatients(filtered);
    }, [searchQuery, patients]);

    useEffect(() => {
        const fetchTreatmentPhases = async () => {
            try {
                const fetchedPhases = await getTreatmentPhases();
                setTreatmentPhases(fetchedPhases || []);
            } catch (error) {
                console.error('Error fetching treatment phases:', error);
            }
        };

        fetchTreatmentPhases();
    }, []);

    const fetchPatientsForFacility = async () => {
        try {
            const fetchedPatients = await getPatientsForUserFacility();
            setPatients(fetchedPatients || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const refreshPatients = async () => {
        try {
            const fetchedPatients = await getPatientsForUserFacility();
            setPatients(fetchedPatients || []);
        } catch (error) {
            console.error('Error refreshing patients:', error);
        }
    };

    return (
        <BusinessContext.Provider value={{
            businessName, setBusinessName,
            patients, setPatients,
            searchQuery, setSearchQuery,
            filteredPatients, setFilteredPatients,
            selectedPatient, setSelectedPatient,
            refreshPatients,
            treatmentPhases, setTreatmentPhases,
        }}>
            {children}
        </BusinessContext.Provider>
    );
};
