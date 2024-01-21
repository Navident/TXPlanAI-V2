import RoundedButton from "../../Common/RoundedButton/RoundedButton";
import { TextField } from "@mui/material";
import PenIcon from '../../../assets/pen-icon.svg';
import { useState, useEffect } from 'react';
import { getTreatmentPlansBySubcategory } from '../../../ClientServices/apiService';
import TreatmentPlanConfiguration from '../../TreatmentPlanConfiguration/TreatmentPlanConfiguration';
import useTreatmentPlan from '../../../Contexts/TreatmentPlanContext/useTreatmentPlan';
import { generateTreatmentPlan, getTreatmentPlanById } from '../../../ClientServices/apiService';



const GenerateTreatmentPlan = () => {
    const {
        treatmentPlans,
        setTreatmentPlans,
        treatmentPlanId, setTreatmentPlanId,
        cdtCodes,
        handleAddVisit,
        onDeleteVisit,
        onUpdateVisitsInTreatmentPlan
    } = useTreatmentPlan();

    const [inputText, setInputText] = useState('');

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    useEffect(() => {
        if (treatmentPlanId) {
            getTreatmentPlanById(treatmentPlanId, setTreatmentPlanId);
        }
    }, [treatmentPlanId]);

    const handleGenerateTreatmentPlan = async () => {
        const lines = inputText.split('\n');
        const planPromises = lines.map(async line => {
            const lineParts = line.trim().split(' ');
            const toothNumber = parseInt(lineParts[0].replace('#', '')); // Extract tooth number

            const subcategory = lineParts.slice(1).join(' ');
            console.log("Parsed Tooth Number:", toothNumber, "Subcategory:", subcategory); 

            if (subcategory) {
                const plans = await getTreatmentPlansBySubcategory(subcategory);
                if (plans && plans.length > 0) {
                    const plan = plans[0];
                    return { ...plan, tooth_number: toothNumber }; // Add tooth number to the plan
                }
            }
            return null;
        });

        const newTreatmentPlans = (await Promise.all(planPromises)).filter(plan => plan !== null);
        console.log("New Treatment Plans Before Combining:", newTreatmentPlans); 

        const combinedTreatmentPlan = combineTreatmentPlans(newTreatmentPlans);
        setTreatmentPlans([combinedTreatmentPlan]);
    };

    const combineTreatmentPlans = (treatmentPlans) => {
        console.log("Received Treatment Plans in combineTreatmentPlans:", treatmentPlans)
        const combinedVisitsMap = {};

        treatmentPlans.forEach(plan => {
            plan.visits.forEach(visit => {
                if (combinedVisitsMap[visit.visitNumber]) {
                    // Merge cdtCodes of the visit with the same number
                    combinedVisitsMap[visit.visitNumber].cdtCodes = [
                        ...combinedVisitsMap[visit.visitNumber].cdtCodes,
                        ...visit.cdtCodes
                    ];
                } else {
                    // Add the visit as a new entry in the map, making a deep copy
                    combinedVisitsMap[visit.visitNumber] = { ...visit, cdtCodes: [...visit.cdtCodes] };
                }
            });
        });

        // Convert the map to an array sorted by visit number
        const combinedVisits = Object.values(combinedVisitsMap).sort((a, b) => a.visitNumber - b.visitNumber);
        console.log("Final combined visits array:", combinedVisits);

        // Assuming all treatment plans have the same toothNumber for now
        const toothNumber = treatmentPlans[0]?.toothNumber;

        // Create a new treatment plan object with the combined visits and toothNumber
        const combinedTreatmentPlan = {
            toothNumber, // Add toothNumber here
            visits: combinedVisits,
        };
        return combinedTreatmentPlan;
    };



    return (
        <div className="dashboard-bottom-inner-row">
            <div className="large-text">Create New TX Plan</div>
            <div className="create-treatment-plan-section rounded-box box-shadow">
                <div className="create-treatment-plan-section-inner">
                    <img src={PenIcon} alt="Edit" />
                    <div className="large-text">What can I help you treatment plan today?</div>
                    <TextField

                        label="Input your text"
                        multiline
                        minRows={3}
                        value={inputText}
                        onChange={handleInputChange}
                        sx={{
                            width: '100%',
                            backgroundColor: 'white',
                            '& label.Mui-focused': {
                                color: '#7777a1',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#ccc',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#7777a1',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#7777a1',
                                },
                            },
                        }}
                    />
                    <RoundedButton
                        text="Generate Treatment Plan"
                        backgroundColor="#7777a1"
                        textColor="white"
                        border={false}
                        width="fit-content"
                        onClick={handleGenerateTreatmentPlan}
                        className="purple-button-hover"
                    />
                </div>
            </div>
            <div className="treatment-plan-output-section rounded-box box-shadow">
                <div className="treatment-plan-output-section-inner">
                    <div className="large-text">Treatment Plan</div>
                    {treatmentPlans.map((plan, index) => (
                        <TreatmentPlanConfiguration
                            key={`treatment-plan-${index}`}
                            treatmentPlan={plan}
                            treatmentPlans={treatmentPlans} 
                            cdtCodes={cdtCodes}
                            onAddVisit={(newVisit) => handleAddVisit(plan.treatmentPlanId, newVisit)}
                            onUpdateVisitsInTreatmentPlan={(updatedVisits) => onUpdateVisitsInTreatmentPlan(plan.treatmentPlanId, updatedVisits)}
                            onDeleteVisit={(deletedVisitId) => onDeleteVisit(plan.treatmentPlanId, deletedVisitId)}
                            showToothNumber={true}
                            isInGenerateTreatmentPlanContext={true} 
                        />
                    ))}

                </div>

            </div>
        </div>
    );
};

export default GenerateTreatmentPlan;
