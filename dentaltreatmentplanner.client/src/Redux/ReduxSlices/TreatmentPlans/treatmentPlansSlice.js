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

const deleteTemporaryVisit = (treatmentPlans, deletedVisitId) => {
    console.log(`Before deletion, treatmentPlans:`, treatmentPlans);
    console.log(`Starting deletion of temporary visit with ID ${deletedVisitId}.`);
    return treatmentPlans.map(plan => {
        // Filter out the temporary visit from each treatment plan
        const updatedVisits = plan.visits.filter(visit => visit.visitId !== deletedVisitId);
        console.log(`Deleted temporary visit ${deletedVisitId}. Updated visits:`, updatedVisits);
        return { ...plan, visits: updatedVisits };
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
    const updatedTreatmentPlans = treatmentPlans.map(plan => {
        if (plan.treatmentPlanId === treatmentPlanId) {
            return { ...plan, visits: updatedVisits };
        }
        return plan;
    });



    return updatedTreatmentPlans;
};

const updateVisitDescriptionInTreatmentPlan = (treatmentPlans, visitId, newDescription) => {
    if (treatmentPlans.length === 0) {
        console.error("Treatment plan array is empty.");
        return treatmentPlans;
    }

    const treatmentPlan = treatmentPlans[0]; 

    const updatedVisits = treatmentPlan.visits.map(visit => {
        if (visit.visitId === visitId) {
            return { ...visit, description: newDescription };
        }
        return visit;
    });

    return [{ ...treatmentPlan, visits: updatedVisits }];
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
        visitOrder: [],
    },
    reducers: {
        // Action to set all subcategory treatment plans
        setAllSubcategoryTreatmentPlans: (state, action) => {
            state.allSubcategoryTreatmentPlans = action.payload;
        },
        updateSubcategoryTreatmentPlan: (state, action) => {
            const updatedPlan = action.payload;
            // Loop through all subcategory treatment plans to find and update the specific plan
            state.allSubcategoryTreatmentPlans = state.allSubcategoryTreatmentPlans.map(plan => {
                if (plan.treatmentPlanId === updatedPlan.treatmentPlanId) {
                    return updatedPlan; // Replace with the updated plan
                }
                return plan;
            });
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
            console.log(`Updating visits for treatmentPlanId: ${treatmentPlanId} with visits:`, updatedVisits);

            state.treatmentPlans = updateVisitsInTreatmentPlan(current(state.treatmentPlans), treatmentPlanId, updatedVisits);
            console.log(`Updated treatmentPlans state:`, state.treatmentPlans);

        },
        onUpdateVisitDescription: (state, action) => {
            const { visitId, newDescription } = action.payload;
            state.treatmentPlans = updateVisitDescriptionInTreatmentPlan(current(state.treatmentPlans), visitId, newDescription); 
            console.log(`Updated visit description for visitId: ${visitId} to: ${newDescription}`);
        },


        handleAddCdtCode: (state, action) => {
            const { treatmentPlanId, visitId, newCdtCode } = action.payload;
            state.treatmentPlans = addCdtCodeToVisitInTreatmentPlan(current(state.treatmentPlans), treatmentPlanId, visitId, newCdtCode);
        },
        onDeleteTemporaryVisit: (state, action) => {
            const { deletedVisitId } = action.payload;
            state.treatmentPlans = deleteTemporaryVisit(current(state.treatmentPlans), deletedVisitId);
        },
        setVisitOrder: (state, action) => {
            state.visitOrder = action.payload;
        },
    },
});

export const {
    setAllSubcategoryTreatmentPlans, updateSubcategoryTreatmentPlan,
    setTreatmentPlans,
    setTreatmentPlanId,
    handleAddVisit,
    onDeleteVisit,
    onUpdateVisitsInTreatmentPlan,
    handleAddCdtCode,
    onDeleteTemporaryVisit,
    addTreatmentPlan, setPatientTreatmentPlans, removeTreatmentPlanById,
    setVisitOrder,
    onUpdateVisitDescription,
    
} = treatmentPlansSlice.actions;

// Selector to get all treatment plans
export const selectAllTreatmentPlans = (state) => state.treatmentPlans.treatmentPlans;

// Selector to get a specific treatment plan by ID
export const selectTreatmentPlanById = (state, treatmentPlanId) =>
    state.treatmentPlans.treatmentPlans.find(plan => plan.treatmentPlanId === treatmentPlanId);

// Selector to get the loading state
export const selectLoadingState = (state) => state.treatmentPlans.isLoading;

// Selector to get patient treatment plans
export const selectPatientTreatmentPlans = (state) => state.treatmentPlans.patientTreatmentPlans;

// Selector to get all subcategory treatment plans
export const selectAllSubcategoryTreatmentPlans = (state) => state.treatmentPlans.allSubcategoryTreatmentPlans;

// Selector to get visit order
export const selectVisitOrder = (state) => state.treatmentPlans.visitOrder;


export default treatmentPlansSlice.reducer;
