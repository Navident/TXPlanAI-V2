export const mapToUpdateTreatmentPlanDto = (treatmentPlan, allRows, alternativeRows, visitOrder, deletedRowIds, deletedVisitIds, editedRows) => {
    const updateVisits = [];

    visitOrder.forEach((visitId, index) => {
        const visitIdStr = visitId.toString();
        // Retrieve default and alternative rows for the current visit
        const defaultRows = allRows[visitIdStr] || [];
        const nonDefaultRows = alternativeRows[visitIdStr] || [];

        // Create a set of identifiers (e.g., id) from nonDefaultRows to quickly check for existence
        const nonDefaultRowIds = new Set(nonDefaultRows.map(row => row.id));

        // Filter out any default rows that have a corresponding entry in nonDefaultRows
        const filteredDefaultRows = defaultRows.filter(row => !nonDefaultRowIds.has(row.id));

        // Combine the remaining default rows with the alternative rows
        const combinedRows = [...filteredDefaultRows, ...nonDefaultRows];

        const visit = treatmentPlan.visits.find(v => v.visitId === visitId);

        const visitToProcedureMapDtos = combinedRows
            .filter(row => row.isStatic && !deletedRowIds.includes(row.id)) // Exclude deleted rows, focus on static rows for mapping
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



export const mapToCreateNewCombinedTreatmentPlanForPatient = (treatmentPlan, allRows, visitOrder, payerId) => {
    const newPlanVisits = visitOrder.map(visitId => {
        const visit = treatmentPlan.visits.find(v => v.visitId === visitId);
        const visitRows = allRows[visitId];
        // Simplify the filtering condition
        const validRows = visitRows.filter(row => {
            // Only include rows where selectedCdtCode is not null
            return row.selectedCdtCode !== null;
        });

        const visitCdtCodeMaps = validRows.map(row => {
            // Check if toothNumber is an empty string, if so, set to null
            const toothNumber = row.selectedCdtCode.toothNumber === '' ? null : row.selectedCdtCode.toothNumber;
            const surface = row.selectedCdtCode.surface ? row.selectedCdtCode.surface : null;
            const arch = row.selectedCdtCode.arch ? row.selectedCdtCode.arch : null;

            return {
                VisitCdtCodeMapId: row.visitCdtCodeMapId,
                CdtCodeId: row.selectedCdtCode.cdtCodeId,
                Code: row.selectedCdtCode.code,
                LongDescription: row.selectedCdtCode.longDescription,
                ToothNumber: toothNumber,
                Surface: surface,
                Arch: arch,
            };
        });

        const cdtCodeIds = validRows.map(row => row.selectedCdtCode.cdtCodeId);

        return {
            visitId: String(visitId).startsWith('temp-') ? null : visitId,
            description: visit?.description,
            CdtCodeIds: cdtCodeIds,
            VisitCdtCodeMaps: visitCdtCodeMaps,
        };
    });

    const newTreatmentPlanDto = {
        UpdatedProcedures: [],
        DeletedVisitIds: [],
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


