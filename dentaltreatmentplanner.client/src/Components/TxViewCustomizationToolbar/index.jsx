import {
    StyledTxToolbarContainer,
    StyledPrintImportButton,
    StyledPrintSaveBtnContainer,
    StyledFlexAlignContainer,
    StyledPrintImportBtnContainer,
    StyledPrintExportBtnWithText
} from "./index.style";
import DropdownSearch from "../Common/DropdownSearch/DropdownSearch";
import CategoryFilters from "./CategoryFilters/index";
import RoundedButton from "../../Components/Common/RoundedButton/RoundedButton";
import { UI_COLORS } from '../../Theme';
import { useState, useEffect, useRef } from 'react';
import ToolbarContainer from "../../Components/Containers/ToolbarContainer/index";
import { useSelector, useDispatch } from 'react-redux';
import {
    selectSortBy,
    selectInitialRenderComplete,
    toggleGroupActive,
    requestUpdateTreatmentPlan
} from '../../Redux/ReduxSlices/TableViewControls/tableViewControlSlice';
import SaveButtonRow from "../../Components/Common/SaveButtonRow/index";
import printIcon from "../../assets/printer-icon.svg";
import importIcon from "../../assets/import-icon.svg";
import { mapToOpenDentalTreatmentPlanDto } from "../../Utils/Mapping/openDentalMapping";
import { importTreatmentPlanToOpenDental } from '../../ClientServices/apiService';
import {
    selectAllTreatmentPlans,
    updateTreatmentPlanDescription

} from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import { showAlert } from '../../Redux/ReduxSlices/Alerts/alertSlice';
import AlertDialog from "../../Components/Common/PopupAlert/index";

const TxViewCustomizationToolbar = ({ immediateSave = false }) => {
    const dispatch = useDispatch();
    const treatmentPlans = useSelector(selectAllTreatmentPlans);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [textFieldWidth, setTextFieldWidth] = useState('');
    const [alertDialogInputValue, setAlertDialogInputValue] = useState('');


    const handleSaveButtonClick = () => {
        if (immediateSave) {
            // Perform the immediate save 
            console.log('Performing immediate save...');
            dispatch(updateTreatmentPlanDescription({ treatmentPlanId: treatmentPlans[0].treatmentPlanId, description: 'Default Description' })); // Example
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
        setIsDialogOpen(true);
        setCurrentAction('export');
        setDialogTitle("Export Treatment Plan");
        setDialogContent("Please enter the patient ID to export this treatment plan into OpenDental.");
        setTextFieldWidth('75px'); 
    };


    const handleClose = () => {
        setIsDialogOpen(false); // Close the AlertDialog
        setCurrentAction(null); // Reset the current action
        setDialogTitle(''); // Reset dialog title
        setDialogContent(''); // Reset dialog content
        setAlertDialogInputValue(''); // Reset the input field
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
        // here we map the treatment plan to the dto 
        const patientIdIntInputValue = parseInt(inputValue, 10);
        const openDentalTreatmentPlanDto = mapToOpenDentalTreatmentPlanDto(treatmentPlans, patientIdIntInputValue);

        // sending the entire treatment plan to the backend in one go
        const success = await importTreatmentPlanToOpenDental(openDentalTreatmentPlanDto);

        if (success) {
            console.log("Treatment plan imported successfully.");
            dispatch(showAlert({ type: 'success', message: 'Treatment plan was successfully imported into your EHR!' }));
        } else {
            console.error("Failed to import treatment plan.");
            dispatch(showAlert({ type: 'error', message: 'Failed to import into your EHR' }));

        }
    };

    return (
        <>
            <AlertDialog
                title={dialogTitle}
                content={dialogContent}
                open={isDialogOpen}
                onClose={handleClose}
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
                <StyledFlexAlignContainer justify="center">
                    <CategoryFilters />
                </StyledFlexAlignContainer>
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