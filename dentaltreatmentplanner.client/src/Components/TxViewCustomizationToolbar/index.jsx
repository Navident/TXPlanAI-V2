import {
    StyledTxToolbarContainer
} from "./index.style";
import DropdownSearch from "../Common/DropdownSearch/DropdownSearch";
import CategoryFilters from "./CategoryFilters/index";
import RoundedButton from "../../Components/Common/RoundedButton/RoundedButton";
import { UI_COLORS } from '../../Theme';
import { useState, useEffect, useRef } from 'react';
import CustomToggleButton from "../../Components/Common/ToggleButton/index";

const TxViewCustomizationToolbar = () => {
    const [isSticky, setIsSticky] = useState(false);
    const toolbarRef = useRef(null);
    const sentinelRef = useRef(null); 

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


    const handleSortSelect = (selectedOption) => {
        console.log('Selected sort option:', selectedOption);
    };

    return (
        <>
        <div ref={sentinelRef} style={{ height: '1px' }}></div>
        <StyledTxToolbarContainer ref={toolbarRef} className={isSticky ? 'sticky' : ''}>
                <CustomToggleButton />
            <CategoryFilters />
            <RoundedButton
                text="Group"
                backgroundColor={UI_COLORS.light_grey2}
                textColor="white"
                border={false}
                borderRadius="4px"
                height="39px"
                width="280px"
                //onClick={() => addNewRow(visitId)}
            />
            </StyledTxToolbarContainer>
        </>
    );
};

export default TxViewCustomizationToolbar;