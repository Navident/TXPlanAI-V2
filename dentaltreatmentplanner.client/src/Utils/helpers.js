export const sortTreatmentPlan = (treatmentPlan) => {
    if (!treatmentPlan?.visits) {
        console.log("No visits in the treatment plan");
        return { sortedVisits: [], sortedCdtCodes: {} };
    }

    // Sort visits first by originLineIndex, then by visitNumber
    const sortedVisits = [...treatmentPlan.visits].sort((a, b) => {
        // Compare originLineIndex first
        if (a.originLineIndex !== b.originLineIndex) {
            return a.originLineIndex - b.originLineIndex;
        }
        // If originLineIndex is the same, then sort by visitNumber
        return a.visitNumber - b.visitNumber;
    });
    console.log("Sorted Visits:", sortedVisits);

    const sortedCdtCodes = sortedVisits.reduce((acc, visit) => {
        // Make a copy of cdtCodes before sorting to avoid mutating the original array
        const cdtCodes = Array.isArray(visit.cdtCodes) ? [...visit.cdtCodes] : [];
        // Now sorting the copy, which won't throw an error
        acc[visit.visitId] = cdtCodes.sort((a, b) => a.order - b.order);
        return acc;
    }, {});


    console.log("Sorted CDT Codes:", sortedCdtCodes);

    return { sortedVisits, sortedCdtCodes };
};






export const addVisitToTreatmentPlan = (treatmentPlans, treatmentPlanId, newVisit) => {
    return treatmentPlans.map(plan => {
        if (plan.treatmentPlanId === treatmentPlanId) {
            return { ...plan, visits: [...plan.visits, newVisit] };
        }
        return plan;
    });
};

export const deleteVisitInTreatmentPlan = (treatmentPlans, treatmentPlanId, deletedVisitId) => {
    return treatmentPlans.map(plan => {
        if (plan.treatmentPlanId === treatmentPlanId) {
            const updatedVisits = plan.visits.filter(visit => visit.visitId !== deletedVisitId);
            return { ...plan, visits: updatedVisits };
        }
        return plan;
    });
};

export const updateVisitsInTreatmentPlan = (treatmentPlans, treatmentPlanId, updatedVisits) => {
    return treatmentPlans.map(plan =>
        plan.treatmentPlanId === treatmentPlanId
            ? { ...plan, visits: [...updatedVisits] }
            : plan
    );
};


export const extractPatientIdFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('patientID');
};