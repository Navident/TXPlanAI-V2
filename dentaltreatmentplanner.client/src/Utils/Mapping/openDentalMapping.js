export const mapToOpenDentalTreatmentPlanDto = ( treatmentPlans, patientId) => {
    const currentPlan = treatmentPlans[0];

    // Generate current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    const openDentalTreatmentPlanDto = {
        PatNum: patientId, // This needs to be dynamic, we have a way to get this already
        ProcDate: currentDate,
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
                priority: visit.visitNumber.toString()  // the priority should be the visit number that the procedure is in
            };

            openDentalTreatmentPlanDto.Procedures.push(procedureDto);
        }
    }

    return openDentalTreatmentPlanDto;
};


function adjustToothNumberAndRange(selectedCdtCode, procedureDto) {
    const category = selectedCdtCode.originalVisitCategory.toLowerCase();
    if (category === "fluoride") {
        procedureDto.ToothRange = "1-32"; // Add ToothRange for fluoride treatments
    } else if (category === "bone-grafts" || category === "membrane") {
        procedureDto.ToothNum = ""; // Ensure the tooth number is an empty string
    }
}

export const mapToOpenDentalTreatmentPlanDtoByAllRows = (allRows, patientId) => {
    // Generate current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    const openDentalTreatmentPlanDto = {
        PatNum: patientId,
        ProcDate: currentDate,
        Procedures: []
    };

    // Iterate through allRows object and get both the procedures and their visit index
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

                adjustToothNumberAndRange(selectedCdtCode, procedureDto);

                openDentalTreatmentPlanDto.Procedures.push(procedureDto);
            }
        });
    });

    console.log("DTO before return:", openDentalTreatmentPlanDto);
    return openDentalTreatmentPlanDto;
};