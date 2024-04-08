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
import SaveButtonRow from "../../Components/Common/SaveButtonRow/index";
import printIcon from "../../assets/printer-icon.svg";
import importIcon from "../../assets/import-icon.svg";
import { mapToOpenDentalTreatmentPlanDtoByAllRows } from "../../Utils/Mapping/openDentalMapping";
import {
    selectAllTreatmentPlans,
    updateTreatmentPlanDescription

} from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import { showAlert } from '../../Redux/ReduxSlices/Alerts/alertSlice';
import AlertDialog from "../../Components/Common/PopupAlert/index";
import { useImportTreatmentPlanToOpenDentalMutation } from '../../Redux/ReduxSlices/OpenDental/openDentalApiSlice';
import { Backdrop, CircularProgress } from '@mui/material';

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


    const extractPatientIdFromUrl = () => {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get('patientid'); 
    };

    const handleSaveButtonClick = () => {
        if (immediateSave) {
            // Perform the immediate save 
            console.log('Performing immediate save...');
            dispatch(updateTreatmentPlanDescription({ treatmentPlanId: treatmentPlans[0].treatmentPlanId, description: 'Default Description' })); 
            dispatch(requestUpdateTreatmentPlan());
        } else {
            // Popup before save 
            setIsDialogOpen(true);
            setCurrentAction('save');
            setDialogTitle("Save Treatment Plan");
            setDialogContent("Please enter a short description for this treatment plan. This description will allow you to identify it later.");
            setTextFieldWidth('100%');
        }
    };


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
        //const patientIdIntInputValue = parseInt(inputValue, 10);
        //const patientObject = filteredPatients.find(p => p.patientId === patientIdIntInputValue);

/*        if (patientObject) {
            // If a matching patient is found, dispatch setSelectedPatient with the patient object
            dispatch(setSelectedPatient(patientObject));
            console.log('User input:', patientIdIntInputValue);
            setIsDialogOpen(false);
            dispatch(requestUpdateTreatmentPlan());
        } else {
            // Handle the case where no patient is found by the given ID
            console.error('No patient found with ID:', patientIdIntInputValue);
        }*/
    };

    const handleGroupClick = () => {
        dispatch(toggleGroupActive());
    };


    const handleAgreeExportClick = async (inputValue) => {
        const patientIdIntInputValue = parseInt(inputValue, 10);
        const openDentalTreatmentPlanDto = mapToOpenDentalTreatmentPlanDtoByAllRows(allRows, patientIdIntInputValue);

        try {
            await importTreatmentPlanToOpenDental(openDentalTreatmentPlanDto).unwrap();
            console.log("Treatment plan imported successfully.");
            dispatch(showAlert({ type: 'success', message: 'Treatment plan was successfully imported into your EHR!' }));
        } catch (error) {
            console.error("Failed to import treatment plan.", error);
            dispatch(showAlert({ type: 'error', message: 'Failed to import into your EHR' }));
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
                        <StyledPrintImportBtnContainer>
                            <StyledPrintExportBtnWithText>
                                <div>Print</div>
                                <StyledPrintImportButton src={printIcon} alt="Print Icon" title="Print TX Plan" /> 
                            </StyledPrintExportBtnWithText>
                            
                            <StyledPrintExportBtnWithText>
                                <div>Export</div>
                                <StyledPrintImportButton src={importIcon} alt="import Icon" title="Export to EHR" height="30px" onClick={handleExportClick} />
                            </StyledPrintExportBtnWithText>
                        </StyledPrintImportBtnContainer>
                        <SaveButtonRow onSave={handleSaveButtonClick} />
                    </StyledPrintSaveBtnContainer>
                </StyledFlexAlignContainer>
            </ToolbarContainer>
        </>
    );
};

export default TxViewCustomizationToolbar;