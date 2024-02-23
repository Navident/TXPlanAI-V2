import React from 'react';
import { StyledFiltersContainer } from "./index.style";
import CustomCheckbox from "../../../Components/Common/Checkbox/index";
import useSortContext from '../../../Contexts/SortContext/useSortContext';

const CategoryFilters = () => {
    const { activeTxCategories, selectedCategories, updateSelectedCategories, toggleSelectAll } = useSortContext();

    const isAllSelected = selectedCategories.size === activeTxCategories.length;

    const filters = [
        ...activeTxCategories.map(category => ({ label: category, checked: selectedCategories.has(category) })),
        { label: 'Select All', checked: isAllSelected },
    ];

    const handleCheckboxChange = (event, label) => {
        if (label === 'Select All') {
            toggleSelectAll(!isAllSelected);
        } else {
            updateSelectedCategories(label);
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