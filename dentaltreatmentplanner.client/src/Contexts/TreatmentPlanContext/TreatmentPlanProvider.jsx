import React, { useState, useEffect } from 'react';
import TreatmentPlanContext from './TreatmentPlanContext';
import { addVisitToTreatmentPlan, deleteVisitInTreatmentPlan, updateVisitsInTreatmentPlan } from '../../Utils/helpers';
import { getCdtCodes } from '../../ClientServices/apiService';

const TreatmentPlanProvider = ({ children }) => {
    const [treatmentPlans, setTreatmentPlans] = useState([]);
    const [cdtCodes, setCdtCodes] = useState([]);
    const [treatmentPlanId, setTreatmentPlanId] = useState(null);

    useEffect(() => {
        const fetchCdtCodes = async () => {
            const codes = await getCdtCodes();
            setCdtCodes(codes);
        };

        fetchCdtCodes();
    }, []);

    // Define your functions here
    const handleAddVisit = (treatmentPlanId, newVisit) => {
        const updatedPlans = addVisitToTreatmentPlan(treatmentPlans, treatmentPlanId, newVisit);
        setTreatmentPlans(updatedPlans);
    };

    const onDeleteVisit = (treatmentPlanId, deletedVisitId) => {
        const updatedPlans = deleteVisitInTreatmentPlan(treatmentPlans, treatmentPlanId, deletedVisitId);
        setTreatmentPlans(updatedPlans);
    };

    const onUpdateVisitsInTreatmentPlan = (treatmentPlanId, updatedVisits) => {
        const updatedPlans = updateVisitsInTreatmentPlan(treatmentPlans, treatmentPlanId, updatedVisits);
        setTreatmentPlans(updatedPlans);
    };

    return (
        <TreatmentPlanContext.Provider value={{ treatmentPlans, setTreatmentPlans, treatmentPlanId, setTreatmentPlanId, cdtCodes, setCdtCodes, handleAddVisit, onDeleteVisit, onUpdateVisitsInTreatmentPlan }}>
            {children}
        </TreatmentPlanContext.Provider>
    );
};

export default TreatmentPlanProvider;