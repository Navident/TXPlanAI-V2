import React from 'react';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';

const DropdownSearch = ({ cdtCodes, onSelect, selectedCode }) => {
    const options = cdtCodes.map(code => ({
        value: code.code,
        label: `${code.code} - ${code.longDescription}`,
        longDescription: code.longDescription
    }));

    const handleChange = selectedOption => {
        onSelect(selectedOption ? selectedOption : null);
    };

    // Custom SingleValue component to display only the code
    const SingleValue = (props) => (
        <components.SingleValue {...props}>
            {props.data.value}
        </components.SingleValue>
    );

    // Find the option that matches the selectedCode
    const selectedOption = options.find(option => option.value === selectedCode);

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
            color: 'black', // Set text color to black
            '&:hover': {
                backgroundColor: '#eeeef3',
                color: 'black', 
            },
        }),
    };



    return (
        <div style={{ width: 300 }}>
            <Select
                options={options}
                onChange={handleChange}
                components={{ SingleValue }}
                value={selectedOption} // Control the selected value
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
