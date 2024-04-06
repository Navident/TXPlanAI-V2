import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Define initial state
const initialState = {
    patients: [],
    searchQuery: '',
    filteredPatients: [],
    selectedPatient: null,
    isLoading: false,
    error: null,
};



// Slice
const patientsSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
            state.filteredPatients = state.searchQuery
                ? state.patients.filter(patient =>
                    patient.name.toLowerCase().includes(state.searchQuery.toLowerCase())
                )
                : state.patients;
        },
        setSelectedPatient(state, action) {
            state.selectedPatient = action.payload;
        },
        resetPatientsState(state) {
            state.patients = [];
            state.searchQuery = '';
            state.filteredPatients = [];
            state.selectedPatient = null;
        },
    },

});

// Export actions
export const { setSearchQuery, setSelectedPatient, resetPatientsState } = patientsSlice.actions;

// Selector for filteredPatients
export const selectFilteredPatients = (state) => state.patients.filteredPatients;

// Selector for selectedPatient
export const selectSelectedPatient = (state) => state.patients.selectedPatient;

// Selector for searchQuery
export const selectSearchQuery = (state) => state.patients.searchQuery;

// Export reducer
export default patientsSlice.reducer;
