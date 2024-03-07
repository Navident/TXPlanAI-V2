import {
    StyledTxToolbarContainer,
    StyledPrintButton,
    StyledPrintSaveBtnContainer,
    StyledFlexAlignContainer
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

const TxViewCustomizationToolbar = () => {
    const dispatch = useDispatch();
    const [isSticky, setIsSticky] = useState(false);
    const toolbarRef = useRef(null);
    const sentinelRef = useRef(null); 
    const handleSaveButtonClick = () => {
        dispatch(requestUpdateTreatmentPlan());
    };

    const handleGroupClick = () => {
        dispatch(toggleGroupActive());
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
                        <StyledPrintButton src={printIcon} alt="Print Icon" />
                        <SaveButtonRow onSave={handleSaveButtonClick} />
                    </StyledPrintSaveBtnContainer>
                </StyledFlexAlignContainer>
            </StyledTxToolbarContainer>
        </>
    );
};

export default TxViewCustomizationToolbar;