import React, { useState, useEffect } from 'react';
import TreatmentPlanContext from './TreatmentPlanContext';
import { addVisitToTreatmentPlan, deleteVisitInTreatmentPlan, updateVisitsInTreatmentPlan } from '../../Utils/helpers';

const TreatmentPlanProvider = ({ children }) => {
    const [treatmentPlans, setTreatmentPlans] = useState([]);
    const [treatmentPlanId, setTreatmentPlanId] = useState(null);
    const [selectedPayer, setSelectedPayer] = useState(null); 
    const [alertInfo, setAlertInfo] = useState({ open: false, type: '', message: '' });

    const updateSelectedPayer = (payer) => {
        setSelectedPayer(payer);
    };

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

    const showAlert = (type, message) => {
        setAlertInfo({ open: true, type, message });
    };

    const closeAlert = () => {
        setAlertInfo({ ...alertInfo, open: false });
    };

    return (
        <TreatmentPlanContext.Provider value={{
            treatmentPlans, alertInfo, showAlert, closeAlert, setTreatmentPlans, treatmentPlanId, setTreatmentPlanId, selectedPayer, updateSelectedPayer, handleAddVisit, onDeleteVisit, onUpdateVisitsInTreatmentPlan }}>
            {children}
        </TreatmentPlanContext.Provider>
    );
};

export default TreatmentPlanProvider;