export const sortTreatmentPlan = (treatmentPlan) => {
    if (!treatmentPlan?.visits) {
        console.log("No visits in the treatment plan");
        return { sortedVisits: [], sortedCdtCodes: {} };
    }

    const sortedVisits = [...treatmentPlan.visits].sort((a, b) => a.visitNumber - b.visitNumber);
    console.log("Sorted Visits:", sortedVisits);

    const sortedCdtCodes = sortedVisits.reduce((acc, visit) => {
        const cdtCodes = Array.isArray(visit.cdtCodes) ? visit.cdtCodes : [];
        acc[visit.visitId] = cdtCodes.sort((a, b) => a.order - b.order);
        return acc;
    }, {});

    console.log("Sorted CDT Codes:", sortedCdtCodes);

    return { sortedVisits, sortedCdtCodes };
};

export const sortTreatmentPlanWithPhases = (treatmentPlan) => {
    // Check if the treatment plan has phases
    if (!treatmentPlan?.phases) {
        console.log("No phases in the treatment plan");
        return { sortedVisits: [], sortedCdtCodes: {} };
    }

    let visits = [];
    // Extract visits from each phase
    Object.values(treatmentPlan.phases).forEach(phaseVisits => {
        visits = visits.concat(phaseVisits);
    });

    // Sort visits by uniqueId and then by visitNumber
    const sortedVisits = visits.sort((a, b) => {
        if (a.uniqueId !== b.uniqueId) {
            return a.uniqueId.localeCompare(b.uniqueId);
        }
        return a.visitNumber - b.visitNumber;
    });
    console.log("Sorted Visits:", sortedVisits);

    // Generate sorted CDT codes for each visit using uniqueId
    const sortedCdtCodes = sortedVisits.reduce((acc, visit) => {
        const cdtCodes = Array.isArray(visit.cdtCodes) ? visit.cdtCodes : [];
        acc[visit.uniqueId] = cdtCodes.sort((a, b) => a.order - b.order);
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