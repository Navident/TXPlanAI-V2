import useTreatmentPlan from '../../../../Contexts/TreatmentPlanContext/useTreatmentPlan';
import TreatmentPlanOutput from '../../../TreatmentPlanOutput/TreatmentPlanOutput';
import GoBack from "../../../../Components/Common/GoBack/GoBack";
import { StyledContainerWithTableInner } from '../../../../GlobalStyledComponents';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PatientTreatmentPlanCustomizer = () => {
    const {
        treatmentPlans,
        cdtCodes,
        handleAddVisit,
        onDeleteVisit,
        onUpdateVisitsInTreatmentPlan,
    } = useTreatmentPlan();

    const location = useLocation();
    const selectedTreatmentPlan = location.state?.selectedTreatmentPlan;
    return (
        <div className="procedure-customizer-wrapper">
            <GoBack text="Go Back" />

            <div className="edit-procedures-container rounded-box box-shadow">
                <StyledContainerWithTableInner>
                    <div>
                        {selectedTreatmentPlan && (
                            <TreatmentPlanOutput
                                key={`treatment-plan-${selectedTreatmentPlan.treatmentPlanId}`}
                                treatmentPlan={selectedTreatmentPlan}
                                treatmentPlans={treatmentPlans}
                                cdtCodes={cdtCodes}
                                onAddVisit={(newVisit) => handleAddVisit(selectedTreatmentPlan.treatmentPlanId, newVisit)}
                                onUpdateVisitsInTreatmentPlan={(updatedVisits) => onUpdateVisitsInTreatmentPlan(selectedTreatmentPlan.treatmentPlanId, updatedVisits)}
                                onDeleteVisit={(deletedVisitId) => onDeleteVisit(selectedTreatmentPlan.treatmentPlanId, deletedVisitId)}
                                showToothNumber={true}
                                isInGenerateTreatmentPlanContext={false}
                            />
                        )}
                    </div>
                </StyledContainerWithTableInner>
            </div>
        </div>
    );
};

export default PatientTreatmentPlanCustomizer;
