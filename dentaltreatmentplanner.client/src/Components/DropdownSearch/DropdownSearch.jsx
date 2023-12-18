import React from 'react';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';

const DropdownSearch = ({ cdtCodes, onSelect }) => {
    const options = cdtCodes.map(code => ({
        value: code.code,
        label: `${code.code} - ${code.longDescription}`,
        longDescription: code.longDescription
    }));

    const handleChange = selectedOption => {
        onSelect(selectedOption ? selectedOption.longDescription : '');
    };

    // Custom SingleValue component to display only the code, need to clean this up later
    const SingleValue = (props) => (
        <components.SingleValue {...props}>
            {props.data.value}
        </components.SingleValue>
    );

    SingleValue.propTypes = {
        data: PropTypes.shape({
            value: PropTypes.string.isRequired,
        }).isRequired,
    };

    return (
        <div style={{ width: 300 }}>
            <Select
                options={options}
                onChange={handleChange}
                components={{ SingleValue }}
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
