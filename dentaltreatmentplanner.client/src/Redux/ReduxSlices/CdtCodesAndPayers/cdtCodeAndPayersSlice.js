import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCdtCodes, getCustomCdtCodesForFacility, getPayersForFacility, getAlternativeProceduresByFacility, getFacilityPayerCdtCodesFeesByPayer, getFacilityPayersWithCdtCodesFees } from '../../../ClientServices/apiService';

const initialState = {
    defaultCdtCodes: [],
    facilityCdtCodes: [],
    payers: [],
    facilityPayerCdtCodeFees: [],
    activeCdtCodes: [],
    selectedPayer: null, 
    alternativeProcedures: [],
    isLoading: false,
    error: null,
    grandUcrTotal: 0,
    grandCoPayTotal: 0,
    areGrandTotalsReady: false,
};


export const fetchCustomCdtCodesForFacility = createAsyncThunk(
    'cdtCodeAndPayers/fetchCustomCdtCodesForFacility',
    async () => {
        const response = await getCustomCdtCodesForFacility();
        return response;
    }
);



export const fetchDefaultCdtCodes = createAsyncThunk(
    'cdtCodeAndPayers/fetchDefaultCdtCodesForFacility',
    async () => {
        const response = await getCdtCodes();
        return response;
    }
);

export const fetchPayersForFacility = createAsyncThunk(
    'cdtCodeAndPayers/fetchPayersForFacility',
    async () => {
        console.log('Fetching payers for facility...');
        const response = await getPayersForFacility();
        console.log('Response received:', response);
        return response;
    }
);

export const fetchFacilityPayerCdtCodeFeesByPayer = createAsyncThunk(
    'cdtCodeAndPayers/fetchFacilityPayerCdtCodeFeesByPayer',
    async (payerId) => {
        console.log('getting facility payer cdt code fees with redux...');
        const response = await getFacilityPayerCdtCodesFeesByPayer(payerId);
        console.log('Facility payer cdt code fees redux received:', response);
        return response;
    }
);

export const fetchPayersWithCdtCodesFeesForFacility = createAsyncThunk(
    'cdtCodeAndPayers/fetchPayersWithCdtCodesFeesForFacility',
    async () => {
        console.log('Fetching payers with CDT code fees for facility...');
        const response = await getFacilityPayersWithCdtCodesFees();
        console.log('Response received for payers with fees:', response);
        return response;
    }
);

export const fetchAlternativeProceduresForFacility = createAsyncThunk(
    'cdtCodeAndPayers/fetchAlternativeProceduresForFacility',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAlternativeProceduresByFacility();
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const cdtCodeAndPayersSlice = createSlice({
    name: 'cdtCodeAndPayers',
    initialState,
    reducers: {
        resetState: () => initialState,
        setSelectedPayer: (state, action) => {
            state.selectedPayer = action.payload;
        },
        setActiveCdtCodes: (state, action) => {
            state.activeCdtCodes = action.payload;
        },
        setGrandUcrTotal: (state, action) => {
            state.grandUcrTotal = action.payload;
        },
        setGrandCoPayTotal: (state, action) => {
            state.grandCoPayTotal = action.payload;
        },
        setGrandTotalsReady: (state, action) => {
            state.areGrandTotalsReady = action.payload;
        },
        addAlternativeProcedure: (state, action) => {
            state.alternativeProcedures.push(action.payload);
        },
        updateAlternativeProcedure: (state, action) => {
            const { tempId, alternativeProcedureId, updates } = action.payload;
            const identifier = alternativeProcedureId ? 'alternativeProcedureId' : 'tempId';
            const idValue = alternativeProcedureId || tempId;

            const index = state.alternativeProcedures.findIndex(ap => ap[identifier] === idValue);
            if (index !== -1) {
                state.alternativeProcedures[index] = { ...state.alternativeProcedures[index], ...updates };
            }
        },
        deleteAlternativeProcedure: (state, action) => {
            const { tempId, alternativeProcedureId } = action.payload;
            // This will prioritize deleting by alternativeProcedureId if it's provided
            const idValue = alternativeProcedureId || tempId;
            const identifier = alternativeProcedureId ? 'alternativeProcedureId' : 'tempId';

            state.alternativeProcedures = state.alternativeProcedures.filter(ap => ap[identifier] !== idValue);
        },


    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDefaultCdtCodes.fulfilled, (state, action) => {
                state.defaultCdtCodes = action.payload;
            })
            .addCase(fetchCustomCdtCodesForFacility.fulfilled, (state, action) => {
                state.facilityCdtCodes = action.payload;
            })
            .addCase(fetchPayersWithCdtCodesFeesForFacility.fulfilled, (state, action) => {
                state.payers = action.payload.map(payer => ({
                    payerId: payer.payerId,
                    payerName: payer.payerName,
                    cdtCodeFees: payer.cdtCodeFees 
                }));
            })
            .addCase(fetchAlternativeProceduresForFacility.fulfilled, (state, action) => {
                state.alternativeProcedures = action.payload;
            })
            .addCase(fetchAlternativeProceduresForFacility.rejected, (state, action) => {
                console.error('Failed to fetch alternative procedures:', action.payload);
            })
            .addMatcher(
                action => action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                action => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                action => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error.message;
                }
            );
    },

});

export const { resetState, setGrandTotalsReady, setSelectedPayer, setActiveCdtCodes, setGrandUcrTotal, setGrandCoPayTotal, addAlternativeProcedure, updateAlternativeProcedure, deleteAlternativeProcedure } = cdtCodeAndPayersSlice.actions;

// Selector to get the default CDT codes
export const selectDefaultCdtCodes = (state) => state.cdtCodeAndPayers.defaultCdtCodes;

// Selector to get the facility-specific CDT codes
export const selectFacilityCdtCodes = (state) => state.cdtCodeAndPayers.facilityCdtCodes;

// Selector to get the payers for the facility
export const selectPayersForFacility = (state) => state.cdtCodeAndPayers.payers;

// Selector to get the CDT code fees for the selected payer
export const selectFacilityPayerCdtCodeFees = (state) => state.cdtCodeAndPayers.facilityPayerCdtCodeFees;

// Selector to get the active CDT codes
export const selectActiveCdtCodes = (state) => state.cdtCodeAndPayers.activeCdtCodes;

// Selector to get the selected payer
export const selectSelectedPayer = (state) => state.cdtCodeAndPayers.selectedPayer;

// Selector to get the loading state
export const selectIsLoading = (state) => state.cdtCodeAndPayers.isLoading;

// Selector to get any errors
export const selectError = (state) => state.cdtCodeAndPayers.error;

// Selector to get the grand UCR total
export const selectGrandUcrTotal = (state) => state.cdtCodeAndPayers.grandUcrTotal;

// Selector to get the grand Co-Pay total
export const selectGrandCoPayTotal = (state) => state.cdtCodeAndPayers.grandCoPayTotal;

// Selector to check if the grand totals are ready to be displayed
export const selectAreGrandTotalsReady = (state) => state.cdtCodeAndPayers.areGrandTotalsReady;

// Selector to get the alternative procedures for the facility
export const selectAlternativeProcedures = (state) => state.cdtCodeAndPayers.alternativeProcedures;

// Add this selector to your existing selectors
export const selectCombinedCdtCodes = (state) => {
    return [...state.cdtCodeAndPayers.defaultCdtCodes, ...state.cdtCodeAndPayers.facilityCdtCodes];
};


export default cdtCodeAndPayersSlice.reducer;
