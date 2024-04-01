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

function adjustSurfaceForOpenDental(toothNumber, originalSurface) {
    // Handle cases where the originalSurface is undefined, null, or an empty string
    if (!originalSurface) {
        return null; // Explicitly return null for no surface
    }

    const toothNum = parseInt(toothNumber.replace('#', ''), 10);
    const isToothNumInRange = (toothNum >= 6 && toothNum <= 11) || (toothNum >= 22 && toothNum <= 27);

    let adjustedSurface = originalSurface;
    if (isToothNumInRange) {
        if (originalSurface === "B") adjustedSurface = "F";
        if (originalSurface === "O") adjustedSurface = "I";
    }

    return adjustedSurface;
}

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

    // Use Object.entries to iterate through allRows object and get both the procedures and their visit index
    Object.entries(allRows).forEach(([visitKey, procedures], visitIndex) => {
        procedures.forEach((procedure) => {
            // Skip rows without visitToProcedureMapId or if it's an initial row template
            if (!procedure.visitToProcedureMapId || procedure.id.startsWith('initial')) {
                return;
            }

            
            const selectedCdtCode = procedure.selectedCdtCode;
            if (selectedCdtCode && selectedCdtCode.code) {
                const adjustedSurface = adjustSurfaceForOpenDental(procedure.toothNumber, selectedCdtCode.surface);

                const procedureDto = {
                    ToothNum: procedure.toothNumber.replace('#', ''),
                    Surf: adjustedSurface,
                    ProcStatus: "TP",
                    procCode: selectedCdtCode.code,
                    priority: (visitIndex + 1).toString() // Adding 1 because indices start at 0
                };

                addFluorideTreatmentToothRange(selectedCdtCode, procedureDto);

                openDentalTreatmentPlanDto.Procedures.push(procedureDto);
            }
        });
    });

    return openDentalTreatmentPlanDto;
};
