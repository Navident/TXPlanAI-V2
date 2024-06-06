
import TxViewCustomizationToolbar from "../../../Components/TxViewCustomizationToolbar/index";
import { useState, useEffect } from "react";
import TreatmentPlanOutput from "../../TreatmentPlanOutput/TreatmentPlanOutput";
import {
    StyledContainerWithTableInner,
    StyledLargeText,
    StyledSeparator,
    StyledTitleAndPaymentTotalsContainer,
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

import AudioPopup from "../../../Components/AudioPopup/index";
import { Tabs, Tab, Box } from '@mui/material';

import FindingsTab from './Tabs/FindingsTab/index';
import AllergiesTab from './Tabs/AllergiesTab/index';
import ExtraOralAndIntraOralFindingsTab from './Tabs/ExtraOralAndIntraOralFindingsTab/index';
import MedicalHistoryTab from './Tabs/MedicalHistoryTab/index';
import MedicationsTab from './Tabs/MedicationsTab/index';
import ChiefComplaintTab from './Tabs/ChiefComplaintTab/index';
import OcclusionsTab from './Tabs/OcclusionsTab/index';
import MicIcon from '@mui/icons-material/Mic';
import NotesOutput from './NotesOutput/index';
import ContainerRoundedBox from '../../../Components/Containers/ContainerRoundedBox/index';

import { extractPatientIdFromUrl } from '../../../Utils/helpers';
import { useGetDiseasesForPatientQuery, useGetMedicationsForPatientQuery, useGetAllergiesForPatientQuery } from '../../../Redux/ReduxSlices/OpenDental/openDentalApiSlice';

const SmartNotes = () => {
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
    const [tabValue, setTabValue] = useState(0);



    const patientID = extractPatientIdFromUrl();

    const { data: diseases, isFetching: isFetchingDiseases, isError: isErrorDiseases, error: errorDiseases } = useGetDiseasesForPatientQuery(patientID);
    const { data: medications, isFetching: isFetchingMedications, isError: isErrorMedications, error: errorMedications } = useGetMedicationsForPatientQuery(patientID);

    const { data: allergies, isFetching: isFetchingAllergies, isError: isErrorAllergies, error: errorAllergies } = useGetAllergiesForPatientQuery(patientID);



    useEffect(() => {
        if (diseases) {
            console.log('diseases data:', diseases);
        }
        if (isErrorDiseases) {
            console.error('Error fetching diseases:', errorDiseases);
        }
    }, [diseases, isErrorDiseases, errorDiseases]);



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

    const handleAllRowsUpdate = (newAllRows) => {
        setAllRowsFromChild(newAllRows);
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
        const aiResponse = await fetchOpenAIResponse(inputText);
        console.log("ai response", aiResponse);

        appInsights.trackEvent({
            name: "TreatmentPlan",
            properties: {
                facilityName: facilityName,
                facilityId: facilityId,
                inputText: inputText,
                aiResponse: aiResponse
            }
        });

        const parsedResponse = JSON.parse(aiResponse);
        console.log("parsedResponse", parsedResponse);

        const responseArray = Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse];
        console.log("responseArray", responseArray);

        return responseArray.map((item, index) => ({
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



    const [treatmentsInputText, setTreatmentsInputText] = useState("");
    const handleGenerateTreatmentPlan = async () => {
        console.log("treatmentsInputText when executed", treatmentsInputText);
        if (!treatmentsInputText.trim()) {
            showAlert(
                "error",
                "Please enter some text to generate a treatment plan."
            );
            return;
        }
        setIsLoading(true);
        try {
            const treatmentEntries = await preprocessInputText(treatmentsInputText);
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


    const [currentProcessAudioFile, setCurrentProcessAudioFile] = useState(null);

    const handleMicClick = () => {
        if (!recording) {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(newStream => {
                    setStream(newStream);
                    const recorder = new MediaRecorder(newStream);
                    setMediaRecorder(recorder);
                    recorder.start();
                    setRecording(true);
                    setShowAudioPopup(true);
                    console.log("Recording started");

                    recorder.ondataavailable = async (event) => {
                        if (recorder.state === 'inactive') {
                            const audioFile = new File([event.data], "audio.webm", { type: 'audio/webm' });
                            console.log("Audio recording available for processing:", audioFile);

                            if (currentProcessAudioFile) {
                                console.log("About to process audio file with currentProcessAudioFile function.");
                                await currentProcessAudioFile(audioFile)
                                    .then(() => {
                                        console.log("Audio file processing completed successfully.");
                                    })
                                    .catch(error => {
                                        console.error("Error during audio file processing:", error);
                                    });
                                setShowAudioPopup(false);
                            } else {
                                console.error("No audio processing function is set.");
                            }
                        }
                    };

                    recorder.onstop = () => {
                        console.log("Recording stopped.");
                        newStream.getTracks().forEach(track => track.stop());
                        setStream(null);
                        setRecording(false);
                    };
                }).catch(error => {
                    console.error('Error accessing microphone:', error);
                    showAlert("error", "Failed to access microphone.");
                });
        } else {
            console.log("Already recording or handling previous recording.");
        }
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

    const handleTabChange = (event, newValue) => {
        if (newValue === 7) {  
            console.log("executing generate now");
            handleGenerateTreatmentPlan();
        }
        setTabValue(newValue);
    };

    return (
        <div className="dashboard-bottom-inner-row">
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
            <ContainerRoundedBox showTitle={true} title="Smart Notes">
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="treatment plan tabs"
                    centered
                    textColor="inherit"
                    TabIndicatorProps={{
                        style: {
                            backgroundColor: "#7777a1",
                        },
                    }}
                    sx={{
                        ".Mui-selected": {
                            color: "#7777a1",
                        },
                    }}
                >
                    <Tab label="Chief Complaint" />
                    <Tab label="Medical History" />
                    <Tab label="Medications" />
                    <Tab label="Allergies" />
                    <Tab label="Extra oral and Intra oral Findings" />
                    <Tab label="Occlusions" />
                    <Tab label="Findings" />
                    <Tab label="Generate" />
                </Tabs>
                <div className="create-treatment-plan-section-inner">
                    {tabValue === 0 && <ChiefComplaintTab setAudioProcessingFunction={setCurrentProcessAudioFile} />}
                    {tabValue === 1 && <MedicalHistoryTab setAudioProcessingFunction={setCurrentProcessAudioFile} diseases={diseases} />}
                    {tabValue === 2 && <MedicationsTab setAudioProcessingFunction={setCurrentProcessAudioFile} medications={medications} />}
                    {tabValue === 3 && <AllergiesTab setAudioProcessingFunction={setCurrentProcessAudioFile} allergies={allergies} />}
                    {tabValue === 4 && <ExtraOralAndIntraOralFindingsTab setAudioProcessingFunction={setCurrentProcessAudioFile} />}
                    {tabValue === 5 && <OcclusionsTab setAudioProcessingFunction={setCurrentProcessAudioFile} />}
                    {tabValue === 6 && <FindingsTab setTreatmentsInputText={setTreatmentsInputText} setAudioProcessingFunction={setCurrentProcessAudioFile} />}
                    {tabValue === 7 && <NotesOutput/>}
                </div>
                {tabValue !== 7 && (
                    <MicIcon
                        onClick={() => setShowAudioPopup(true)}
                        style={{
                            cursor: "pointer",
                            width: "40px",
                            height: "auto",
                            zIndex: "999",
                            marginTop: "auto",
                        }}
                    />
                )}
            </ContainerRoundedBox>
            {tabValue === 7 && (
                <div className="treatment-plan-output-section rounded-box box-shadow">
                    <TxViewCustomizationToolbar allRows={allRowsFromChild} />
                    <StyledSeparator customMarginTop="0px" />
                    <StyledContainerWithTableInner>
                        {treatmentPlans.length > 0 && !isLoading && (
                            <StyledTitleAndPaymentTotalsContainer>
                                <div style={{ flex: 1 }}></div>
                                <StyledLargeText>Treatment Plan</StyledLargeText>
                                <div style={{ flex: 1 }}></div>
                            </StyledTitleAndPaymentTotalsContainer>
                        )}
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
                                <TreatmentPlanOutput
                                    key={`treatment-plan-${index}`}
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
                            ))
                        ) : (
                            <EmptyStatePlaceholder />
                        )}
                    </StyledContainerWithTableInner>
                </div>
            )}
        </div>
    );
};

export default SmartNotes;