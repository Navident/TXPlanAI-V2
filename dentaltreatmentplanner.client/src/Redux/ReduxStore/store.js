import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import patientsReducer from '../ReduxSlices/Patients/patientsSlice';
import treatmentPlansReducer from '../ReduxSlices/TreatmentPlans/treatmentPlansSlice'; 
import alertReducer from '../ReduxSlices/Alerts/alertSlice';
import cdtCodeAndPayersReducer from '../ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice';
import tableViewControlReducer from '../ReduxSlices/TableViewControls/tableViewControlSlice';
import categoriesSubcategoriesReducer from '../ReduxSlices/CategoriesSubcategories/categoriesSubcategoriesSlice';
import userReducer from '../ReduxSlices/User/userSlice';


const rootReducer = combineReducers({
    categoriesSubcategories: categoriesSubcategoriesReducer,
    patients: patientsReducer,
    treatmentPlans: treatmentPlansReducer,
    cdtCodeAndPayers: cdtCodeAndPayersReducer,
    alert: alertReducer,
    tableViewControl: tableViewControlReducer,
    user: userReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['categoriesSubcategories', 'patients', 'treatmentPlans', 'cdtCodeAndPayers',  'user'  ] //this is the reducers that persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer, 
});

export const persistor = persistStore(store);