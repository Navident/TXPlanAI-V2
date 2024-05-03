export const mapToUpdateTreatmentPlanDto = (treatmentPlan, allRows, alternativeRows, visitOrder, deletedRowIds) => {
    const updateVisits = [];

    Object.keys(allRows).forEach((visitIdStr, index) => {
        const isTempVisit = visitIdStr.startsWith("temp");
        const visitId = isTempVisit ? null : parseInt(visitIdStr);

        const defaultRows = allRows[visitIdStr] || [];
        const nonDefaultRows = alternativeRows[visitIdStr] || [];

        const nonDefaultRowIds = new Set(nonDefaultRows.map(row => row.id));
        const filteredDefaultRows = defaultRows.filter(row => !nonDefaultRowIds.has(row.id));
        const combinedRows = [...filteredDefaultRows, ...nonDefaultRows];

        // Group by VisitToProcedureMapId
        const visitToProcedureMapGroups = combinedRows.reduce((acc, row) => {
            const mapId = row.visitToProcedureMapId || null;
            if (!acc[mapId]) {
                acc[mapId] = {
                    VisitToProcedureMapId: mapId,
                    ProcedureTypeId: row.procedureTypeId,
                    Order: defaultRows.indexOf(row), // Fetch order directly from allRows
                    ToothNumber: row.toothNumber,
                    Surface: row.surface,
                    Arch: row.arch === "default" ? null : row.arch,
                    Repeatable: row.repeatable !== undefined ? row.repeatable : true,
                    AssignArch: row.assignArch !== undefined ? row.assignArch : true,
                    AssignToothNumber: row.assignToothNumber !== undefined ? row.assignToothNumber : true,
                    ProcedureToCdtMaps: []
                };
            }
            if (row.selectedCdtCode) {
                acc[mapId].ProcedureToCdtMaps.push({
                    ProcedureToCdtMapId: row.selectedCdtCode.procedureToCdtMapId || null,
                    CdtCodeId: row.selectedCdtCode.cdtCodeId,
                    Default: row.default !== undefined ? row.default : false,
                    UserDescription: row.selectedCdtCode.userDescription || "",
                    Code: row.selectedCdtCode.code,
                    LongDescription: row.selectedCdtCode.longDescription || "",
                });
            }
            return acc;
        }, {});

        // Sort the grouped objects based on the order index defined in allRows
        const visitToProcedureMapDtos = Object.values(visitToProcedureMapGroups).sort((a, b) => a.Order - b.Order);

        console.log(`Processing visitId: ${visitId}, Procedures:`, visitToProcedureMapDtos);

        const updateVisitDto = {
            VisitId: visitId,
            Description: defaultRows[0]?.description || `Visit ${index + 1}`,
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
    };

    console.log('Mapped DTO:', updateTreatmentPlanDto);
    return updateTreatmentPlanDto;
};



export const mapToCreateNewTreatmentPlanFromDefaultDto = (treatmentPlan, allRows, alternativeRows) => {
    const newPlanVisits = Object.keys(allRows).map((visitIdStr, index) => {
        const isTempVisit = visitIdStr.startsWith("temp");
        const visitId = isTempVisit ? null : parseInt(visitIdStr);

        const defaultRows = allRows[visitIdStr] || [];
        const nonDefaultRows = alternativeRows[visitIdStr] || [];

        const nonDefaultRowIds = new Set(nonDefaultRows.map(row => row.id));
        const filteredDefaultRows = defaultRows.filter(row => !nonDefaultRowIds.has(row.id));
        const combinedRows = [...filteredDefaultRows, ...nonDefaultRows];

        // Group by VisitToProcedureMapId
        const visitToProcedureMapGroups = combinedRows.reduce((acc, row) => {
            const mapId = row.visitToProcedureMapId || null;
            if (!acc[mapId]) {
                acc[mapId] = {
                    VisitToProcedureMapId: mapId,
                    ProcedureTypeId: row.procedureTypeId,
                    Order: defaultRows.indexOf(row), // Set the order based on index in allRows
                    ToothNumber: row.toothNumber,
                    Surface: row.surface,
                    Arch: row.arch,
                    ProcedureToCdtMaps: []
                };
            }
            if (row.selectedCdtCode) {
                acc[mapId].ProcedureToCdtMaps.push({
                    ProcedureToCdtMapId: row.selectedCdtCode.procedureToCdtMapId || null,
                    CdtCodeId: row.selectedCdtCode.cdtCodeId,
                    Default: row.default !== undefined ? row.default : false,
                    UserDescription: row.selectedCdtCode.userDescription || "",
                    Code: row.selectedCdtCode.code,
                    LongDescription: row.selectedCdtCode.longDescription || "",
                });
            }
            return acc;
        }, {});

        // Sort the grouped objects based on the order index defined in allRows
        const visitToProcedureMaps = Object.values(visitToProcedureMapGroups).sort((a, b) => a.Order - b.Order);

        return {
            VisitId: visitId,
            Description: defaultRows[0]?.description || `Visit ${index + 1}`,
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
