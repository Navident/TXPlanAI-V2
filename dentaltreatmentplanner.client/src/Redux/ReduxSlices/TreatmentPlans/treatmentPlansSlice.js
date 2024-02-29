import { createSlice, current } from '@reduxjs/toolkit';

// Helper functions to manipulate treatment plans
const addVisitToTreatmentPlan = (treatmentPlans, treatmentPlanId, newVisit) => {
    return treatmentPlans.map(plan => {
        if (plan.treatmentPlanId === treatmentPlanId) {
            return { ...plan, visits: [...plan.visits, newVisit] };
        }
        return plan;
    });
};

const deleteVisitInTreatmentPlan = (treatmentPlans, treatmentPlanId, deletedVisitId) => {
    console.log(`Starting deletion of visit with ID ${deletedVisitId} from treatment plan ${treatmentPlanId}.`);
    return treatmentPlans.map(plan => {
        if (plan.treatmentPlanId === treatmentPlanId) {
            const updatedVisits = plan.visits.filter(visit => visit.visitId !== deletedVisitId);
            console.log(`Deleted visit ${deletedVisitId}. Updated visits:`, updatedVisits);
            return { ...plan, visits: updatedVisits };
        }
        return plan;
    });
};

const addCdtCodeToVisitInTreatmentPlan = (treatmentPlans, treatmentPlanId, visitId, newCdtCode) => {
    return treatmentPlans.map(plan => {
        if (plan.treatmentPlanId === treatmentPlanId) {
            return {
                ...plan,
                visits: plan.visits.map(visit => {
                    if (visit.visitId === visitId) {
                        return {
                            ...visit,
                            cdtCodes: [...visit.cdtCodes, newCdtCode],
                        };
                    }
                    return visit;
                }),
            };
        }
        return plan;
    });
};

const updateVisitsInTreatmentPlan = (treatmentPlans, treatmentPlanId, updatedVisits) => {
    return treatmentPlans.map(plan => {
        if (plan.treatmentPlanId === treatmentPlanId) {
            return { ...plan, visits: updatedVisits };
        }
        return plan;
    });
};

export const treatmentPlansSlice = createSlice({
    name: 'treatmentPlans',
    initialState: {
        allSubcategoryTreatmentPlans: [],
        patientTreatmentPlans: [],
        treatmentPlans: [],
        treatmentPlanId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        // Action to set all subcategory treatment plans
        setAllSubcategoryTreatmentPlans: (state, action) => {
            state.allSubcategoryTreatmentPlans = action.payload;
        },
        // Action to set patient treatment plans
        setPatientTreatmentPlans: (state, action) => {
            state.patientTreatmentPlans = action.payload;
        },
        // Action to add a new treatment plan
        addTreatmentPlan: (state, action) => {
            state.patientTreatmentPlans.push(action.payload);
        },
        // Action to remove a treatment plan by ID
        removeTreatmentPlanById: (state, action) => {
            state.patientTreatmentPlans = state.patientTreatmentPlans.filter(plan => plan.treatmentPlanId !== action.payload);
        },
        // Action to set loading state
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setTreatmentPlans: (state, action) => {
            state.treatmentPlans = action.payload;
        },
        setTreatmentPlanId: (state, action) => {
            state.treatmentPlanId = action.payload;
        },
        handleAddVisit: (state, action) => {
            const { treatmentPlanId, newVisit } = action.payload;
            state.treatmentPlans = addVisitToTreatmentPlan(current(state.treatmentPlans), treatmentPlanId, newVisit);
        },
        onDeleteVisit: (state, action) => {
            const { treatmentPlanId, deletedVisitId } = action.payload;
            state.treatmentPlans = deleteVisitInTreatmentPlan(current(state.treatmentPlans), treatmentPlanId, deletedVisitId);
        },
        onUpdateVisitsInTreatmentPlan: (state, action) => {
            const { treatmentPlanId, updatedVisits } = action.payload;
            state.treatmentPlans = updateVisitsInTreatmentPlan(current(state.treatmentPlans), treatmentPlanId, updatedVisits);
        },
        handleAddCdtCode: (state, action) => {
            const { treatmentPlanId, visitId, newCdtCode } = action.payload;
            state.treatmentPlans = addCdtCodeToVisitInTreatmentPlan(current(state.treatmentPlans), treatmentPlanId, visitId, newCdtCode);
        },
    },
});

export const {
    setAllSubcategoryTreatmentPlans,
    setTreatmentPlans,
    setTreatmentPlanId,
    handleAddVisit,
    onDeleteVisit,
    onUpdateVisitsInTreatmentPlan,
    handleAddCdtCode
} = treatmentPlansSlice.actions;

export default treatmentPlansSlice.reducer;
