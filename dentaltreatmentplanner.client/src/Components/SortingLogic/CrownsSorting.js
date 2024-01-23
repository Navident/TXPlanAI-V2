export const sortCrowns = (allVisits) => {
    allVisits.sort((a, b) => {
        if (a.treatmentPhaseLabel !== b.treatmentPhaseLabel) {
            return a.treatmentPhaseLabel.localeCompare(b.treatmentPhaseLabel);
        }
        if (a.toothNumber !== b.toothNumber) {
            return a.toothNumber - b.toothNumber;
        }
        return a.procedureOrder - b.procedureOrder;
    });
    return allVisits;
};
