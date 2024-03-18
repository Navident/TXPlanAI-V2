export const mapToOpenDentalTreatmentPlanDto = (treatmentPlans, patientId) => {
    const currentPlan = treatmentPlans[0];
    const openDentalTreatmentPlanDto = {
        PatNum: patientId, // This needs to be dynamic, we have a way to get this already
        ProcDate: "2024-03-09", // This should be dynamic
        Procedures: []
    };

    // Iterate through visits and their CDT codes to populate Procedures
    for (let visit of currentPlan.visits) {
        for (let item of visit.cdtCodes) {
            const procedureDto = {
                ToothNum: item.toothNumber.replace('#', ''),
                Surf: item.surface,
                ProcStatus: "TP",
                procCode: item.code,
                priority: visit.visitNumber.toString()  // This should be dynamic, the priority should be the visit number that the procedure is in
            };

            openDentalTreatmentPlanDto.Procedures.push(procedureDto);
        }
    }

    return openDentalTreatmentPlanDto;
};
