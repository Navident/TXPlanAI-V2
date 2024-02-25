import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCdtCodes, getCustomCdtCodesForFacility, getPayersForFacility, getFacilityPayerCdtCodesFeesByPayer } from '../../ClientServices/apiService';


const initialState = {
    defaultCdtCodes: [],
    facilityCdtCodes: [],
    payers: [],
    facilityPayerCdtCodeFees: [],
    activeCdtCodes: [],
    selectedPayer: null, 
    isLoading: false,
    error: null,
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
        const response = await getPayersForFacility();
        return response;
    }
);

export const fetchFacilityPayerCdtCodeFeesByPayer = createAsyncThunk(
    'cdtCodeAndPayers/fetchFacilityPayerCdtCodeFeesByPayer',
    async (payerId) => {
        const response = await getFacilityPayerCdtCodesFeesByPayer(payerId);
        return response;
    }
);

// Slice definition
export const cdtCodeAndPayersSlice = createSlice({
    name: 'cdtCodeAndPayers',
    initialState,
    reducers: {
        resetState: () => initialState,
        setSelectedPayer: (state, action) => {
            state.selectedPayer = action.payload;
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
            .addCase(fetchPayersForFacility.fulfilled, (state, action) => {
                state.payers = action.payload;
            })
            .addCase(fetchFacilityPayerCdtCodeFeesByPayer.fulfilled, (state, action) => {
                state.facilityPayerCdtCodeFees = action.payload;
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

export const { resetState } = cdtCodeAndPayersSlice.actions;

export default cdtCodeAndPayersSlice.reducer;
