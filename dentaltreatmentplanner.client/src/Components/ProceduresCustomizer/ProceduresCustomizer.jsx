
import './ProceduresCustomizer.css';
import HeaderBar from "../HeaderBar/HeaderBar";
import circleIcon from '../../assets/circle-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTreatmentPlansBySubcategory } from '../../ClientServices/apiService';
import TreatmentPlanConfiguration from "../TreatmentPlanConfiguration/TreatmentPlanConfiguration";

import { getCdtCodes } from '../../ClientServices/apiService';

const ProceduresCustomizer = () => {
    const [treatmentPlans, setTreatmentPlans] = useState([]);
    const [cdtCodes, setCdtCodes] = useState([]);
    const params = useParams();
    const subcategory = params.subcategory;

    const getOrderKey = (treatmentPlan) => {
        // Serialize the order of visit IDs
        return treatmentPlan.visits.map(visit => visit.visitId).join('-');
    };

    useEffect(() => {
        getCdtCodes(setCdtCodes); // Fetch CDT codes when component mounts    
    }, []);

    useEffect(() => {
        if (subcategory) {
            getTreatmentPlansBySubcategory(subcategory, setTreatmentPlans);
        }
    }, [subcategory]);

    const handleAddVisitToTreatmentPlan = (treatmentPlanId, newVisit) => {
        setTreatmentPlans(prevPlans => prevPlans.map(plan => {
            if (plan.treatmentPlanId === treatmentPlanId) {
                return { ...plan, visits: [...plan.visits, newVisit] };
            }
            return plan;
        }));
    };

    const handleDeleteVisitInTreatmentPlan = (treatmentPlanId, deletedVisitId) => {
        setTreatmentPlans(prevPlans => prevPlans.map(plan => {
            if (plan.treatmentPlanId === treatmentPlanId) {
                const updatedVisits = plan.visits.filter(visit => visit.visitId !== deletedVisitId);
                return { ...plan, visits: updatedVisits };
            }
            return plan;
        }));
    };

    const updateVisitsInTreatmentPlan = (treatmentPlanId, updatedVisits) => {
        setTreatmentPlans(prevPlans => prevPlans.map(plan =>
            plan.treatmentPlanId === treatmentPlanId
                ? { ...plan, visits: [...updatedVisits] } // Reflect the new order
                : plan
        ));
    };





    return (
        <div className="procedure-customizer-wrapper">
            <div className="tx-container">
                <HeaderBar
                    leftCornerElement={<img src={circleIcon} alt="Circle Icon" />}
                    rightCornerElement={<img src={userIcon} alt="User Icon" />}
                    className="dashboard-header"
                />
                <div className="tx-main-content">
                    <div className="tx-content-area">
                        <div className="large-text">Edit Procedure Defaults</div>
                        <div className="edit-procedures-container">
                            <div className="edit-procedures-inner">
                                <div className="large-text">Procedure Category: Crowns</div>
                                <div className="large-text">Procedure Sub-Category: {subcategory}</div>
                                <div>
                                    {cdtCodes.length > 0 && (
                                        treatmentPlans.length > 0 ? (
                                            treatmentPlans.map((plan, index) => {
                                                const key = `${plan.treatmentPlanId}-${getOrderKey(plan)}`;
                                                console.log(`Rendering TreatmentPlanConfiguration with key: ${key}`);
                                                return (
                                                    <TreatmentPlanConfiguration
                                                        key={key}
                                                        treatmentPlan={plan}
                                                        includeExtraRow={true}
                                                        cdtCodes={cdtCodes}
                                                        addProcedureElement={<span>+ Add Procedure</span>}
                                                        useImageIconColumn={true}
                                                        hideToothNumber={true}
                                                        onAddVisit={(newVisit) => handleAddVisitToTreatmentPlan(plan.treatmentPlanId, newVisit)}
                                                        onUpdateVisitsInTreatmentPlan={updateVisitsInTreatmentPlan}
                                                        onDeleteVisit={(treatmentPlanId, deletedVisitId) => handleDeleteVisitInTreatmentPlan(treatmentPlanId, deletedVisitId)}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <TreatmentPlanConfiguration //removing this later on
                                                key={0}
                                                treatmentPlan={{}} // Pass an empty object or default values
                                                includeExtraRow={true}
                                                cdtCodes={cdtCodes}
                                                addProcedureElement={<span>+ Add Procedure</span>}
                                                useImageIconColumn={true}
                                                hideToothNumber={true}
                                                onAddVisit={(newVisit) => {/* Handle adding a new visit */ }}
                                                onUpdateVisitsInTreatmentPlan={() => {/* Handle updating the treatment plan */ }}
                                                onDeleteVisit={() => {/* Handle deleting a visit */ }}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProceduresCustomizer;
