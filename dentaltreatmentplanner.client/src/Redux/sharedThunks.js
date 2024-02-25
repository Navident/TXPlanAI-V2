import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories, getSubCategoriesByCategoryName, getTreatmentPlansBySubcategory } from '../../ClientServices/apiService';
import { setCategoriesAndSubcategories } from './categoriesSubcategoriesSlice';
import { setAllSubcategoryTreatmentPlans } from './treatmentPlansSlice';

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
                            const treatmentPlansWithSubCategoryName = treatmentPlans.map(plan => ({
                                ...plan,
                                subCategoryName: subCategory.name,
                            }));
                            allTreatmentPlans = allTreatmentPlans.concat(treatmentPlansWithSubCategoryName);
                            return {
                                ...subCategory,
                                treatmentPlans: treatmentPlansWithSubCategoryName,
                                treatmentPlansStatus: treatmentPlans.length ? 'fetched' : 'not_fetched',
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

            // Dispatch actions to slices with the fetched data
            dispatch(setCategoriesAndSubcategories(categoriesWithSubcategories));
            dispatch(setAllSubcategoryTreatmentPlans(allTreatmentPlans));

            return { categoriesWithSubcategories, allTreatmentPlans };
        } catch (error) {
            console.error('Error fetching category data:', error);
            throw error;
        }
    }
);
