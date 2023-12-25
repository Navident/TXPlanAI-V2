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

    return (
        <div style={{ width: 300 }}>
            <Select
                options={options}
                onChange={handleChange}
                components={{ SingleValue }}
                value={selectedOption} // Control the selected value
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
