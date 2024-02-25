import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPatientsForUserFacility } from '../../../ClientServices/apiService';

// Define initial state
const initialState = {
    patients: [],
    searchQuery: '',
    filteredPatients: [],
    selectedPatient: null,
    isLoading: false,
    error: null,
};

// Async thunk for fetching patients
export const fetchPatientsForFacility = createAsyncThunk(
    'patients/fetchPatientsForFacility',
    async (_, { rejectWithValue }) => {
        try {
            const fetchedPatients = await getPatientsForUserFacility();
            return fetchedPatients;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

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
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatientsForFacility.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPatientsForFacility.fulfilled, (state, action) => {
                state.isLoading = false;
                state.patients = action.payload;
                state.filteredPatients = action.payload;
            })
            .addCase(fetchPatientsForFacility.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const { setSearchQuery, setSelectedPatient, resetPatientsState } = patientsSlice.actions;

// Export reducer
export default patientsSlice.reducer;
