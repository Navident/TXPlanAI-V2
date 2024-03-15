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
    selectAllTreatmentPlans
} from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import { selectSelectedPatient } from '../../Redux/ReduxSlices/Patients/patientsSlice';
import { showAlert } from '../../Redux/ReduxSlices/Alerts/alertSlice';

const TxViewCustomizationToolbar = () => {
    const dispatch = useDispatch();
    const [isSticky, setIsSticky] = useState(false);
    const toolbarRef = useRef(null);
    const sentinelRef = useRef(null); 
    const treatmentPlans = useSelector(selectAllTreatmentPlans);
    const selectedPatient = useSelector(selectSelectedPatient);

    const handleSaveButtonClick = () => {
        dispatch(requestUpdateTreatmentPlan());
    };

    const handleGroupClick = () => {
        dispatch(toggleGroupActive());
    };

    const handleImportClick = async () => {
        // here we map the treatment plan to the dto 
        const openDentalTreatmentPlanDto = mapToOpenDentalTreatmentPlanDto(treatmentPlans, selectedPatient.patientId); 

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
                            <StyledPrintImportButton src={importIcon} alt="import Icon" title="Import into EHR" height="30px" onClick={handleImportClick} />
                        </StyledPrintImportBtnContainer>
                        <SaveButtonRow onSave={handleSaveButtonClick} />
                    </StyledPrintSaveBtnContainer>
                </StyledFlexAlignContainer>
            </StyledTxToolbarContainer>
        </>
    );
};

export default TxViewCustomizationToolbar;