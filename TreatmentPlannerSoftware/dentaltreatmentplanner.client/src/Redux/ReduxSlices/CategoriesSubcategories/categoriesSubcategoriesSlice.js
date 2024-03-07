import { createSlice } from '@reduxjs/toolkit';

export const categoriesSubcategoriesSlice = createSlice({
    name: 'categoriesSubcategories',
    initialState: { categories: [] },
    reducers: {
        setCategoriesAndSubcategories: (state, action) => {
            state.categories = action.payload;
        },
        
    },
});

export const { setCategoriesAndSubcategories } = categoriesSubcategoriesSlice.actions;

export const selectCategoriesAndSubcategories = (state) => state.categoriesSubcategories.categories;

export default categoriesSubcategoriesSlice.reducer;