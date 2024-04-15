export const mapToUpdateTreatmentPlanDto = (treatmentPlan, allRows, alternativeRows, visitOrder, deletedRowIds, deletedVisitIds, editedRows) => {
    const updateVisits = [];

    visitOrder.forEach((visitId, index) => {
        const visitIdStr = visitId.toString();
        // Retrieve default and alternative rows for the current visit
        const defaultRows = allRows[visitIdStr] || [];
        const nonDefaultRows = alternativeRows[visitIdStr] || [];

        // Combine default and alternative rows, prioritizing non-default rows
        // Remove any potential duplicates that might exist between the two
        const uniqueRowIds = new Set(nonDefaultRows.map(row => row.id));
        const combinedRows = [...nonDefaultRows, ...defaultRows.filter(row => !uniqueRowIds.has(row.id))];

        const visit = treatmentPlan.visits.find(v => v.visitId === visitId);

        const visitToProcedureMapDtos = combinedRows
            .filter(row => row.isStatic && !deletedRowIds.includes(row.id)) // Now including all existing alternative procedures unless explicitly deleted.
            .map((row, idx) => {
                const { selectedCdtCode, procedureTypeId, toothNumber, surface, arch } = row;
                const archValue = (arch === "default") ? null : arch;

                return {
                    VisitToProcedureMapId: row.visitToProcedureMapId || null, 
                    ProcedureTypeId: procedureTypeId,
                    Order: idx,
                    ToothNumber: toothNumber,
                    Surface: surface,
                    Arch: archValue,
                    Repeatable: row.repeatable !== undefined ? row.repeatable : true,
                    AssignArch: row.assignArch !== undefined ? row.assignArch : true,
                    AssignToothNumber: row.assignToothNumber !== undefined ? row.assignToothNumber : true,
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






export const mapToCreateNewTreatmentPlanFromDefaultDto = (treatmentPlan, allRows, alternativeRows, visitOrder) => {
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
                const defaultValue = row.default ?? row.selectedCdtCode?.default;

                return {
                    VisitToProcedureMapId: row.visitToProcedureMapId || null, 
                    Order: rowIdx,
                    ToothNumber: row.selectedCdtCode.toothNumber ? parseInt(row.selectedCdtCode.toothNumber) : null,
                    ProcedureTypeId: row.procedureTypeId,
                    Surface: row.surface,
                    Arch: row.arch,
                    ProcedureToCdtMaps: [{
                        ProcedureToCdtMapId: row.selectedCdtCode.procedureToCdtMapId,
                        CdtCodeId: row.selectedCdtCode.cdtCodeId,
                        Default: defaultValue,
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
        ProcedureSubcategoryId: treatmentPlan.procedureSubcategoryId,
        ToothNumber: treatmentPlan.toothNumber ? parseInt(treatmentPlan.toothNumber.match(/\d+/)[0]) : null,
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
                    VisitToProcedureMapId: row.visitToProcedureMapId, 
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
