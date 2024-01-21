import useTreatmentPlan from '../../../../Contexts/TreatmentPlanContext/useTreatmentPlan';
import TreatmentPlanConfiguration from '../../../TreatmentPlanConfiguration/TreatmentPlanConfiguration';
import GoBack from "../../../Common/GoBack/GoBack";

const PatientTreatmentPlanCustomizer = () => {
    const {
        treatmentPlans,
        cdtCodes,
        handleAddVisit,
        onDeleteVisit,
        onUpdateVisitsInTreatmentPlan,
        treatmentPlanId 
    } = useTreatmentPlan();

    // Use treatmentPlanId from context to find the specific treatment plan
    const selectedTreatmentPlan = treatmentPlans.find(plan => String(plan.treatmentPlanId) === String(treatmentPlanId));
    console.log("Selected Treatment Plan: ", selectedTreatmentPlan);
    console.log("Treatment Plan ID from Context: ", treatmentPlanId);
    console.log("Treatment Plans: ", treatmentPlans);


    return (
        <div className="procedure-customizer-wrapper">
            <GoBack text="Go Back" />

            <div className="edit-procedures-container rounded-box box-shadow">
                <div className="edit-procedures-inner">
                    <div>
                        {selectedTreatmentPlan && (
                            <TreatmentPlanConfiguration
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
                </div>
            </div>
        </div>
    );
};

export default PatientTreatmentPlanCustomizer;
