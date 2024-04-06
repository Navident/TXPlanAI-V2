/*import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories } from '../ClientServices/apiService';
import { setCategoriesAndSubcategories } from '../Redux/ReduxSlices/CategoriesSubcategories/categoriesSubcategoriesSlice';
import { setAllSubcategoryTreatmentPlans, setPatientTreatmentPlans } from './ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import { fetchPayersWithCdtCodesFeesForFacility, fetchFacilityPayerCdtCodeFeesByPayer, setActiveCdtCodes, fetchCustomCdtCodesForFacility, fetchDefaultCdtCodes } from './ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice';
*/
/*export const fetchAllPatientTreatmentPlansForFacility = createAsyncThunk(
    'shared/fetchAllPatientTreatmentPlansForFacility',
    async (_, { dispatch }) => {
        try {
            const fetchedPatientTreatmentPlans = await getAllPatientTreatmentPlansForFacility();
            console.log('Fetched patient treatment plans:', fetchedPatientTreatmentPlans);
            dispatch(setPatientTreatmentPlans(fetchedPatientTreatmentPlans));
            return fetchedPatientTreatmentPlans;
        } catch (error) {
            console.error('Error fetching patient treatment plans:', error);
            throw error;
        }
    }
);

export const fetchCategoriesSubcategoriesAndTxPlans = createAsyncThunk(
    'shared/fetchCategoriesSubcategoriesAndTxPlans',
    async (_, { dispatch }) => {
        try {
            const fetchedCategories = await getCategories();
            let allTreatmentPlans = [];

            const categoriesWithSubcategories = await Promise.all(
                fetchedCategories.map(async (category) => {
                    const subCategories = await getSubCategoriesByCategoryName(category.name);
                    const subCategoriesWithTreatmentPlans = await Promise.all(
                        subCategories.map(async (subCategory) => {
                            const treatmentPlans = await getTreatmentPlansBySubcategory(subCategory.name);
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
                        subCategoriesStatus: 'fetched',
                    };
                })
            );

            console.log("categoriesWithSubcategories", categoriesWithSubcategories);
            // Dispatch actions to slices with the fetched data
            dispatch(setCategoriesAndSubcategories(categoriesWithSubcategories));

            const extractedCdtCodeIds = extractUniqueCdtCodeIds(categoriesWithSubcategories);
            dispatch(setActiveCdtCodes(extractedCdtCodeIds));
            console.log("extractedCdtCodeIds: ", extractedCdtCodeIds);


            return { categoriesWithSubcategories, allTreatmentPlans };
        } catch (error) {
            console.error('Error fetching category data:', error);
            throw error;
        }
    }
);

const extractUniqueCdtCodeIds = (categoriesData) => {
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
};


export const fetchInitialDataIfLoggedIn = createAsyncThunk(
    'shared/fetchInitialDataIfLoggedIn',
    async (_, { dispatch, getState }) => {
        const isUserLoggedIn = getState().user.isUserLoggedIn;
        const isLoggedIn = isUserLoggedIn;

        if (isLoggedIn) { 
            console.log("Running fetchInitialDataIfLoggedIn now");
            await Promise.all([
                dispatch(fetchPayersWithCdtCodesFeesForFacility()),
                dispatch(fetchCustomCdtCodesForFacility()), 
                dispatch(fetchDefaultCdtCodes()), 
                //dispatch(fetchCategoriesSubcategoriesAndTxPlans()),
                //dispatch(fetchAllPatientTreatmentPlansForFacility()),
            ]);
        }
    }
);*/
