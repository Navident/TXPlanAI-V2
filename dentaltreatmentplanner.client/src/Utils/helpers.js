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
