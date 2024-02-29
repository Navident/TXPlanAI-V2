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

const CategoryFilters = () => {
    const dispatch = useDispatch();
    const activeTxCategories = useSelector(selectActiveTxCategories);
    const selectedCategories = useSelector(selectSelectedCategories);

    const isAllSelected = selectedCategories.size === activeTxCategories.length;

    const filters = [
        ...activeTxCategories.map(category => ({ label: category, checked: selectedCategories.has(category) })),
        { label: 'Select All', checked: isAllSelected },
    ];

    const handleCheckboxChange = (event, label) => {
        if (label === 'Select All') {
            dispatch(toggleSelectAll(!isAllSelected));
        } else {
            dispatch(updateSelectedCategories(label));
        }
    };


    return (
        <StyledFiltersContainer>
            {filters.map((filter, index) => (
                <CustomCheckbox
                    key={index}
                    label={filter.label}
                    checked={filter.checked}
                    onChange={(e) => handleCheckboxChange(e, filter.label)} 
                />
            ))}
        </StyledFiltersContainer>
    );
};

export default CategoryFilters;