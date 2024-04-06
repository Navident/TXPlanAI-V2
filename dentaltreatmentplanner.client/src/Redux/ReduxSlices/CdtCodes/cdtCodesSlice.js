import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const cdtCodesInitialState = {
    defaultCdtCodes: [],
    facilityCdtCodes: [],
    activeCdtCodes: [],
    alternativeProcedures: [],
    isLoading: false,
    error: null,
};



// The CDT Codes Slice
export const cdtCodesSlice = createSlice({
    name: 'cdtCodes',
    initialState: cdtCodesInitialState,
    reducers: {
        // Reducers for managing CDT codes state
        setActiveCdtCodes: (state, action) => {
            state.activeCdtCodes = action.payload;
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
        setAlternativeProcedures: (state, action) => {
            state.alternativeProcedures = action.payload;
        },
        deleteAlternativeProcedure: (state, action) => {
            const { tempId, alternativeProcedureId } = action.payload;
            // This will prioritize deleting by alternativeProcedureId if it's provided
            const idValue = alternativeProcedureId || tempId;
            const identifier = alternativeProcedureId ? 'alternativeProcedureId' : 'tempId';

            state.alternativeProcedures = state.alternativeProcedures.filter(ap => ap[identifier] !== idValue);
        },
        updateAlternativeProcedureVisitCdtCodeMapIds: (state, action) => {
            const { newVisitCdtCodeMapIdMapping } = action.payload;
            // Assuming you're using JSON.stringify and JSON.parse for deep copy
            console.log("Before updating alternativeProcedures", JSON.parse(JSON.stringify(state.alternativeProcedures)));
            console.log("newVisitCdtCodeMapIdMapping received", newVisitCdtCodeMapIdMapping);
            state.alternativeProcedures.forEach(ap => {
                if (newVisitCdtCodeMapIdMapping.has(ap.visitCdtCodeMapId)) {
                    console.log(`Updating visitCdtCodeMapId from ${ap.visitCdtCodeMapId} to ${newVisitCdtCodeMapIdMapping.get(ap.visitCdtCodeMapId)} for alternativeProcedureId/tempId ${ap.alternativeProcedureId || ap.tempId}`);
                    ap.visitCdtCodeMapId = newVisitCdtCodeMapIdMapping.get(ap.visitCdtCodeMapId);
                }
            });
            console.log("After updating alternativeProcedures", JSON.parse(JSON.stringify(state.alternativeProcedures)));
        },
        resetState: () => cdtCodesInitialState,
    },
    extraReducers: (builder) => {
        builder

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


// Selector to get the alternative procedures for the facility
export const selectAlternativeProcedures = (state) => state.cdtCodeAndPayers.alternativeProcedures;

// Selector to get the default CDT codes
export const selectDefaultCdtCodes = (state) => state.cdtCodeAndPayers.defaultCdtCodes;

// Selector to get the facility-specific CDT codes
export const selectFacilityCdtCodes = (state) => state.cdtCodeAndPayers.facilityCdtCodes;

// Selector to get the active CDT codes
export const selectActiveCdtCodes = (state) => state.cdtCodeAndPayers.activeCdtCodes;
// Add this selector to your existing selectors
export const selectCombinedCdtCodes = (state) => {
    return [...state.cdtCodeAndPayers.defaultCdtCodes, ...state.cdtCodeAndPayers.facilityCdtCodes];
};

export const { resetState, setActiveCdtCodes, addAlternativeProcedure, updateAlternativeProcedure, deleteAlternativeProcedure, setAlternativeProcedures } = cdtCodesSlice.actions;
export default cdtCodesSlice.reducer;
