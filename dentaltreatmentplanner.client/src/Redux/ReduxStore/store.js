import { configureStore } from '@reduxjs/toolkit';
import patientsReducer from '../ReduxSlices/Patients/patientsSlice';
import treatmentPlansReducer from '../ReduxSlices/TreatmentPlans/treatmentPlansSlice'; 
import alertReducer from '../ReduxSlices/Alerts/alertSlice';

export const store = configureStore({
    reducer: {
        patients: patientsReducer,
        treatmentPlans: treatmentPlansReducer, 
        alert: alertReducer,
    },
});