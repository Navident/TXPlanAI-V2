import { useState, useEffect } from 'react';
import { BusinessContext } from './BusinessContext';
import { getPatientsForUserFacility, getCustomCdtCodesForFacility } from '../../ClientServices/apiService';
import { getCdtCodes, getPayersForFacility, getFacilityPayerCdtCodesFeesByPayer, getCategories, getSubCategoriesByCategoryName, getTreatmentPlansBySubcategory } from '../../ClientServices/apiService';

export const BusinessProvider = ({ children }) => {
    // State hooks for business information
    const [businessName, setBusinessName] = useState('');
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    // State hooks for patients and filtering
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // State hooks for CDT codes and payers
    const [defaultCdtCodes, setDefaultCdtCodes] = useState([]);
    const [facilityCdtCodes, setFacilityCdtCodes] = useState([]);
    const [payers, setPayers] = useState([]);
    const [facilityPayerCdtCodeFees, setFacilityPayerCdtCodeFees] = useState([]);
    const [activeCdtCodes, setActiveCdtCodes] = useState([]);

    //state hooks for categories and loading
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Effect hook for initializing business name from localStorage
    useEffect(() => {
        const storedBusinessName = localStorage.getItem('businessName');
        if (storedBusinessName) setBusinessName(storedBusinessName);
    }, []);

    // Effect hook for checking user login status
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsUserLoggedIn(isLoggedIn);
    }, []);

    // Effect hook for fetching initial data when user is logged in
    useEffect(() => {
        if (isUserLoggedIn) {
            fetchInitialData();
        }
    }, [isUserLoggedIn]);

    // Effect hook for filtering patients based on search query
    useEffect(() => {
        setFilteredPatients(searchQuery ? patients.filter(patient => patient.name.toLowerCase().includes(searchQuery.toLowerCase())) : patients);
    }, [searchQuery, patients]);

    // Fetching initial data required by the application
    const fetchInitialData = async () => {
        fetchDefaultCdtCodes();
        fetchCustomCdtCodesForFacility();
        fetchPatientsForFacility();
        fetchPayers();
        fetchCategoriesAndDetails();
    };


    // Defined fetch functions
    const fetchDefaultCdtCodes = async () => {
        const codes = await getCdtCodes();
        setDefaultCdtCodes(codes);
    };

    const fetchCustomCdtCodesForFacility = async () => {
        try {
            const fetchedCdtCodes = await getCustomCdtCodesForFacility();
            console.log('Fetched Custom CDT Codes:', fetchedCdtCodes);
            setFacilityCdtCodes(fetchedCdtCodes || []);
        } catch (error) {
            console.error('Error fetching CDT codes:', error);
        }
    };

    const fetchPayers = async () => {
        try {
            const fetchedPayers = await getPayersForFacility();
            console.log('Fetched payers in businessprovider:', fetchedPayers);
            setPayers(fetchedPayers || []);
        } catch (error) {
            console.error('Error fetching CDT codes:', error);
        }
    };

    const fetchFacilityPayerCdtCodeFees = async (payerId) => {
        try {
            const fetchedFacilityPayerCdtCodeFees = await getFacilityPayerCdtCodesFeesByPayer(payerId);
            console.log('Fetched payer specific cdt code fees in businessprovider:', fetchedFacilityPayerCdtCodeFees);
            setFacilityPayerCdtCodeFees(fetchedFacilityPayerCdtCodeFees || []);
        } catch (error) {
            console.error('Error fetching payer specific fees:', error);
        }
    };


    const fetchPatientsForFacility = async () => {
        try {
            const fetchedPatients = await getPatientsForUserFacility();
            setPatients(fetchedPatients || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const fetchCategoriesAndDetails = async () => {
        setIsLoading(true);

        try {
            const fetchedCategories = await getCategories();

            const categoriesWithSubcategories = await Promise.all(
                fetchedCategories.map(async (category) => {
                    const subCategories = await getSubCategoriesByCategoryName(category.name);
                    const subCategoriesWithTreatmentPlans = await Promise.all(
                        subCategories.map(async (subCategory) => {
                            const treatmentPlans = await getTreatmentPlansBySubcategory(subCategory.name);
                            return {
                                ...subCategory,
                                treatmentPlans,
                                treatmentPlansStatus: treatmentPlans ? 'fetched' : 'not_fetched'
                            };
                        })
                    );
                    return {
                        ...category,
                        subCategories: subCategoriesWithTreatmentPlans,
                        subCategoriesStatus: 'fetched'
                    };
                })
            );

            setCategories(categoriesWithSubcategories);
            console.log("categoriesWithSubcategories", categoriesWithSubcategories);
            const extractedCdtCodeIds = extractUniqueCdtCodeIds(categoriesWithSubcategories);
            setActiveCdtCodes(extractedCdtCodeIds); 
            console.log("extractedCdtCodeIds: ", extractedCdtCodeIds);
        } catch (error) {
            console.error('Error fetching category data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const extractUniqueCdtCodeIds = (categoriesData) => {
        const uniqueCdtCodeIds = new Set();

        categoriesData.forEach(category => {
            category.subCategories.forEach(subCategory => {
                subCategory.treatmentPlans.forEach(treatmentPlan => {
                    treatmentPlan.visits.forEach(visit => {
                        visit.cdtCodes.forEach(cdtCode => {
                            uniqueCdtCodeIds.add(cdtCode.cdtCodeId);
                        });
                    });
                });
            });
        });

        return Array.from(uniqueCdtCodeIds);
    };


    // Refreshing patients data
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
            facilityCdtCodes, setFacilityCdtCodes, 
            defaultCdtCodes, setDefaultCdtCodes,
            isUserLoggedIn, setIsUserLoggedIn,
            payers, setPayers,
            facilityPayerCdtCodeFees, setFacilityPayerCdtCodeFees,
            categories,
            isLoading,
            fetchFacilityPayerCdtCodeFees,
            activeCdtCodes, setActiveCdtCodes
            
        }}>
            {children}
        </BusinessContext.Provider>
    );
};
