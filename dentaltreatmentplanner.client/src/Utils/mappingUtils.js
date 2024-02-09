export const mapToUpdateTreatmentPlanDto = (treatmentPlan, allRows, visitOrder, deletedRowIds, deletedVisitIds, editedRows) => {
    const updateVisits = [];
    const updatedProcedures = [];

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
                    TreatmentPhaseId: row.selectedTreatmentPhase ? row.selectedTreatmentPhase.id : null, // Include treatment phase ID
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
                CdtCodeId: selectedCdtCode.cdtCodeId,
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
    };
    console.log('Mapped DTO:', updateTreatmentPlanDto);
    return updateTreatmentPlanDto;
};

export const mapToCreateNewTreatmentPlanFromDefaultDto = (treatmentPlan, allRows, visitOrder) => {
    const newPlanVisits = visitOrder.map(visitId => {
        const visitRows = allRows[visitId];
        const validRows = visitRows.filter(row => row.selectedCdtCode !== null);

        return {
            visitId: String(visitId).startsWith('temp-') ? null : visitId,
            VisitCdtCodeMaps: validRows.map(row => ({
                CdtCodeId: row.selectedCdtCode.cdtCodeId,
                Description: row.description,
                // Include other properties as per your backend requirements
            })),
        };
    });

    const newTreatmentPlanDto = {
        Description: treatmentPlan.description,
        ProcedureSubcategoryId: treatmentPlan.procedureSubcategoryId,
        ToothNumber: treatmentPlan.toothNumber,
        Visits: newPlanVisits,
    };

    console.log('Mapped DTO for new treatment plan:', newTreatmentPlanDto);
    return newTreatmentPlanDto;
};

export const mapToCreateNewCombinedTreatmentPlanForPatient = (treatmentPlan, allRows, visitOrder, payerId) => {
    const newPlanVisits = visitOrder.map(visitId => {
        const visitRows = allRows[visitId];
        const validRows = visitRows.filter(row => row.selectedCdtCode !== null);

        return {
            visitId: String(visitId).startsWith('temp-') ? null : visitId,
            VisitCdtCodeMaps: validRows.map(row => ({
                CdtCodeId: row.selectedCdtCode.cdtCodeId,
                Description: row.description,
                ToothNumber: row.selectedCdtCode.toothNumber
            })),
        };
    });

    const newTreatmentPlanDto = {
        Description: treatmentPlan.description,
        ProcedureSubcategoryId: null,
        ToothNumber: treatmentPlan.toothNumber,
        Visits: newPlanVisits,
        PayerId: payerId,
    };

    console.log('Mapped DTO for new treatment plan:', newTreatmentPlanDto);
    return newTreatmentPlanDto;
};


export const mapToCreateVisitDto = (treatmentPlan) => {
    const newVisitDto = {
        TreatmentPlanId: treatmentPlan.treatmentPlanId,
        Description: "Visit " + (treatmentPlan.visits.length),
        VisitNumber: treatmentPlan.visits.length 
    };

    return newVisitDto;
};


