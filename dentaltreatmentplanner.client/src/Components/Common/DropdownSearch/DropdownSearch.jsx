import React from 'react';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';

const DropdownSearch = ({ items, onSelect, selectedItem, valueKey, labelKey, itemLabelFormatter, width = 300, icon }) => {
    const options = items.map(item => ({
        value: item[valueKey],
        label: itemLabelFormatter ? itemLabelFormatter(item) : item[labelKey],
        ...item
    }));

    const handleChange = selectedOption => {
        onSelect(selectedOption ? selectedOption : null);
    };

    const SingleValue = ({ children, ...props }) => (
        <components.SingleValue {...props}>{props.data.label}</components.SingleValue>
    );

    const selectedOption = selectedItem
        ? options.find(option => option.value === selectedItem[valueKey])
        : null;

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#7777a1' : provided.borderColor,
            boxShadow: state.isFocused ? `0 0 0 1px #7777a1` : provided.boxShadow,
            '&:hover': {
                borderColor: state.isFocused ? '#7777a1' : provided.borderColor,
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#eeeef3' : provided.backgroundColor,
            color: 'black',
            '&:hover': {
                backgroundColor: '#eeeef3',
                color: 'black', 
            },
        }),
    };

    const Control = ({ children, ...props }) => (
        <components.Control {...props}>
            {icon && <div className="tx-icon">{icon}</div>}
            {children}
        </components.Control>
    );

    return (
        <div style={{ width }}>
            <Select
                options={options}
                onChange={handleChange}
                components={{ SingleValue, Control }}
                value={selectedOption}
                styles={customStyles}
            />
        </div>
    );
};

DropdownSearch.propTypes = {
    cdtCodes: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string,
        longDescription: PropTypes.string
    })).isRequired,
    onSelect: PropTypes.func.isRequired
};

export default DropdownSearch;
