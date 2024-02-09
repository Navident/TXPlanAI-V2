
import './ProceduresCustomizer.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTreatmentPlansBySubcategory } from '../../../../ClientServices/apiService';
import TreatmentPlanConfiguration from "../../../../Components/TreatmentPlanConfiguration/TreatmentPlanConfiguration";
import { addVisitToTreatmentPlan, deleteVisitInTreatmentPlan } from '../../../../Utils/helpers';
import { StyledLargeText, StyledContainerWithTableInner } from '../../../../GlobalStyledComponents';
import GoBack from "../../../../Components/Common/GoBack/GoBack";

const ProceduresCustomizer = () => {
    const [treatmentPlans, setTreatmentPlans] = useState([]);
    const params = useParams();
    const subcategory = params.subcategory;
    const category = params.category;

    useEffect(() => {
        const fetchTreatmentPlans = async () => {
            if (subcategory) {
                const plans = await getTreatmentPlansBySubcategory(subcategory);
                if (plans) {
                    setTreatmentPlans(plans);
                } else {
                    console.log(`No treatment plans found for subcategory: ${subcategory}`);
                }
            }
        };

        fetchTreatmentPlans();
    }, [subcategory]);

    useEffect(() => {
        console.log("treatmentPlans updated:", treatmentPlans);
    }, [treatmentPlans]);


    const handleAddVisitToTreatmentPlan = (treatmentPlanId, newVisit) => {
        setTreatmentPlans(prevPlans => addVisitToTreatmentPlan(prevPlans, treatmentPlanId, newVisit));
    };

    const handleDeleteVisitInTreatmentPlan = (treatmentPlanId, deletedVisitId) => {
        setTreatmentPlans(prevPlans => deleteVisitInTreatmentPlan(prevPlans, treatmentPlanId, deletedVisitId));
    };

    const handleUpdateVisitsInTreatmentPlan = (treatmentPlanId, updatedVisits) => {
        setTreatmentPlans(prevPlans => {
            return prevPlans.map(plan => {
                if (plan.treatmentPlanId === treatmentPlanId) {
                    return { ...plan, visits: updatedVisits };
                }
                return plan;
            });
        });
    };

    return (
        <div className="procedure-customizer-wrapper">
            <GoBack text="Go Back" />
            <div className="edit-procedures-container rounded-box box-shadow">
                <StyledContainerWithTableInner>
                    <StyledLargeText>Procedure Category: {category}</StyledLargeText>
                    <StyledLargeText>Procedure Sub-Category: {subcategory}</StyledLargeText>
                    <div>
                        {treatmentPlans.length > 0 &&
                            treatmentPlans.map((plan, index) => {
                                const key = index; 
                                return (
                                    <TreatmentPlanConfiguration
                                        key={key}
                                        treatmentPlan={plan}
                                        includeExtraRow={true}
                                        addProcedureElement={<span>+ Add Procedure</span>}
                                        onAddVisit={(newVisit) => handleAddVisitToTreatmentPlan(plan.treatmentPlanId, newVisit)}
                                        onUpdateVisitsInTreatmentPlan={(treatmentPlanId, updatedVisits) => handleUpdateVisitsInTreatmentPlan(treatmentPlanId, updatedVisits)}
                                        onDeleteVisit={(treatmentPlanId, deletedVisitId) => handleDeleteVisitInTreatmentPlan(treatmentPlanId, deletedVisitId)}
                                        showToothNumber={false}
                                        isInGenerateTreatmentPlanContext={false} 
                                    />
                                );
                            })
                        }
                    </div>
                </StyledContainerWithTableInner>
            </div>
        </div>
    );
};

export default ProceduresCustomizer;

