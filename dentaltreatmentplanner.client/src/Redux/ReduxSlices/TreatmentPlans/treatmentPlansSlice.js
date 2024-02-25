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
    return treatmentPlans.map(plan => {
        if (plan.treatmentPlanId === treatmentPlanId) {
            const updatedVisits = plan.visits.filter(visit => visit.visitId !== deletedVisitId);
            return { ...plan, visits: updatedVisits };
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
    },
});

export const {
    setAllSubcategoryTreatmentPlans,
    setTreatmentPlans,
    setTreatmentPlanId,
    handleAddVisit,
    onDeleteVisit,
    onUpdateVisitsInTreatmentPlan
} = treatmentPlansSlice.actions;

export default treatmentPlansSlice.reducer;
