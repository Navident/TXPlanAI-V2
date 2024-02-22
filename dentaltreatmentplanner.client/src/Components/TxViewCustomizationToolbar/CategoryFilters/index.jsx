import {
    StyledFiltersContainer
} from "./index.style";
import Checkbox from "../../Common/Checkbox/index";

const CategoryFilters = () => {
    const filters = [
        { label: 'Crowns', checked: false },
        { label: 'Fillings', checked: false },
        { label: 'Select All', checked: false },
    ];

    return (
        <StyledFiltersContainer>
            {filters.map((filter, index) => (
                <Checkbox key={index} label={filter.label} defaultChecked={filter.checked} />
            ))}
        </StyledFiltersContainer>
    );
};

export default CategoryFilters;