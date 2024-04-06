export const mapToUpdateTreatmentPlanDto = (treatmentPlan, allRows, alternativeRows, visitOrder, deletedRowIds, deletedVisitIds, editedRows) => {
    const updateVisits = [];

    visitOrder.forEach((visitId, index) => {
        const visitIdStr = visitId.toString();
        // Retrieve default and alternative rows for the current visit
        const defaultRows = allRows[visitIdStr] || [];
        const nonDefaultRows = alternativeRows[visitIdStr] || [];

        // No need to create a set of identifiers from nonDefaultRows or filter out defaultRows based on nonDefaultRowIds.
        // Just make sure not to duplicate entries if they somehow exist in both defaultRows and nonDefaultRows.

        // Combine default and alternative rows, prioritizing non-default rows
        // Remove any potential duplicates that might exist between the two
        const uniqueRowIds = new Set(nonDefaultRows.map(row => row.id));
        const combinedRows = [...nonDefaultRows, ...defaultRows.filter(row => !uniqueRowIds.has(row.id))];

        const visit = treatmentPlan.visits.find(v => v.visitId === visitId);

        const visitToProcedureMapDtos = combinedRows
            .filter(row => row.isStatic && !deletedRowIds.includes(row.id)) // Now including all existing alternative procedures unless explicitly deleted.
            .map((row, idx) => {
                const { selectedCdtCode, visitToProcedureMapId, procedureTypeId, toothNumber, surface, arch } = row;
                return {
                    VisitToProcedureMapId: visitToProcedureMapId,
                    ProcedureTypeId: procedureTypeId,
                    Order: idx,
                    ToothNumber: toothNumber,
                    Surface: surface,
                    Arch: arch,
                    ProcedureToCdtMaps: [
                        {
                            ProcedureToCdtMapId: selectedCdtCode.procedureToCdtMapId,
                            CdtCodeId: selectedCdtCode.cdtCodeId,
                            Default: row.default !== undefined ? row.default : null,
                            UserDescription: selectedCdtCode.userDescription,
                            Code: selectedCdtCode.code,
                            LongDescription: selectedCdtCode.longDescription,
                        }
                    ]
                };
            });

        console.log(`Processing visitId: ${visitId}, Procedures:`, visitToProcedureMapDtos);

        const updateVisitDto = {
            VisitId: visitId,
            Description: visit ? visit.description : '',
            VisitNumber: index,
            VisitToProcedureMapDtos: visitToProcedureMapDtos
        };

        updateVisits.push(updateVisitDto);
    });

    const updateTreatmentPlanDto = {
        TreatmentPlanId: treatmentPlan.treatmentPlanId,
        Description: treatmentPlan.description,
        ProcedureSubcategoryId: treatmentPlan.procedureSubcategoryId,
        ToothNumber: treatmentPlan.toothNumber,
        PatientId: treatmentPlan.patientId,
        PayerId: treatmentPlan.payerId,
        Visits: updateVisits,
        DeletedVisitIds: deletedVisitIds,
    };

    console.log('Mapped DTO:', updateTreatmentPlanDto);
    return updateTreatmentPlanDto;
};






export const mapToCreateNewTreatmentPlanFromDefaultDto = (treatmentPlan, allRows, visitOrder) => {
    const newPlanVisits = visitOrder.map(visitId => {
        const visitRows = allRows[visitId];
        const validRows = visitRows.filter(row => row.selectedCdtCode !== null);

        return {
            Description: treatmentPlan.description || null, 
            VisitToProcedureMaps: validRows.map(row => ({
                Order: row.order, 
                ToothNumber: row.toothNumber,
                Surface: row.surface || null,
                Arch: row.arch || null,
                ProcedureToCdtMaps: [{
                    CdtCodeId: row.selectedCdtCode.cdtCodeId,
                    Default: false, 
                    UserDescription: row.description || null,
                }],
            })),
        };
    });

    const newTreatmentPlanDto = {
        Description: treatmentPlan.description || null,
        ProcedureSubcategoryId: treatmentPlan.procedureSubcategoryId,
        Visits: newPlanVisits,
    };

    console.log('Mapped DTO for new treatment plan:', newTreatmentPlanDto);
    return newTreatmentPlanDto;
};



export const mapToCreateNewCombinedTreatmentPlanForPatient = (treatmentPlan, allRows, alternativeRows, visitOrder, payerId) => {
    const newPlanVisits = visitOrder.map((visitId, index) => {
        const visit = treatmentPlan.visits.find(v => v.visitId === visitId);
        const visitIdStr = visitId.toString();
        const defaultRows = allRows[visitIdStr] || [];
        const nonDefaultRows = alternativeRows[visitIdStr] || [];

        const nonDefaultRowIds = new Set(nonDefaultRows.map(row => row.id));
        const filteredDefaultRows = defaultRows.filter(row => !nonDefaultRowIds.has(row.id));
        const combinedRows = [...filteredDefaultRows, ...nonDefaultRows];

        const visitToProcedureMaps = combinedRows
            .filter(row => row.selectedCdtCode !== null) // Ensure only rows with a selected CDT code are included
            .map((row, rowIdx) => {
                return {
                    VisitToProcedureMapId: row.visitToProcedureMapId, // Adjust according to your real data structure
                    Order: rowIdx,
                    ToothNumber: row.selectedCdtCode.toothNumber ? parseInt(row.selectedCdtCode.toothNumber) : null,
                    ProcedureTypeId: row.procedureTypeId,
                    Surface: row.surface,
                    Arch: row.arch,
                    ProcedureToCdtMaps: [{
                        ProcedureToCdtMapId: row.selectedCdtCode.procedureToCdtMapId,
                        CdtCodeId: row.selectedCdtCode.cdtCodeId,
                        Default: row.selectedCdtCode.default,
                        UserDescription: row.selectedCdtCode.userDescription,
                        Code: row.selectedCdtCode.code,
                        LongDescription: row.selectedCdtCode.longDescription,
                    }]
                };
            });


        return {
            visitId: String(visitId).startsWith('temp-') ? null : visitId,
            description: visit?.description,
            VisitToProcedureMaps: visitToProcedureMaps,
        };
    });

    const newTreatmentPlanDto = {
        Description: treatmentPlan.description,
        ProcedureSubcategoryId: null,
        ToothNumber: treatmentPlan.toothNumber ? parseInt(treatmentPlan.toothNumber.match(/\d+/)[0]) : null,
        Visits: newPlanVisits,
        PayerId: payerId,
    };

    console.log('Mapped DTO for new treatment plan:', newTreatmentPlanDto);
    return newTreatmentPlanDto;
};






export const mapToCreateVisitDto = (treatmentPlan) => {
    const newVisitDto = {
        TreatmentPlanId: treatmentPlan.treatmentPlanId,
        Description: "Table " + (treatmentPlan.visits.length),
        VisitNumber: treatmentPlan.visits.length 
    };
    console.log('Mapped DTO for new visit in tx:', newVisitDto);
    return newVisitDto;
};



export const mapToUpdateCustomerKeyDto = (newCustomerKey) => {
    return {
        NewCustomerKey: newCustomerKey
    };
};
