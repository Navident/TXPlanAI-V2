import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import { TextField } from "@mui/material";
import PenIcon from '../../../assets/pen-icon.svg';
import { useState, useEffect } from 'react';
import { getTreatmentPlansBySubcategory } from '../../../ClientServices/apiService';
import TreatmentPlanOutput from '../../TreatmentPlanOutput/TreatmentPlanOutput';
import useTreatmentPlan from '../../../Contexts/TreatmentPlanContext/useTreatmentPlan';
import { generateTreatmentPlan, getTreatmentPlanById } from '../../../ClientServices/apiService';
import { useBusiness } from '../../../Contexts/BusinessContext/useBusiness';
import { StyledContainerWithTableInner } from '../../../GlobalStyledComponents';

const GenerateTreatmentPlan = () => {
    const {
        treatmentPlans,
        setTreatmentPlans,
        treatmentPlanId,
        setTreatmentPlanId,
        cdtCodes,
        handleAddVisit,
        onDeleteVisit,
        onUpdateVisitsInTreatmentPlan,
        selectedPayer,
        showAlert,
    } = useTreatmentPlan(); 

    const [inputText, setInputText] = useState('');
    const { fetchFacilityPayerCdtCodeFees, selectedPatient, facilityPayerCdtCodeFees } = useBusiness(); 

    useEffect(() => {
        if (treatmentPlanId) {
            getTreatmentPlanById(treatmentPlanId).then(fetchedPlan => {
                setTreatmentPlanId(fetchedPlan);
            });
        }
    }, [treatmentPlanId]);

    useEffect(() => {
        if (selectedPayer) {
            fetchFacilityPayerCdtCodeFees(selectedPayer.payerId);
        }
    }, [selectedPayer]);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const parseLineToPlan = async (line, lineIndex) => {
        const lineParts = line.trim().split(' ');
        const toothNumber = parseInt(lineParts[0].replace('#', ''));
        const subcategory = lineParts.slice(1).join(' ');

        const plans = await getTreatmentPlansBySubcategory(subcategory);
        if (plans && plans.length > 0) {
            return { ...plans[0], toothNumber, lineIndex };
        }
        return null;
    };

    const handleGenerateTreatmentPlan = async () => {
        if (!inputText.trim()) {
            return;
        }
        if (!selectedPatient) {
            showAlert('error', 'Please select a patient before generating a treatment plan.');
            return; 
        }
        const lines = inputText.split('\n');
        const planPromises = lines.map((line, index) => parseLineToPlan(line, index));
        let newTreatmentPlans = (await Promise.all(planPromises)).filter(plan => plan !== null);

        if (newTreatmentPlans.length === 0) {
            return;
        }

        // Insert tooth number into each cdtCodeMap where it's null
        newTreatmentPlans = newTreatmentPlans.map(plan => {
            const updatedVisits = plan.visits.map(visit => {
                const updatedCdtCodes = visit.cdtCodes.map(cdtCodeMap => {
                    // Only update if toothNumber is null or undefined
                    if (cdtCodeMap.toothNumber == null) {
                        return { ...cdtCodeMap, toothNumber: plan.toothNumber };
                    }
                    return cdtCodeMap;
                });
                return { ...visit, cdtCodes: updatedCdtCodes };
            });
            return { ...plan, visits: updatedVisits };
        });

        setTreatmentPlans([...newTreatmentPlans]);
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
                    <StyledContainerWithTableInner>
                    <div className="large-text">Treatment Plan</div>
                    {treatmentPlans.map((plan, index) => (
                        <TreatmentPlanOutput
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
                    </StyledContainerWithTableInner>
                </div>

            </div>
        </div>
    );
};

export default GenerateTreatmentPlan;
