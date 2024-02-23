import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import TxViewCustomizationToolbar from "../../../Components/TxViewCustomizationToolbar/index";

import { TextField } from "@mui/material";
import PenIcon from "../../../assets/pen-icon.svg";
import { useState, useEffect } from "react";
import TreatmentPlanOutput from "../../TreatmentPlanOutput/TreatmentPlanOutput";
import useTreatmentPlan from "../../../Contexts/TreatmentPlanContext/useTreatmentPlan";
import { getTreatmentPlanById } from "../../../ClientServices/apiService";
import { useBusiness } from "../../../Contexts/BusinessContext/useBusiness";
import { StyledContainerWithTableInner, StyledLargeText, StyledSeparator } from "../../../GlobalStyledComponents";
import { runGeminiPro } from "../../../GeminiPro/geminiProRunner";
import { CircularProgress } from "@mui/material";
import useSortContext from '../../../Contexts/SortContext/useSortContext';

const GenerateTreatmentPlan = () => {
    const {
        treatmentPlans,
        setTreatmentPlans,
        treatmentPlanId,
        setTreatmentPlan,
        cdtCodes,
        handleAddVisit,
        onDeleteVisit,
        onUpdateVisitsInTreatmentPlan,
        selectedPayer,
        showAlert,
    } = useTreatmentPlan();
    const { alignment } = useSortContext();

    const [inputText, setInputText] = useState("");

    const {
        fetchFacilityPayerCdtCodeFees,
        selectedPatient,
        subcategoryTreatmentPlans
    } = useBusiness();

    const [isLoading, setIsLoading] = useState(false);
    


    useEffect(() => {
        if (treatmentPlanId) {
            getTreatmentPlanById(treatmentPlanId).then((fetchedPlan) => {
                if (fetchedPlan) {
                    setTreatmentPlan(fetchedPlan);
                }
            });
        }
    }, [treatmentPlanId, setTreatmentPlans]);

    useEffect(() => {
        if (selectedPayer) {
            fetchFacilityPayerCdtCodeFees(selectedPayer.payerId);
        }
    }, [selectedPayer]);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    // Utility function to preprocess input text and maintain order
    async function preprocessInputText(inputText) {
        console.log("inputText sent to ai", inputText);
        const aiResponse = await runGeminiPro(inputText);
        console.log("aiResponsePreprocessedInputText", aiResponse);
        const parsedResponse = JSON.parse(aiResponse);
        console.log("parsedResponse", parsedResponse);

        return parsedResponse.map((item, index) => ({
            ...item,
            originalOrder: index 
        }));
    }


    // Utility function to fetch and process treatments with order maintained
    async function fetchAndProcessTreatments(treatmentEntries, subcategoryTreatmentPlans) {
        console.log("Treatment entries (with original order):", treatmentEntries);
        console.log("subcategoryTreatmentPlans:", subcategoryTreatmentPlans);
        let allVisits = [];
        let globalVisitIdCounter = 0;

        // Preprocess subcategoryTreatmentPlans into a Map
        const plansMap = new Map(subcategoryTreatmentPlans.map(plan => [
            plan.procedureSubCategoryName.toLowerCase(), plan
        ]));

        for (const item of treatmentEntries) {
            const { toothNumber, treatments, originalOrder } = item;

            for (const [treatmentIndex, treatment] of treatments.entries()) {
                const plan = plansMap.get(treatment.toLowerCase());
                if (plan) {
                    const clonedVisits = plan.visits.map(visit => ({
                        ...visit,
                        visitId: `custom-${originalOrder}-${treatmentIndex}-${globalVisitIdCounter++}`,
                        cdtCodes: visit.cdtCodes.map(cdtCode => ({ ...cdtCode, toothNumber })),
                        originLineIndex: originalOrder,
                        procedureCategoryName: plan.procedureCategoryName,
                    }));

                    allVisits.push(...clonedVisits);
                }
            }
        }

        allVisits.sort((a, b) => a.originLineIndex - b.originLineIndex || a.visitNumber - b.visitNumber);
        return allVisits;
    }


    function combineVisitsIntoOne(allVisits) {
        let combinedCdtCodes = [];
        let originalCategories = {};
        allVisits.forEach(visit => {
            visit.cdtCodes.forEach(cdtCode => {
                let cdtCodeWithCategory = {
                    ...cdtCode,
                    originLineIndex: visit.originLineIndex,
                    visitNumber: visit.visitNumber,
                    orderWithinVisit: cdtCode.order,
                    procedureCategoryName: visit.procedureCategoryName // Store the category name with each code
                };
                combinedCdtCodes.push(cdtCodeWithCategory);

                // Map each CDT code to its original category
                if (!originalCategories[cdtCode.visitCdtCodeMapId]) {
                    originalCategories[cdtCode.visitCdtCodeMapId] = visit.procedureCategoryName;
                }
            });
        });

        // Sort combinedCdtCodes by originLineIndex, visitNumber, and then by orderWithinVisit
        combinedCdtCodes.sort((a, b) =>
            a.originLineIndex - b.originLineIndex ||
            a.visitNumber - b.visitNumber ||
            a.orderWithinVisit - b.orderWithinVisit
        );

        return {
            visitId: 'combined',
            description: 'Combined Visit',
            cdtCodes: combinedCdtCodes,
            originLineIndex: 0,
            originalCategories 
        };
    }

    function combineVisitsByCategory(allVisits) {
        // Step 1: Group visits by procedureCategoryName
        const categoryGroups = allVisits.reduce((acc, visit) => {
            const categoryName = visit.procedureCategoryName;
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(visit);
            return acc;
        }, {});

        // Step 2: Combine cdtCodes within each category group into a single visit
        const combinedVisitsByCategory = Object.keys(categoryGroups).map((categoryName, index) => {
            let combinedCdtCodes = [];
            let originLineIndexes = [];

            categoryGroups[categoryName].forEach(visit => {
                visit.cdtCodes.forEach(cdtCode => {
                    combinedCdtCodes.push({
                        ...cdtCode,
                        originLineIndex: visit.originLineIndex,
                        visitNumber: visit.visitNumber,
                        orderWithinVisit: cdtCode.order
                    });
                    if (!originLineIndexes.includes(visit.originLineIndex)) {
                        originLineIndexes.push(visit.originLineIndex);
                    }
                });
            });

            // Sort combinedCdtCodes
            combinedCdtCodes.sort((a, b) =>
                a.originLineIndex - b.originLineIndex ||
                a.visitNumber - b.visitNumber ||
                a.orderWithinVisit - b.orderWithinVisit
            );

            const combinedOriginLineIndex = Math.min(...originLineIndexes);

            return {
                visitId: `combined-${categoryName}-${index}`,
                description: `Combined Visit for ${categoryName}`,
                cdtCodes: combinedCdtCodes,
                originLineIndex: combinedOriginLineIndex,
                procedureCategoryName: categoryName
            };
        });

        return combinedVisitsByCategory; 
    }


    // Main function to generate treatment plan
    const handleGenerateTreatmentPlan = async () => {
        if (!inputText.trim()) {
            showAlert("error", "Please enter some text to generate a treatment plan.");
            return;
        }
        if (!selectedPatient) {
            showAlert("error", "Please select a patient before generating a treatment plan.");
            return;
        }

        setIsLoading(true);

        try {
            const treatmentEntries = await preprocessInputText(inputText);
            const allVisits = await fetchAndProcessTreatments(treatmentEntries, subcategoryTreatmentPlans);
            let combinedTreatmentPlan;
            if (alignment === 'category') {
                const combinedVisits = combineVisitsByCategory(allVisits);
                combinedTreatmentPlan = { visits: combinedVisits };
            } else {
                const combinedVisit = combineVisitsIntoOne(allVisits);
                combinedTreatmentPlan = { visits: [combinedVisit] }; 
            }

            console.log("Final Consolidated Treatment Plan:", combinedTreatmentPlan);
            setTreatmentPlans([combinedTreatmentPlan]);
        } catch (error) {
            showAlert("error", "An error occurred while generating the treatment plan.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderTextField = () => (
        <TextField
            label="Input your text"
            multiline
            minRows={3}
            value={inputText}
            onChange={handleInputChange}
            sx={{
                width: "100%",
                backgroundColor: "white",
                "& label.Mui-focused": {
                    color: "#7777a1",
                },
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                        borderColor: "#7777a1",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#7777a1",
                    },
                },
            }}
        />
    );

    const renderRoundedButton = () => (
        <RoundedButton
            text="Generate Treatment Plan"
            backgroundColor="#7777a1"
            textColor="white"
            border={false}
            width="fit-content"
            onClick={handleGenerateTreatmentPlan}
            className="purple-button-hover"
        />
    );

    return (
        <div className="dashboard-bottom-inner-row">
            <div className="large-text">Create New TX Plan</div>
            <div className="create-treatment-plan-section rounded-box box-shadow">
                <div className="create-treatment-plan-section-inner">
                    <img src={PenIcon} alt="Edit" />
                    <div className="large-text">
                        What can I help you treatment plan today?
                    </div>
                    {renderTextField()}
                    {renderRoundedButton()}
                </div>
            </div>
            <div className="treatment-plan-output-section rounded-box box-shadow">

                <TxViewCustomizationToolbar />
                <StyledSeparator customMarginTop="0px" />
                    <StyledContainerWithTableInner>

                    <StyledLargeText textAlign="center">Treatment Plan</StyledLargeText>
                        {isLoading ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                }}
                            >
                                <CircularProgress style={{ color: "#7777a1" }} />
                            </div>
                        ) : (
                            treatmentPlans.map((plan, index) => (
                                <TreatmentPlanOutput
                                    key={`treatment-plan-${index}`}
                                    treatmentPlan={plan}
                                    treatmentPlans={treatmentPlans}
                                    cdtCodes={cdtCodes}
                                    onAddVisit={(newVisit) =>
                                        handleAddVisit(plan.treatmentPlanId, newVisit)
                                    }
                                    onUpdateVisitsInTreatmentPlan={(updatedVisits) =>
                                        onUpdateVisitsInTreatmentPlan(
                                            plan.treatmentPlanId,
                                            updatedVisits
                                        )
                                    }
                                    onDeleteVisit={(deletedVisitId) =>
                                        onDeleteVisit(plan.treatmentPlanId, deletedVisitId)
                                    }
                                    showToothNumber={true}
                                    isInGenerateTreatmentPlanContext={true}
                                />
                            ))
                        )}
                    </StyledContainerWithTableInner>

            </div>
        </div>
    );
};

export default GenerateTreatmentPlan;
