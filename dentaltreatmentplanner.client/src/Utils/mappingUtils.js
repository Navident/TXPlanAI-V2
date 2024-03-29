export const mapToUpdateTreatmentPlanDto = (treatmentPlan, allRows, visitOrder, deletedRowIds, deletedVisitIds, editedRows, alternativeProcedures) => {
    const updateVisits = [];
    const updatedProcedures = [];

    const alternativeProcedureDtos = mapToAlternativeProcedureDto(alternativeProcedures);

    // Iterate over the visit order to maintain the correct order
    visitOrder.forEach((visitId, index) => {
        const visitIdStr = visitId.toString();
        const rows = allRows[visitIdStr] || [];
        const visit = treatmentPlan.visits.find(v => v.visitId === visitId);

        const cdtCodeDtos = rows
            .filter(row => row.selectedCdtCode && !deletedRowIds.includes(row.id)) // Exclude deleted rows
            .map((row, idx) => {
                const cdtCode = row.selectedCdtCode;

                return {
                    VisitCdtCodeMapId: row.visitCdtCodeMapId,
                    VisitId: visitId,
                    CdtCodeId: cdtCode.cdtCodeId,
                    ToothNumber: cdtCode.toothNumber,
                    Order: idx,
                    Code: cdtCode.code,
                    LongDescription: cdtCode.longDescription,
                };
            });
        console.log(`Processing visitId: ${visitId}, cdtCodeDtos:`, cdtCodeDtos);

        const cdtCodeIds = cdtCodeDtos.map(dto => dto.CdtCodeId);

        const updateVisitDto = {
            VisitId: visitId,
            Description: visit ? visit.description : '',
            VisitCdtCodeMaps: cdtCodeDtos,
            VisitNumber: index, // Set based on the position in visitOrder
            CdtCodeIds: cdtCodeIds
        };

        updateVisits.push(updateVisitDto);
    });

    // Process edited rows to updated procedures
    editedRows.forEach(row => {
        const { visitId, visitCdtCodeMapId, selectedCdtCode } = row;
        if (visitCdtCodeMapId) {
            updatedProcedures.push({
                VisitCdtCodeMapId: visitCdtCodeMapId,
                VisitId: visitId,
                CdtCodeId: selectedCdtCode.cdtCodeId || null,
            });
        }
    });

    const updateTreatmentPlanDto = {
        TreatmentPlanId: treatmentPlan.treatmentPlanId,
        Description: treatmentPlan.description,
        ProcedureSubcategoryId: treatmentPlan.procedureSubcategoryId,
        ToothNumber: treatmentPlan.toothNumber,
        Visits: updateVisits,
        DeletedVisitIds: deletedVisitIds,
        UpdatedProcedures: updatedProcedures,
        AlternativeProcedures: alternativeProcedureDtos,
    };
    console.log('Mapped DTO:', updateTreatmentPlanDto);
    return updateTreatmentPlanDto;
};

const mapToAlternativeProcedureDto = (alternativeProcedures) => {
    return alternativeProcedures.map(ap => ({
        AlternativeProcedureId: ap.alternativeProcedureId || null,
        VisitCdtCodeMapId: ap.visitCdtCodeMapId,
        CdtCodeId: ap.cdtCodeId,
        UserDescription: ap.userDescription,
    }));
};


export const mapToCreateNewTreatmentPlanFromDefaultDto = (treatmentPlan, allRows, visitOrder) => {
    const newPlanVisits = visitOrder.map(visitId => {
        const visitRows = allRows[visitId];
        const validRows = visitRows.filter(row => row.selectedCdtCode !== null);

        return {
            visitId: String(visitId).startsWith('temp-') ? null : visitId,
            VisitCdtCodeMaps: validRows.map(row => ({
                CdtCodeId: row.selectedCdtCode.cdtCodeId,
                Description: row.description || null,
            })),
        };
    });

    const newTreatmentPlanDto = {
        Description: treatmentPlan.description || null,
        ProcedureSubcategoryId: treatmentPlan.procedureSubcategoryId,
        ToothNumber: treatmentPlan.toothNumber,
        Visits: newPlanVisits,
    };

    console.log('Mapped DTO for new treatment plan:', newTreatmentPlanDto);
    return newTreatmentPlanDto;
};

export const mapToCreateNewCombinedTreatmentPlanForPatient = (treatmentPlan, allRows, visitOrder, payerId) => {
    const newPlanVisits = visitOrder.map(visitId => {
        const visit = treatmentPlan.visits.find(v => v.visitId === visitId);
        const visitRows = allRows[visitId];
        const validRows = visitRows.filter(row => row.selectedCdtCode !== null);

        const visitCdtCodeMaps = validRows.map(row => {
            // Check if toothNumber is an empty string, if so, set to null
            const toothNumber = row.selectedCdtCode.toothNumber === '' ? null : row.selectedCdtCode.toothNumber;

            const surface = row.selectedCdtCode.surface ? row.selectedCdtCode.surface : null;
            const arch = row.selectedCdtCode.arch ? row.selectedCdtCode.arch : null;

            return {
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


