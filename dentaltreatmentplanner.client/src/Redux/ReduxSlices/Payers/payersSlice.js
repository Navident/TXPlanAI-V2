import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPayersForFacility, getFacilityPayerCdtCodesFeesByPayer, getFacilityPayersWithCdtCodesFees } from '../../../ClientServices/apiService';

const payersInitialState = {
    payers: [],
    selectedPayer: null,
    facilityPayerCdtCodeFees: [],
    isLoading: false,
    error: null,
};

// Async Thunks for Payers
/*export const fetchPayersForFacility = createAsyncThunk(
    'payers/fetchPayersForFacility',
    async () => {
        const response = await getPayersForFacility();
        return response;
    }
);

export const fetchFacilityPayerCdtCodeFeesByPayer = createAsyncThunk(
    'payers/fetchFacilityPayerCdtCodeFeesByPayer',
    async (payerId) => {
        const response = await getFacilityPayerCdtCodesFeesByPayer(payerId);
        return response;
    }
);*/

// The Payers Slice
export const payersSlice = createSlice({
    name: 'payers',
    initialState: payersInitialState,
    reducers: {
        setSelectedPayer: (state, action) => {
            state.selectedPayer = action.payload;
        },
        resetState: () => payersInitialState,
    },
    extraReducers: (builder) => {
        builder
            //.addCase(fetchPayersWithCdtCodesFeesForFacility.fulfilled, (state, action) => {
            //    state.payers = action.payload.map(payer => ({
            //        payerId: payer.payerId,
            //        payerName: payer.payerName,
            //        cdtCodeFees: payer.cdtCodeFees
            //    }));
            //})
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

export const { resetState, setSelectedPayer } = payersSlice.actions;
export default payersSlice.reducer;
