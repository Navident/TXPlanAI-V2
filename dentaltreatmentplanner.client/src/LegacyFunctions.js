const handleAddVisit = () => {
    const tempVisitId = `temp-${Date.now()}`;
    const initialRowId = `initial-${tempVisitId}`;

    const newVisit = {
        visitId: tempVisitId,
        treatment_plan_id: treatmentPlan.treatmentPlanId,
        visit_number: treatmentPlan.visits.length,
        description: "Visit " + (treatmentPlan.visits.length)
    };
    console.log('Adding new visit:', newVisit);

    // update the parent component's state
    onAddVisit(newVisit);

    // Add a new dynamic row for the visit
    const newRow = createDynamicRowv1(tempVisitId, initialRowId);

    // Update visitOrder and allRows
    setVisitOrder(prevOrder => [...prevOrder, tempVisitId]);
    setAllRows(prevRows => ({
        ...prevRows,
        [tempVisitId]: [newRow]
    }));
};

const handleDeleteVisit = (visitId) => {
    // Update the visitOrder to remove the visit
    setVisitOrder(prevOrder => prevOrder.filter(id => id !== visitId));
    // Update allRows to remove the rows associated with the visit
    setAllRows(prevRows => {
        const updatedRows = { ...prevRows };
        delete updatedRows[visitId];
        return updatedRows;
    });
    setDeletedVisitIds(prevIds => {
        const newDeletedVisitIds = [...prevIds, visitId];
        console.log("Deleted visit added, new deletedVisitIds:", newDeletedVisitIds);
        return newDeletedVisitIds;
    });
    onDeleteVisit(treatmentPlan.treatmentPlanId, visitId);
};

export const getTreatmentPhases = async () => {
    try {
        const response = await fetch(TREATMENT_PHASES_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Treatment phases fetched successfully:', data);
            return data; // Return the data
        } else {
            console.error('Failed to fetch treatment phases. Status:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching treatment phases:', error.message);
        return [];
    }
};

export const sortTreatmentPlanWithPhases = (treatmentPlan) => {
    // Check if the treatment plan has phases
    if (!treatmentPlan?.phases) {
        console.log("No phases in the treatment plan");
        return { sortedVisits: [], sortedCdtCodes: {} };
    }

    let visits = [];
    // Extract visits from each phase
    Object.values(treatmentPlan.phases).forEach(phaseVisits => {
        visits = visits.concat(phaseVisits);
    });

    // Sort visits by uniqueId and then by visitNumber
    const sortedVisits = visits.sort((a, b) => {
        if (a.uniqueId !== b.uniqueId) {
            return a.uniqueId.localeCompare(b.uniqueId);
        }
        return a.visitNumber - b.visitNumber;
    });
    console.log("Sorted Visits:", sortedVisits);

    // Generate sorted CDT codes for each visit using uniqueId
    const sortedCdtCodes = sortedVisits.reduce((acc, visit) => {
        const cdtCodes = Array.isArray(visit.cdtCodes) ? visit.cdtCodes : [];
        acc[visit.uniqueId] = cdtCodes.sort((a, b) => a.order - b.order);
        return acc;
    }, {});

    console.log("Sorted CDT Codes:", sortedCdtCodes);

    return { sortedVisits, sortedCdtCodes };
};