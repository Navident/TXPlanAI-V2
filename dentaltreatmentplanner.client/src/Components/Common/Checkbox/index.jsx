import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { UI_COLORS } from '../../../Theme';

const CustomCheckbox = ({ label }) => {
    const grey = UI_COLORS.light_grey2;
    return (
        <FormGroup>
            {label ? (
                <FormControlLabel
                    control={
                        <Checkbox
                            sx={{
                                color: grey, 
                                '&.Mui-checked': {
                                    color: grey, 
                                },
                            }}
                        />
                    }
                    label={label}
                />
            ) : (
                <Checkbox
                    sx={{
                        color: grey,
                        '&.Mui-checked': {
                            color: grey, 
                        },
                    }}
                />
            )}
        </FormGroup>
    );
};

export default CustomCheckbox;
