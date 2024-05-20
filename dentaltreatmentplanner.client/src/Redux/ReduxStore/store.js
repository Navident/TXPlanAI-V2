import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import patientsReducer from '../ReduxSlices/Patients/patientsSlice';
import treatmentPlansReducer from '../ReduxSlices/TreatmentPlans/treatmentPlansSlice'; 
import alertReducer from '../ReduxSlices/Alerts/alertSlice';
import cdtCodeReducer from '../ReduxSlices/CdtCodes/cdtCodesSlice';
import tableViewControlReducer from '../ReduxSlices/TableViewControls/tableViewControlSlice';
import categoriesSubcategoriesReducer from '../ReduxSlices/CategoriesSubcategories/categoriesSubcategoriesSlice';
import userReducer from '../ReduxSlices/User/userSlice';
import { userApiSlice } from '../ReduxSlices/User/userApiSlice';
import { patientsApiSlice } from '../ReduxSlices/Patients/patientsApiSlice'; 
import { treatmentPlansApiSlice } from '../ReduxSlices/TreatmentPlans/treatmentPlansApiSlice'; 
import { categoriesSubcategoriesApiSlice } from '../ReduxSlices/CategoriesSubcategories/categoriesSubcategoriesApiSlice';
import { cdtCodesApiSlice } from '../ReduxSlices/CdtCodes/cdtCodesApiSlice';
import { openDentalApiSlice } from '../ReduxSlices/OpenDental/openDentalApiSlice';
import audioRecorderReducer from '../ReduxSlices/AudioRecorder/AudioRecorderSlice';
import compExamTabsReducer from '../ReduxSlices/CompExamTabs/compExamTabsSlice';


// Combine all reducers 
const rootReducer = combineReducers({
    categoriesSubcategories: categoriesSubcategoriesReducer,
    patients: patientsReducer, 
    treatmentPlans: treatmentPlansReducer,
    cdtCodes: cdtCodeReducer,
    alert: alertReducer,
    tableViewControl: tableViewControlReducer,
    user: userReducer,
    audioRecorder: audioRecorderReducer,
    compExamTabs: compExamTabsReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [patientsApiSlice.reducerPath]: patientsApiSlice.reducer,
    [treatmentPlansApiSlice.reducerPath]: treatmentPlansApiSlice.reducer,
    [categoriesSubcategoriesApiSlice.reducerPath]: categoriesSubcategoriesApiSlice.reducer,
    [cdtCodesApiSlice.reducerPath]: cdtCodesApiSlice.reducer,
    [openDentalApiSlice.reducerPath]: openDentalApiSlice.reducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['categoriesSubcategories', 'patients', 'cdtCodes', 'user', 'treatmentPlans'] // Specific reducers to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer, 
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
            },
        }).concat(userApiSlice.middleware).concat(patientsApiSlice.middleware).concat(treatmentPlansApiSlice.middleware).concat(categoriesSubcategoriesApiSlice.middleware).concat(cdtCodesApiSlice.middleware).concat(openDentalApiSlice.middleware),
});


export const persistor = persistStore(store);