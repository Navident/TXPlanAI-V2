import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState } from "react";
import { UI_COLORS } from '../../../Theme';
import useSortContext from '../../../Contexts/SortContext/useSortContext';

const CustomToggleButtonGroup = () => {
    const { alignment, handleAlignmentChange } = useSortContext();

    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            handleAlignmentChange(newAlignment);
            console.log("new alignment is: ", newAlignment);
        }
    };

    return (
        <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={{
                '& .MuiToggleButtonGroup-grouped': {
                    border: `1px solid ${UI_COLORS.light_grey2}`, // border color
                    // Remove border radius where buttons meet
                    borderRadius: 0,
                    height: '39px',
                    width: '180px',
                    textTransform: 'none',
                    '&.Mui-selected': {
                        backgroundColor: UI_COLORS.light_grey2, 
                        color: '#fff', // Text color for selected state
                        '&:hover': {
                            backgroundColor: UI_COLORS.light_grey2, // same color on hover
                        },
                        border: `1px solid ${UI_COLORS.light_grey2}`,
                    },
                    '&:hover': {
                        backgroundColor: UI_COLORS.light_grey5, // Slightly lighter on hover for unselected buttons
                        
                    },
                    fontFamily: 'Poppins, sans-serif', 
                    fontSize: '16px',
                },

                '& .MuiToggleButtonGroup-grouped:not(:last-of-type)': {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                },
                '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    marginLeft: '-1px', 
                },

                '& .MuiToggleButtonGroup-grouped:first-of-type': {
                    borderTopLeftRadius: '4px',
                    borderBottomLeftRadius: '4px',
                },
                '& .MuiToggleButtonGroup-grouped:last-of-type': {
                    borderTopRightRadius: '4px',
                    borderBottomRightRadius: '4px',
                },
            }}
        >
            <ToggleButton value="default">Sort by default</ToggleButton>
            <ToggleButton value="category">Sort by category</ToggleButton>
        </ToggleButtonGroup>
    );
};
export default CustomToggleButtonGroup;