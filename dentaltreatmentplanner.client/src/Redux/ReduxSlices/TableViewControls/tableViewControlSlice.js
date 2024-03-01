import { createSlice } from '@reduxjs/toolkit';

export const tableViewControlSlice = createSlice({
    name: 'tableViewControl',
    initialState: {
        sortBy: 'default',
        activeTxCategories: [],
        selectedCategories: new Set(),
        initialRenderComplete: false,
        checkedRows: new Set(),
        isGroupActive: false,
    },
    reducers: {
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        setActiveTxCategories: (state, action) => {
            state.activeTxCategories = action.payload;

        },
        toggleSelectAll: (state, action) => {
            if (action.payload) {
                // Select all
                state.selectedCategories = new Set(state.activeTxCategories);
            } else {
                // Clear selection
                state.selectedCategories.clear();
            }
        },
        updateSelectedCategories: (state, action) => {
            const category = action.payload;
            if (state.selectedCategories.has(category)) {
                state.selectedCategories.delete(category);
            } else {
                state.selectedCategories.add(category);
            }
        },
        toggleRowChecked: (state, action) => {
            const rowId = action.payload;
            if (state.checkedRows.has(rowId)) {
                state.checkedRows.delete(rowId);
            } else {
                state.checkedRows.add(rowId);
            }
        },
        clearCheckedRows: (state) => {
            state.checkedRows.clear();
        },
        setInitialRenderComplete: (state, action) => {
            state.initialRenderComplete = action.payload;
        },
        toggleGroupActive: (state) => {
            state.isGroupActive = !state.isGroupActive;
        },
        addCategory: (state, action) => {
            const newCategory = action.payload;
            // Check if the category already exists in activeTxCategories
            if (!state.activeTxCategories.includes(newCategory)) {
                state.activeTxCategories.push(newCategory);
            }
            // Automatically select the new category
            state.selectedCategories.add(newCategory);
        },
        updateCheckedRows: (state, action) => {
            state.checkedRows = new Set(action.payload);
        },
    },
});

//actions
export const {
    setSortBy,
    setActiveTxCategories,
    toggleSelectAll,
    updateSelectedCategories,
    toggleRowChecked, clearCheckedRows,
    setInitialRenderComplete,
    toggleGroupActive,
    addCategory,
    updateCheckedRows,
} = tableViewControlSlice.actions;

//selectors
export const selectSortBy = (state) => state.tableViewControl.sortBy;
export const selectActiveTxCategories = (state) => state.tableViewControl.activeTxCategories;
export const selectSelectedCategories = (state) => state.tableViewControl.selectedCategories;
export const selectInitialRenderComplete = (state) => state.tableViewControl.initialRenderComplete;
export const selectCheckedRows = (state) => Array.from(state.tableViewControl.checkedRows);
export const selectIsGroupActive = (state) => state.tableViewControl.isGroupActive;

export default tableViewControlSlice.reducer;
