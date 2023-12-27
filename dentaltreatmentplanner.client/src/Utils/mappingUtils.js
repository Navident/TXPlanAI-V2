export const mapToDto = (treatmentPlan, allRows, visitOrder, deletedRowIds, deletedVisitIds) => {
    const updateVisits = [];

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

    const updateTreatmentPlanDto = {
        TreatmentPlanId: treatmentPlan.treatmentPlanId,
        Description: treatmentPlan.description,
        ProcedureSubcategoryId: treatmentPlan.procedureSubcategoryId,
        ToothNumber: treatmentPlan.toothNumber,
        Visits: updateVisits,
        DeletedVisitIds: deletedVisitIds 
    };
    console.log('Mapped DTO:', updateTreatmentPlanDto);
    return updateTreatmentPlanDto;
};


export const mapToCreateVisitDto = (treatmentPlan) => {
    const newVisitDto = {
        TreatmentPlanId: treatmentPlan.treatmentPlanId,
        Description: "Visit " + (treatmentPlan.visits.length),
        VisitNumber: treatmentPlan.visits.length 
    };

    return newVisitDto;
};


