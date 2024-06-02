import {
    StyledPrintImportButton,
    StyledPrintSaveBtnContainer,
    StyledFlexAlignContainer,
    StyledPrintImportBtnContainer,
    StyledPrintExportBtnWithText
} from "./index.style";
import CategoryFilters from "./CategoryFilters/index";
import RoundedButton from "../../Components/Common/RoundedButton/RoundedButton";
import { UI_COLORS } from '../../Theme';
import { useState, useEffect, useRef } from 'react';
import ToolbarContainer from "../../Components/Containers/ToolbarContainer/index";
import { useSelector, useDispatch } from 'react-redux';
import {
    toggleGroupActive,
    requestUpdateTreatmentPlan
} from '../../Redux/ReduxSlices/TableViewControls/tableViewControlSlice';

import { mapToOpenDentalTreatmentPlanDtoByAllRows } from "../../Utils/Mapping/openDentalMapping";
import {
    selectAllTreatmentPlans,
    updateTreatmentPlanDescription

} from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import { showAlert } from '../../Redux/ReduxSlices/Alerts/alertSlice';
import AlertDialog from "../../Components/Common/PopupAlert/index";
import { useImportTreatmentPlanToOpenDentalMutation, useCreateProcedureLogMutation, useCreateProcNoteMutation } from '../../Redux/ReduxSlices/OpenDental/openDentalApiSlice';
import { Backdrop, CircularProgress } from '@mui/material';

import { extractPatientIdFromUrl } from '../../Utils/helpers';
import { formatNotes } from '../../Utils/noteUtils';

import {
    selectChiefComplaint,
    selectMedicalHistory,
    selectMedications,
    selectAllergies,
    selectExtraOralAndIntraOralFindings,
    selectOcclusions,
    selectFindings
} from '../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';

/*    const handleSaveButtonClick = () => {
        if (immediateSave) {
            // Perform the immediate save 
            console.log('Performing immediate save...');
            dispatch(updateTreatmentPlanDescription({ treatmentPlanId: treatmentPlans[0].treatmentPlanId, description: 'Default Description' })); 
            dispatch(requestUpdateTreatmentPlan());
        } else {
            // Popup before save 
            setIsDialogOpen(true);
            setCurrentAction('save');
             setDialogContent("Please enter a short description for this treatment plan. This description will allow you to identify it later.");
            setTextFieldWidth('100%');
        }
    };*/


const TxViewCustomizationToolbar = ({ immediateSave = false, allRows, hideGroupBtnAndFilters }) => {
    const dispatch = useDispatch();
    const treatmentPlans = useSelector(selectAllTreatmentPlans);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [textFieldWidth, setTextFieldWidth] = useState('');
    const [alertDialogInputValue, setAlertDialogInputValue] = useState('');

    const [importTreatmentPlanToOpenDental, { isLoading, isError, isSuccess }] = useImportTreatmentPlanToOpenDentalMutation();

    const [createProcedureLog] = useCreateProcedureLogMutation();

    const [createProcNote] = useCreateProcNoteMutation();


    const chiefComplaint = useSelector(selectChiefComplaint);
    const medicalHistory = useSelector(selectMedicalHistory);
    const medications = useSelector(selectMedications);
    const allergies = useSelector(selectAllergies);
    const extraOralAndIntraOralFindings = useSelector(selectExtraOralAndIntraOralFindings);
    const occlusions = useSelector(selectOcclusions);
    const findings = useSelector(selectFindings);


    const handleExportClick = () => {
        const patientID = extractPatientIdFromUrl();
        setAlertDialogInputValue(patientID || ''); // If patientID is not found, fallback to an empty string
        setIsDialogOpen(true);
        setCurrentAction('export');
        setDialogTitle("Export Treatment Plan");
        setDialogContent("Please enter the patient ID to export this treatment plan into OpenDental.");
        setTextFieldWidth('75px');
    };




    const handleClose = () => {
        setIsDialogOpen(false);
 
    };


    const handleConfirmSaveClick = (inputValue) => {
        console.log('User input:', inputValue);
        dispatch(updateTreatmentPlanDescription({ treatmentPlanId: treatmentPlans[0].treatmentPlanId, description: inputValue }));
        dispatch(requestUpdateTreatmentPlan());
        setIsDialogOpen(false);
    };

    const handleGroupClick = () => {
        dispatch(toggleGroupActive());
    };

    const handleAgreeExportClick = async (inputValue) => {
        const patientIdIntInputValue = parseInt(inputValue, 10);
        const openDentalTreatmentPlanDto = mapToOpenDentalTreatmentPlanDtoByAllRows(allRows, patientIdIntInputValue);

        const { sNotes, oNotes, aNotes, pNotes } = formatNotes(chiefComplaint, medicalHistory, medications, allergies, extraOralAndIntraOralFindings, occlusions, findings);
        const fullNote = `${sNotes}\n${oNotes}\n${aNotes}\n${pNotes}`;
        console.log("fullnote before export", fullNote);

        try {
            const procedureLogCreateRequest = {
                PatNum: patientIdIntInputValue,
                ProcDate: new Date().toISOString().split('T')[0], // Current date in yyyy-MM-dd format
                ProcStatus: 'C', 
                procCode: 'D0150',
                Surf: "",
                dxName: "",
                ToothNum: "",
                ToothRange: ""
            };
            
            await createProcedureLog(procedureLogCreateRequest).unwrap();
            console.log("Procedure log created successfully.");

            const procedureLogResponse = await createProcedureLog(procedureLogCreateRequest).unwrap();
            console.log("Procedure log created successfully:", procedureLogResponse);

            const procNum = procedureLogResponse.procNum; 
            console.log("Extracted ProcNum:", procNum);

            // Proceed with creating the procedure note using the extracted ProcNum
            const procNoteCreateRequest = {
                PatNum: patientIdIntInputValue,
                ProcNum: procNum, 
                Note: fullNote
            };

            await createProcNote(procNoteCreateRequest).unwrap();
            console.log("Procedure note created successfully.");

            await importTreatmentPlanToOpenDental(openDentalTreatmentPlanDto).unwrap();
            console.log("Treatment plan imported successfully.");

            dispatch(showAlert({ type: 'success', message: 'Treatment plan and procedure log were successfully exported into your EHR!' }));
        } catch (error) {
            console.error("Failed to export treatment plan and create procedure log.", error);
            dispatch(showAlert({ type: 'error', message: 'Failed to export into your EHR' }));
        }
    };

    return (
        <>
            <Backdrop open={isLoading} style={{ zIndex: 1000 }}>
                <CircularProgress style={{ color: 'rgb(162, 225, 201)' }} />
            </Backdrop>
            <AlertDialog
                title={dialogTitle}
                content={dialogContent}
                open={isDialogOpen}
                onClose={handleClose}
                TransitionProps={{
                    onExited: () => {
                        // Reset dialog content after the exit transition has completed
                        setCurrentAction(null);
                        setDialogTitle('');
                        setDialogContent('');
                        setAlertDialogInputValue('');
                    }
                }}
                onAgree={() => {
                    if (currentAction === 'save') {
                        handleConfirmSaveClick(alertDialogInputValue);
                    } else if (currentAction === 'export') {
                        handleAgreeExportClick(alertDialogInputValue);
                    }
                }}
                onInputChange={(e) => setAlertDialogInputValue(e.target.value)} 
                inputValue={alertDialogInputValue}
                textInput={true}
                textInputWidth={textFieldWidth}
            />

            <ToolbarContainer>
                {!hideGroupBtnAndFilters && (
                    <StyledFlexAlignContainer justify="flex-start">
                        <RoundedButton
                            text="Group"
                            onClick={handleGroupClick}
                            backgroundColor={UI_COLORS.light_grey2}
                            textColor="white"
                            border={false}
                            borderRadius="4px"
                            height="39px"
                            width="150px"
                        />
                    </StyledFlexAlignContainer>
                )}
                {!hideGroupBtnAndFilters && (
                    <StyledFlexAlignContainer justify="center">
                        <CategoryFilters />
                    </StyledFlexAlignContainer>
                )}
                <StyledFlexAlignContainer justify="flex-end">
                    <StyledPrintSaveBtnContainer>
                        <RoundedButton
                            text="Export"
                            backgroundColor={UI_COLORS.green}
                            textColor="white"
                            border={false}
                            width="150px"
                            minWidth="150px"
                            className="green-button-hover"
                            onClick={handleExportClick}
                            borderRadius="4px"
                            height="39px"
                        />
                    </StyledPrintSaveBtnContainer>
                </StyledFlexAlignContainer>
            </ToolbarContainer>
        </>
    );
};

export default TxViewCustomizationToolbar;