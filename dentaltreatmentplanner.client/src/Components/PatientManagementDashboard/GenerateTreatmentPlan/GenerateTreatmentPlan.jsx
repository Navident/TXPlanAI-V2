import RoundedButton from "../../Common/RoundedButton/RoundedButton";
import { TextField } from "@mui/material";
import PenIcon from '../../../assets/pen-icon.svg';
import { useState, useEffect } from 'react';
import { getTreatmentPlansBySubcategory } from '../../../ClientServices/apiService';
import TreatmentPlanOutput from '../../TreatmentPlanOutput/TreatmentPlanOutput';
import useTreatmentPlan from '../../../Contexts/TreatmentPlanContext/useTreatmentPlan';
import { generateTreatmentPlan, getTreatmentPlanById } from '../../../ClientServices/apiService';
import { sortCrowns } from '../../SortingLogic/CrownsSorting'
import { sortSingleImplants } from '../../SortingLogic/SingleImplantSorting'
import { sortRootCanals } from '../../SortingLogic/RootCanalsSorting'

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

    const sortingFunctions = {
        'Crowns': sortCrowns,
        'Single Implants': sortSingleImplants,
        'Root Canals': sortRootCanals,
    };

    useEffect(() => {
        if (treatmentPlanId) {
            getTreatmentPlanById(treatmentPlanId, setTreatmentPlanId);
        }
    }, [treatmentPlanId]);

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
        const lines = inputText.split('\n');
        const planPromises = lines.map((line, index) => parseLineToPlan(line, index));
        const newTreatmentPlans = (await Promise.all(planPromises)).filter(plan => plan !== null);

        if (newTreatmentPlans.length === 0) {
            return;
        }
        const procedureCategoryName = newTreatmentPlans.length > 0 ? newTreatmentPlans[0].procedureCategoryName : null;

        const sortFunction = sortingFunctions[procedureCategoryName];

        const combinedTreatmentPlan = constructSortedTreatmentPlan(newTreatmentPlans, sortFunction);

        setTreatmentPlans([combinedTreatmentPlan]);
    };

    //function to flatten visits from treatment plans
    const flattenVisitsFromPlans = (treatmentPlans) => {
        return treatmentPlans.flatMap(plan => plan.visits.map(visit => {
            visit.cdtCodes.forEach(cdtCodeMap => {
                cdtCodeMap.toothNumber = plan.toothNumber;
                cdtCodeMap.uniqueId = `${plan.lineIndex}-${visit.visitId}`;
                cdtCodeMap.procedureOrder = cdtCodeMap.order;
            });
            return {
                ...visit,
                uniqueId: `${plan.lineIndex}-${visit.visitId}`,
                treatmentPhaseLabel: visit.cdtCodes[0]?.treatmentPhaseLabel || 'Unknown Phase',
                procedureOrder: visit.cdtCodes[0]?.order || 0,
            };
        }));
    };

    //function to regroup visits by phase and number them
    const regroupAndNumberVisits = (allVisits) => {
        const combinedPhasesMap = {};
        allVisits.forEach(visit => {
            const phase = visit.treatmentPhaseLabel;
            if (!combinedPhasesMap[phase]) {
                combinedPhasesMap[phase] = [];
            }
            combinedPhasesMap[phase].push(visit);
        });

        let visitCounter = 1;
        Object.values(combinedPhasesMap).forEach(phaseVisits => {
            phaseVisits.forEach(visit => {
                visit.visitNumber = visitCounter++;
            });
        });
        return combinedPhasesMap;
    };

    const constructSortedTreatmentPlan = (treatmentPlans, sortFunction) => {
        let allVisits = flattenVisitsFromPlans(treatmentPlans); 
        allVisits = sortFunction(allVisits);
        const phases = regroupAndNumberVisits(allVisits);

        return { phases };
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

                </div>

            </div>
        </div>
    );
};

export default GenerateTreatmentPlan;
