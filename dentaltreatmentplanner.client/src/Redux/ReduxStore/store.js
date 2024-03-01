import { configureStore } from '@reduxjs/toolkit';
import patientsReducer from '../ReduxSlices/Patients/patientsSlice';
import treatmentPlansReducer from '../ReduxSlices/TreatmentPlans/treatmentPlansSlice'; 
import alertReducer from '../ReduxSlices/Alerts/alertSlice';
import cdtCodeAndPayersReducer from '../ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice';
import tableViewControlReducer from '../ReduxSlices/TableViewControls/tableViewControlSlice';
import categoriesSubcategoriesReducer from '../ReduxSlices/CategoriesSubcategories/categoriesSubcategoriesSlice';

export const store = configureStore({
    reducer: {
        categoriesSubcategories: categoriesSubcategoriesReducer,
        patients: patientsReducer,
        treatmentPlans: treatmentPlansReducer, 
        cdtCodeAndPayers: cdtCodeAndPayersReducer,
        alert: alertReducer,
        tableViewControl: tableViewControlReducer,
    },
});