import { useState, useCallback,  useEffect } from 'react';
import { BusinessContext } from './BusinessContext';
import { getPatientsForUserFacility, getCustomCdtCodesForFacility } from '../../ClientServices/apiService';
import { getCdtCodes, getPayersForFacility, getFacilityPayerCdtCodesFeesByPayer, getAllPatientTreatmentPlansForFacility, getCategories, getSubCategoriesByCategoryName, getTreatmentPlansBySubcategory } from '../../ClientServices/apiService';

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
    //const [activeCdtCodes, setActiveCdtCodes] = useState([]);

    //state hooks for categories and loading
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    //state hooks for treatment plans
    const [patientTreatmentPlans, setPatientTreatmentPlans] = useState([]);
    //const [subcategoryTreatmentPlans, setSubcategoryTreatmentPlans] = useState([]);

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
        //fetchCategoriesSubcategoriesAndTxPlans();
        fetchAllPatientTreatmentPlansForFacility();
    };

    //method to reset state to fresh
    const resetAppStates = () => {
        setBusinessName('');
        setIsUserLoggedIn(false);
        setPatients([]);
        setSearchQuery('');
        setFilteredPatients([]);
        setSelectedPatient(null);
        setDefaultCdtCodes([]);
        setFacilityCdtCodes([]);
        setPayers([]);
        setFacilityPayerCdtCodeFees([]);
        //setActiveCdtCodes([]);
        setCategories([]);
        setIsLoading(false);
        setPatientTreatmentPlans([]);

        // Clear user-specific localStorage items
        localStorage.removeItem('businessName');
        localStorage.setItem('isLoggedIn', 'false');
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

    const fetchAllPatientTreatmentPlansForFacility = async () => {
        try {
            const fetchedPatientTreatmentPlans = await getAllPatientTreatmentPlansForFacility();
            console.log('Fetched patient treatment plans in businessprovider:', fetchedPatientTreatmentPlans);
            setPatientTreatmentPlans(fetchedPatientTreatmentPlans || []);
        } catch (error) {
            console.error('Error fetching patient treatment plans:', error);
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

    const fetchFacilityPayerCdtCodeFees = useCallback(async (payerId) => {
        try {
            const fetchedFacilityPayerCdtCodeFees = await getFacilityPayerCdtCodesFeesByPayer(payerId);
            console.log('Fetched payer specific cdt code fees in businessprovider:', fetchedFacilityPayerCdtCodeFees);
            setFacilityPayerCdtCodeFees(fetchedFacilityPayerCdtCodeFees || []);
        } catch (error) {
            console.error('Error fetching payer specific fees:', error);
        }
    }, []); 


    //this function will get the payer fees for a selected treatment plan
    const fetchFeesForTreatmentPlan = async (treatmentPlanId) => {
        // Find the treatment plan that matches the treatmentPlanId
        const matchingTreatmentPlan = patientTreatmentPlans.find(plan => plan.treatmentPlanId === Number(treatmentPlanId));

        if (!matchingTreatmentPlan) {
            console.error('No matching treatment plan found for the given ID:', treatmentPlanId);
            return;
        }

        const payerId = matchingTreatmentPlan.payerId;
        if (!payerId) {
            console.error('No PayerId found for the treatment plan ID:', treatmentPlanId);
            return;
        }

        // Use the found payerId to fetch facility payer CDT code fees
        await fetchFacilityPayerCdtCodeFees(payerId);
    };



    const fetchPatientsForFacility = async () => {
        try {
            const fetchedPatients = await getPatientsForUserFacility();
            setPatients(fetchedPatients || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

/*    const fetchCategoriesSubcategoriesAndTxPlans = async () => {
        setIsLoading(true);

        try {
            const fetchedCategories = await getCategories();

            let allTreatmentPlans = []; // Initialize an array to hold all treatment plans

            const categoriesWithSubcategories = await Promise.all(
                fetchedCategories.map(async (category) => {
                    const subCategories = await getSubCategoriesByCategoryName(category.name);
                    const subCategoriesWithTreatmentPlans = await Promise.all(
                        subCategories.map(async (subCategory) => {
                            const treatmentPlans = await getTreatmentPlansBySubcategory(subCategory.name);
                            // Here, include the subcategory name in each treatment plan
                            const treatmentPlansWithSubCategoryName = (treatmentPlans || []).map(plan => ({
                                ...plan,
                                subCategoryName: subCategory.name,
                            }));
                            allTreatmentPlans = allTreatmentPlans.concat(treatmentPlansWithSubCategoryName);
                            return {
                                ...subCategory,
                                treatmentPlans: treatmentPlansWithSubCategoryName,
                                treatmentPlansStatus: (treatmentPlans || []).length ? 'fetched' : 'not_fetched'
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

            // Update the global state with all treatment plans
            setSubcategoryTreatmentPlans(allTreatmentPlans);
        } catch (error) {
            console.error('Error fetching category data:', error);
        } finally {
            setIsLoading(false);
        }
    };*/

/*    const extractUniqueCdtCodeIds = (categoriesData) => {
        const uniqueCdtCodeIds = new Set();

        categoriesData.forEach(category => {
            category.subCategories?.forEach(subCategory => {
                subCategory.treatmentPlans?.forEach(treatmentPlan => {
                    treatmentPlan.visits?.forEach(visit => {
                        visit.cdtCodes?.forEach(cdtCode => {
                            uniqueCdtCodeIds.add(cdtCode.cdtCodeId);
                        });
                    });
                });
            });
        });

        return Array.from(uniqueCdtCodeIds);
    };*/



    // Refresh functions
    const refreshPatients = async () => {
        try {
            const fetchedPatients = await getPatientsForUserFacility();
            setPatients(fetchedPatients || []);
        } catch (error) {
            console.error('Error refreshing patients:', error);
        }
    };
    const refreshPatientTreatmentPlans = async () => {
        await fetchAllPatientTreatmentPlansForFacility();
    };

    const removeTreatmentPlanById = (planId) => {
        setPatientTreatmentPlans(currentPlans => currentPlans.filter(plan => plan.treatmentPlanId !== planId));
    };

    return (
        <BusinessContext.Provider value={{
            businessName, setBusinessName,
            patients, setPatients,
            searchQuery, setSearchQuery,
            filteredPatients, setFilteredPatients,
            selectedPatient, setSelectedPatient,
            refreshPatients,
            removeTreatmentPlanById,
            facilityCdtCodes, setFacilityCdtCodes, 
            defaultCdtCodes, setDefaultCdtCodes,
            isUserLoggedIn, setIsUserLoggedIn,
            payers, setPayers,
            facilityPayerCdtCodeFees, setFacilityPayerCdtCodeFees,
            categories,
            isLoading,
            fetchFacilityPayerCdtCodeFees,
            //activeCdtCodes, setActiveCdtCodes,
            resetAppStates,
            patientTreatmentPlans, setPatientTreatmentPlans,
            fetchFeesForTreatmentPlan,
            refreshPatientTreatmentPlans,
            fetchPayers,
            //subcategoryTreatmentPlans, setSubcategoryTreatmentPlans
            
        }}>
            {children}
        </BusinessContext.Provider>
    );
};
