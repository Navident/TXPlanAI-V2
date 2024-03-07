import React, { useState, useEffect } from 'react';
import TreatmentPlanContext from './TreatmentPlanContext';
import { addVisitToTreatmentPlan, deleteVisitInTreatmentPlan, updateVisitsInTreatmentPlan } from '../../Utils/helpers';

const TreatmentPlanProvider = ({ children }) => {
    const [treatmentPlans, setTreatmentPlans] = useState([]);
    const [treatmentPlanId, setTreatmentPlanId] = useState(null);

    const handleAddVisit = (treatmentPlanId, newVisit) => {
        const updatedPlans = addVisitToTreatmentPlan(treatmentPlans, treatmentPlanId, newVisit);
        setTreatmentPlans(updatedPlans);
    };


    const onUpdateVisitsInTreatmentPlan = (treatmentPlanId, updatedVisits) => {
        const updatedPlans = updateVisitsInTreatmentPlan(treatmentPlans, treatmentPlanId, updatedVisits);
        setTreatmentPlans(updatedPlans);
    };


    return (
        <TreatmentPlanContext.Provider value={{
            treatmentPlans, setTreatmentPlans, treatmentPlanId, setTreatmentPlanId, handleAddVisit, onUpdateVisitsInTreatmentPlan }}>
            {children}
        </TreatmentPlanContext.Provider>
    );
};

export default TreatmentPlanProvider;