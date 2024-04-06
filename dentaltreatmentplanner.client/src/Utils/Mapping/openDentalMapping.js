export const mapToOpenDentalTreatmentPlanDto = ( treatmentPlans, patientId) => {
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
                Surf: item.surface || null,
                ProcStatus: "TP",
                procCode: item.code,
                priority: visit.visitNumber.toString()  // This should be dynamic, the priority should be the visit number that the procedure is in
            };

            openDentalTreatmentPlanDto.Procedures.push(procedureDto);
        }
    }

    return openDentalTreatmentPlanDto;
};


function addFluorideTreatmentToothRange(selectedCdtCode, procedureDto) {
    if (selectedCdtCode.originalVisitCategory.toLowerCase() === "fluoride".toLowerCase()) {
        procedureDto.ToothRange = "1-32"; // Add ToothRange for fluoride treatments
    }
}


export const mapToOpenDentalTreatmentPlanDtoByAllRows = (allRows, patientId) => {
    const openDentalTreatmentPlanDto = {
        PatNum: patientId,
        ProcDate: "2024-03-09", // make this dynamic
        Procedures: []
    };

    // iterate through allRows object and get both the procedures and their visit index
    Object.entries(allRows).forEach(([visitKey, procedures], visitIndex) => {
        procedures.forEach((procedure) => {
            // Skip rows without visitToProcedureMapId or if it's an initial row template
            if (!procedure.visitToProcedureMapId || procedure.id.startsWith('initial')) {
                return;
            }

            
            const selectedCdtCode = procedure.selectedCdtCode;
            if (selectedCdtCode && selectedCdtCode.code) {
                const procedureDto = {
                    ToothNum: procedure.toothNumber.replace('#', ''),
                    Surf: selectedCdtCode.surface ? selectedCdtCode.surface : (selectedCdtCode.arch ? selectedCdtCode.arch : null),
                    ProcStatus: "TP",
                    procCode: selectedCdtCode.code,
                    priority: (visitIndex + 1).toString() // Adding 1 because indices start at 0
                };

                addFluorideTreatmentToothRange(selectedCdtCode, procedureDto);

                openDentalTreatmentPlanDto.Procedures.push(procedureDto);
            }
        });
    });
    console.log("DTO before return:", openDentalTreatmentPlanDto);
    return openDentalTreatmentPlanDto;
};
