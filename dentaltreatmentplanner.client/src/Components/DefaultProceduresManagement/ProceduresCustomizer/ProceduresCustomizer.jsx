
import './ProceduresCustomizer.css';
import HeaderBar from '../../Common/HeaderBar/HeaderBar.jsx';
import circleIcon from '../../../assets/circle-icon.svg';
import userIcon from '../../../assets/user-icon.svg';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTreatmentPlansBySubcategory } from '../../../ClientServices/apiService';
import TreatmentPlanConfiguration from "../../TreatmentPlanConfiguration/TreatmentPlanConfiguration";
import { addVisitToTreatmentPlan, deleteVisitInTreatmentPlan, updateVisitsInTreatmentPlan } from '../../../Utils/helpers';
import { getCdtCodes } from '../../../ClientServices/apiService';

const ProceduresCustomizer = () => {
    const [treatmentPlans, setTreatmentPlans] = useState([]);
    const [cdtCodes, setCdtCodes] = useState([]);
    const params = useParams();
    const subcategory = params.subcategory;

    const getOrderKey = (treatmentPlan) => {
        return treatmentPlan.visits.map(visit => visit.visitId).join('-');
    };

    useEffect(() => {
        getCdtCodes(setCdtCodes); // Fetch CDT codes when component mounts    
    }, []);

    useEffect(() => {
        const fetchTreatmentPlans = async () => {
            if (subcategory) {
                const plans = await getTreatmentPlansBySubcategory(subcategory);
                if (plans) {
                    setTreatmentPlans(plans);
                } else {
                    // Handle the case when no treatment plans are returned or an error occurs
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
            <div className="large-text">Edit Procedure Defaults</div>
            <div className="edit-procedures-container rounded-box">
                <div className="edit-procedures-inner">
                    <div className="large-text">Procedure Category: Crowns</div>
                    <div className="large-text">Procedure Sub-Category: {subcategory}</div>
                    <div>
                        {cdtCodes.length > 0 && treatmentPlans.length > 0 &&
                            treatmentPlans.map((plan, index) => {
                                const key = index; // Or another unique identifier from your plan
                                console.log(`Rendering TreatmentPlanConfiguration with key: ${key}`);
                                return (
                                    <TreatmentPlanConfiguration
                                        key={key}
                                        treatmentPlan={plan}
                                        includeExtraRow={true}
                                        cdtCodes={cdtCodes}
                                        addProcedureElement={<span>+ Add Procedure</span>}
                                        onAddVisit={(newVisit) => handleAddVisitToTreatmentPlan(plan.treatmentPlanId, newVisit)}
                                        onUpdateVisitsInTreatmentPlan={(treatmentPlanId, updatedVisits) => handleUpdateVisitsInTreatmentPlan(treatmentPlanId, updatedVisits)}
                                        onDeleteVisit={(treatmentPlanId, deletedVisitId) => handleDeleteVisitInTreatmentPlan(treatmentPlanId, deletedVisitId)}
                                        showToothNumber={false}
                                    />
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProceduresCustomizer;

