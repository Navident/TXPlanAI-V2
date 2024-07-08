import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import MultilineTextfield from "../../../Components/Common/MultilineTextfield/index";
import TxViewCustomizationToolbar from "../../../Components/TxViewCustomizationToolbar/index";
import PatientInfoSection from "../../../Components/PatientInfoSection/PatientInfoSection";

import PenIcon from "../../../assets/pen-icon.svg";
import { useState, useEffect, useRef } from "react";
import TreatmentPlanOutput from "../../TreatmentPlanOutput/TreatmentPlanOutput";
import {
    StyledContainerWithTableInner,
    StyledLargeText,
    StyledSeparator,
    StyledTitleAndPaymentTotalsContainer
} from "../../../GlobalStyledComponents";
import { fetchOpenAIResponse } from "../../../OpenAI/LLM/gptRunner";
import { CircularProgress } from "@mui/material";
import {
    setActiveTxCategories,
    resetCategoryFilters
} from "../../../Redux/ReduxSlices/TableViewControls/tableViewControlSlice";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from '../../../Redux/ReduxSlices/Alerts/alertSlice';
import {
    setTreatmentPlans,
    handleAddVisit,
    onUpdateVisitsInTreatmentPlan,
    onDeleteVisit,
    selectAllTreatmentPlans
} from '../../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import appInsights from '../../../Utils/appInsights';
import {
    selectFacilityName,
    selectFacilityId,
    selectIsUserLoggedIn
} from '../../../Redux/ReduxSlices/User/userSlice';
import EmptyStatePlaceholder from '../../../Components/Common/EmptyStatePlaceholder';
import { useGetAllSubcategoryTreatmentPlansQuery } from '../../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansApiSlice';
import LoginPopup from '../../../Components/Common/LoginPopup';
import MicIcon from '@mui/icons-material/Mic';
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../OpenAI/Whisper/whisperService";
import AudioPopup from "../../../Components/AudioPopup/index";
import { selectGrandUcrTotal, selectGrandCoPayTotal, selectAreGrandTotalsReady, setAlternativeProcedures } from '../../../Redux/ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice';
import PaymentTotals from "../../../Components/PaymentTotals/index";

const GenerateTreatmentPlan = () => {
    const dispatch = useDispatch();
    const { data: subcategoryTreatmentPlans, refetch } = useGetAllSubcategoryTreatmentPlansQuery();
    const treatmentPlans = useSelector(selectAllTreatmentPlans);
    const [isLoading, setIsLoading] = useState(false);
    const [inputText, setInputText] = useState("");
    const facilityName = useSelector(selectFacilityName);
    const facilityId = useSelector(selectFacilityId);
    const [allRowsFromChild, setAllRowsFromChild] = useState({});
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [stream, setStream] = useState(null);
    const [showAudioPopup, setShowAudioPopup] = useState(false);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const grandUcrTotal = useSelector(selectGrandUcrTotal);
    const grandCoPayTotal = useSelector(selectGrandCoPayTotal);
    const areGrandTotalsReady = useSelector(selectAreGrandTotalsReady);
    const handleAllRowsUpdate = (newAllRows) => {
        setAllRowsFromChild(newAllRows);
    };

    useEffect(() => {
        return () => {
            dispatch(setTreatmentPlans([]));
        };
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(resetCategoryFilters());
        };
    }, [dispatch]);

    useEffect(() => {
        if (treatmentPlans) {
            console.log("treatmentPlans state in parent", treatmentPlans);
        }
    }, [treatmentPlans]);

    useEffect(() => {
        dispatch(setTreatmentPlans([]));
    }, [dispatch]);

    useEffect(() => {
        if (!isUserLoggedIn) {
            setShowLoginPopup(true);
        } else {
            setShowLoginPopup(false);
            refetch();
        }
    }, [isUserLoggedIn, refetch]);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    function extractActiveTxCategories(visits) {
        const uniqueCategories = visits.reduce((acc, visit) => {
            acc.add(visit.procedureCategoryName);
            return acc;
        }, new Set());

        return Array.from(uniqueCategories);
    }

    function adjustSurfaceValues(toothNumber, surface) {
        const teethNumbersForAdjustment = [6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26, 27];
        const num = parseInt(toothNumber, 10);

        if (teethNumbersForAdjustment.includes(num)) {
            if (typeof surface === 'string') {
                return surface.replace(/B/g, 'F').replace(/O/g, 'I');
            } else {
                return '';
            }
        }
        return surface || '';
    }

    async function preprocessInputText(inputText) {
        console.log("inputText sent to ai", inputText);

        let aiResponse;
        try {
            aiResponse = await fetchOpenAIResponse(inputText);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            throw new Error("Failed to fetch AI response.");
        }

        console.log("ai response", aiResponse);

        // Log the aiResponse to inspect its content
        console.log("Raw AI Response:", aiResponse);

        appInsights.trackEvent({
            name: "TreatmentPlan",
            properties: {
                facilityName: facilityName,
                facilityId: facilityId,
                inputText: inputText,
                aiResponse: aiResponse
            }
        });

        // Split and parse concatenated JSON arrays
        const responseParts = aiResponse.split('\n').filter(part => part.trim() !== '');
        const parsedResponses = [];

        for (const part of responseParts) {
            try {
                const parsedPart = JSON.parse(part);
                parsedResponses.push(...(Array.isArray(parsedPart) ? parsedPart : [parsedPart]));
            } catch (error) {
                console.error("Error parsing part of AI response JSON:", error);
                console.error("AI Response Part Content:", part); // Log the raw response part for debugging
                throw new Error("Failed to parse part of AI response JSON.");
            }
        }

        console.log("parsedResponses", parsedResponses);

        return parsedResponses.map((item, index) => ({
            ...item,
            toothNumber: item.toothNumber ? item.toothNumber.replace('#', '') : '',
            originalOrder: index,
        }));
    }


    async function fetchAndProcessTreatments(treatmentEntries, subcategoryTreatmentPlans) {
        console.log("Treatment entries (with original order):", treatmentEntries);
        console.log(subcategoryTreatmentPlans);
        let allVisits = [];
        let globalVisitIdCounter = 0;
        let nonRepeatableAdded = new Set(); 

        const plansMap = new Map(
            subcategoryTreatmentPlans.map((plan) => [
                plan.procedureSubCategoryName.toLowerCase(),
                plan,
            ])
        );

        for (const item of treatmentEntries) {
            console.log("Processing item:", item);
            const { arch, toothNumber, surface, treatments, originalOrder } = item;

            if (toothNumber === undefined) {
                console.error("Undefined toothNumber found in item:", item);
                continue;
            }

            const adjustedSurface = adjustSurfaceValues(toothNumber, surface);
            const sanitizedToothNumber = typeof toothNumber === 'string' ? toothNumber.replace('#', '') : '';

            for (const [treatmentIndex, treatment] of treatments.entries()) {
                const plan = plansMap.get(treatment.toLowerCase());
                if (plan) {
                    const clonedVisits = plan.visits.map((visit) => ({
                        ...visit,
                        visitId: `custom-${originalOrder}-${treatmentIndex}-${globalVisitIdCounter++}`,
                        VisitToProcedureMapDtos: visit.visitToProcedureMaps.map((procedureMap) => {
                            // Check if the procedureMap is repeatable. If not, ensure it's not already added.
                            if (!procedureMap.repeatable && nonRepeatableAdded.has(procedureMap.visitToProcedureMapId)) {
                                return null; // Skip adding this procedureMap
                            }
                            nonRepeatableAdded.add(procedureMap.visitToProcedureMapId);

                            return {
                                ...procedureMap,
                                procedureToCdtMaps: procedureMap.procedureToCdtMaps.map((cdtMap) => ({
                                    ...cdtMap,
                                    toothNumber: procedureMap.assignToothNumber ? sanitizedToothNumber : null,
                                    surface: adjustedSurface,
                                    arch: procedureMap.assignArch ? arch : null,
                                    originalVisitCategory: plan.procedureCategoryName,
                                })),
                            };
                        }).filter(procedureMap => procedureMap !== null),
                        procedureCategoryName: plan.procedureCategoryName, 
                    }));
                    allVisits.push(...clonedVisits);
                }
            }
        }
        allVisits.sort(
            (a, b) =>
                a.originLineIndex - b.originLineIndex || a.visitNumber - b.visitNumber
        );
        return allVisits;
    }


    function combineVisitsIntoOne(allVisits) {
        let combinedProcedures = [];
        let currentOrder = 0; // This will keep track of the overall order across all visits

        allVisits.forEach((visit, index) => {
            // Sort the procedures within the visit according to their original 'order'
            const sortedVisitProcedures = visit.VisitToProcedureMapDtos.sort((a, b) => a.order - b.order);

            sortedVisitProcedures.forEach((procedureMap) => {
                combinedProcedures.push({
                    ...procedureMap,
                    order: currentOrder++, // Assign and then increment the current order
                    procedureToCdtMaps: procedureMap.procedureToCdtMaps.map(cdtMap => ({
                        ...cdtMap,
                        visitToProcedureMapId: procedureMap.visitToProcedureMapId,
                        originLineIndex: visit.originLineIndex,
                        visitNumber: visit.visitNumber,
                    }))
                });
            });
        });

        // No longer necessary to sort by 'order' here because it is controlled by 'currentOrder'
        return {
            visitId: `temp-${Date.now()}`,
            description: "Table 1",
            visitToProcedureMaps: combinedProcedures,
            originLineIndex: 0,
            visitNumber: 1
        };
    }


    const handleGenerateTreatmentPlan = async () => {
        if (!inputText.trim()) {
            showAlert(
                "error",
                "Please enter some text to generate a treatment plan."
            );
            return;
        }
        setIsLoading(true);
        try {
            const treatmentEntries = await preprocessInputText(inputText);
            console.log("treatmentEntries", treatmentEntries);
            let allVisits = await fetchAndProcessTreatments(
                treatmentEntries,
                subcategoryTreatmentPlans
            );
            console.log("allVisits before combining: ", allVisits);
            const activeTxCategories = extractActiveTxCategories(allVisits);
            dispatch(setActiveTxCategories(activeTxCategories));

            const combinedVisit = combineVisitsIntoOne(allVisits);
            console.log("combinedVisit", combinedVisit);
            const combinedTreatmentPlan = { treatmentPlanId: null, description: null, visits: [combinedVisit] };
            console.log("Final Consolidated Treatment Plan:", combinedTreatmentPlan);
            dispatch(setTreatmentPlans([combinedTreatmentPlan]));
        } catch (error) {
            showAlert(
                "error",
                "An error occurred while generating the treatment plan."
            );
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleMicClick = () => {
        if (!recording) {
            // Stop the previous stream if it's still running
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);  // Ensure the stream is cleared
            }

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(newStream => {
                    setStream(newStream);
                    const recorder = new MediaRecorder(newStream);
                    setMediaRecorder(recorder);
                    recorder.start();
                    setRecording(true);
                    setShowAudioPopup(true);

                    recorder.ondataavailable = async (event) => {
                        if (recorder.state === 'inactive') {
                            const audioFile = new File([event.data], "audio.webm", { type: 'audio/webm' });
                            processAudioFile(audioFile);
                        }
                    };

                    recorder.onstop = () => {
                        setRecording(false);
                        newStream.getTracks().forEach(track => track.stop());
                        setStream(null);
                    };
                }).catch(error => {
                    console.error('Error accessing microphone:', error);
                    showAlert("error", "Failed to access microphone.");
                });
        }
    };



    const processAudioFile = async (audioFile) => {
        const transcribedText = await transcribeAudio(audioFile);
        if (transcribedText) {
            const processedText = await postProcessTranscriptWithGPT(transcribedText);
            console.log("processed text: ", processedText);
            // Append the new processed text onto the next line
            setInputText(prevText => prevText ? `${prevText}\n${processedText}` : processedText);
        }
        setShowAudioPopup(false); // Close the popup after processing
    };


    const stopAndProcessRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop(); 
            // Ensure that all tracks of the stream are stopped
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null); // Clear the stream
            }
            setRecording(false); // Reset recording state
            setShowAudioPopup(false); // close the popup
        }
    };


    const handleClose = () => {
        // close the popup
        setShowAudioPopup(false);
        // Check if the mediaRecorder is recording and stop it if so
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop(); 
            mediaRecorder.ondataavailable = () => { }; // Override the handler to prevent processing
        }
        // Whether it's recording or not, ensure all tracks are stopped
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null); // Clear the stream
        }
        setRecording(false); // Reset recording state
    };


    const treatmentPlanRef = useRef();

    return (
        <div className="dashboard-bottom-inner-row">
            <PatientInfoSection />
            {showLoginPopup && (
                <LoginPopup
                    open={showLoginPopup}
                    onClose={() => setShowLoginPopup(false)}
                />
            )}
            <AudioPopup
                open={showAudioPopup}
                stopRecording={stopAndProcessRecording} 
                onClose={handleClose}
            />

            <div className="create-treatment-plan-section rounded-box box-shadow">
                <div className="create-treatment-plan-section-inner">
                    <img src={PenIcon} alt="Edit" />
                    <div className="large-text">
                        What can I help you treatment plan today?
                    </div>
                    <MultilineTextfield
                        label="Input your treatments"
                        value={inputText}
                        onChange={handleInputChange}
                        onMicClick={handleMicClick}
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
                <TxViewCustomizationToolbar allRows={allRowsFromChild} treatmentPlanRef={treatmentPlanRef} />
                <StyledSeparator customMarginTop="0px" />
                <StyledContainerWithTableInner>

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
                    ) : treatmentPlans.length > 0 ? (
                        treatmentPlans.map((plan, index) => (
                            <div id="treatment-plan-output" key={`treatment-plan-${index}`}>
                                {treatmentPlans.length > 0 && !isLoading && (
                                    <StyledTitleAndPaymentTotalsContainer>
                                        <div style={{ flex: 1 }}></div>
                                        <StyledLargeText>Treatment Plan</StyledLargeText>
                                        <div style={{ flex: 1 }}>
                                            {areGrandTotalsReady && (
                                                <PaymentTotals
                                                    ucrTotal={grandUcrTotal}
                                                    coPayTotal={grandCoPayTotal}
                                                    isGrandTotal={true}
                                                    justifyContent="end"
                                                />
                                            )}
                                        </div>
                                    </StyledTitleAndPaymentTotalsContainer>
                                )}
                                <TreatmentPlanOutput
                                    treatmentPlan={plan}
                                    treatmentPlans={treatmentPlans}
                                    onAddVisit={(newVisit) =>
                                        dispatch(handleAddVisit({ treatmentPlanId: plan.treatmentPlanId, newVisit }))
                                    }
                                    onUpdateVisitsInTreatmentPlan={(treatmentPlanId, updatedVisits) => {
                                        console.log("Dispatching updated visits:", updatedVisits);
                                        dispatch(onUpdateVisitsInTreatmentPlan({ treatmentPlanId, updatedVisits }));
                                    }}
                                    onDeleteVisit={(deletedVisitId) =>
                                        dispatch(onDeleteVisit({ treatmentPlanId: plan.treatmentPlanId, deletedVisitId }))
                                    }
                                    showToothNumber={true}
                                    isInGenerateTreatmentPlanContext={true}
                                    onAllRowsUpdate={handleAllRowsUpdate}
                                />
                            </div>
                        ))
                    ) : (
                        <EmptyStatePlaceholder />
                    )}
                </StyledContainerWithTableInner>
            </div>
        </div>
    );
};

export default GenerateTreatmentPlan;
