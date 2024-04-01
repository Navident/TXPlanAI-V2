import React from 'react';
import { StyledFiltersContainer } from "./index.style";
import CustomCheckbox from "../../../Components/Common/Checkbox/index";
import { useSelector, useDispatch } from 'react-redux';
import {
    selectActiveTxCategories,
    selectSelectedCategories,
    toggleSelectAll,
    updateSelectedCategories,
} from '../../../Redux/ReduxSlices/TableViewControls/tableViewControlSlice';
import { useEffect, useState } from "react";
import categoryColorMapping from '../../../Utils/categoryColorMapping';
import { UI_COLORS } from '../../../Theme';

const CategoryFilters = () => {
    const dispatch = useDispatch();
    const activeTxCategories = useSelector(selectActiveTxCategories);
    const selectedCategories = useSelector(selectSelectedCategories);
    console.log("Type of selectedCategories:", typeof selectedCategories);
    console.log("Value of selectedCategories:", selectedCategories);
    useEffect(() => {
        console.log("activeTxCategories:", activeTxCategories);
    }, [activeTxCategories]);


    // Directly mapping activeTxCategories to filters 
    const filters = activeTxCategories.map(category => ({
        label: category,
        checked: selectedCategories.has(category)
    }));

    const handleCheckboxChange = (event, label) => {
        dispatch(updateSelectedCategories(label));
    };

    return (
        <StyledFiltersContainer>
            {filters.map((filter, index) => {
                // Determine the color for the current category
                const color = categoryColorMapping[filter.label] || UI_COLORS.light_grey2; 

                return (
                    <CustomCheckbox
                        key={index}
                        label={filter.label}
                        checked={filter.checked}
                        onChange={(e) => handleCheckboxChange(e, filter.label)}
                        color={color} 
                    />
                );
            })}
        </StyledFiltersContainer>
    );
};

export default CategoryFilters;