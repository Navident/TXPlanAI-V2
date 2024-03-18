import {
    StyledTxToolbarContainer,
    StyledPrintImportButton,
    StyledPrintSaveBtnContainer,
    StyledFlexAlignContainer,
    StyledPrintImportBtnContainer
} from "./index.style";
import DropdownSearch from "../Common/DropdownSearch/DropdownSearch";
import CategoryFilters from "./CategoryFilters/index";
import RoundedButton from "../../Components/Common/RoundedButton/RoundedButton";
import { UI_COLORS } from '../../Theme';
import { useState, useEffect, useRef } from 'react';
import ToggleButtonGroup from "../../Components/Common/ToggleButtonGroup/index";
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
import { selectSelectedPatient, selectFilteredPatients,  setSelectedPatient } from '../../Redux/ReduxSlices/Patients/patientsSlice';
import { showAlert } from '../../Redux/ReduxSlices/Alerts/alertSlice';
import AlertDialog from "../../Components/Common/PopupAlert/index";

const TxViewCustomizationToolbar = () => {
    const dispatch = useDispatch();
    const [isSticky, setIsSticky] = useState(false);
    const toolbarRef = useRef(null);
    const sentinelRef = useRef(null); 
    const treatmentPlans = useSelector(selectAllTreatmentPlans);
    const selectedPatient = useSelector(selectSelectedPatient);
    const filteredPatients = useSelector(selectFilteredPatients);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [currentAction, setCurrentAction] = useState(null);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [textFieldWidth, setTextFieldWidth] = useState('');

    const handleSaveButtonClick = () => {
        setIsDialogOpen(true);
        setCurrentAction('save');
        setDialogTitle("Save Treatment Plan");
        setDialogContent("Please enter a short description for this treatment plan. This description will allow you to identify it later.");
        setTextFieldWidth('100%'); 
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

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSticky(!entry.isIntersecting);
            },
            {
                rootMargin: '-1px 0px 0px 0px',
                threshold: [1]
            }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, []);


    return (
        <>
            <AlertDialog
                title={dialogTitle}
                content={dialogContent}
                open={isDialogOpen}
                onClose={handleClose}
                onAgree={inputValue => {
                    if (currentAction === 'save') {
                        handleConfirmSaveClick(inputValue);
                    } else if (currentAction === 'export') {
                        handleAgreeExportClick(inputValue);
                    }
                }}
                textInput={true}
                textInputWidth={textFieldWidth}
            />

            <div ref={sentinelRef} style={{ height: '1px' }}></div>
            <StyledTxToolbarContainer ref={toolbarRef} className={isSticky ? 'sticky' : ''}>
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
                            <StyledPrintImportButton src={printIcon} alt="Print Icon" title="Print TX Plan" />
                            <StyledPrintImportButton src={importIcon} alt="import Icon" title="Import into EHR" height="30px" onClick={handleExportClick} />
                        </StyledPrintImportBtnContainer>
                        <SaveButtonRow onSave={handleSaveButtonClick} />
                    </StyledPrintSaveBtnContainer>
                </StyledFlexAlignContainer>
            </StyledTxToolbarContainer>
        </>
    );
};

export default TxViewCustomizationToolbar;