// Function to sort the data into correct order
export const sortTreatmentPlan = (treatmentPlan) => {
    if (!treatmentPlan?.visits) {
        return { sortedVisits: [], sortedCdtCodes: {} };
    }

    const sortedVisits = [...treatmentPlan.visits].sort((a, b) => a.visitNumber - b.visitNumber);

    const sortedCdtCodes = sortedVisits.reduce((acc, visit) => {
        // Check if cdtCodes is defined and is an array, default to an empty array if not
        const cdtCodes = Array.isArray(visit.cdtCodes) ? visit.cdtCodes : [];
        acc[visit.visitId] = cdtCodes.sort((a, b) => a.order - b.order);
        return acc;
    }, {});

    return { sortedVisits, sortedCdtCodes };
};
