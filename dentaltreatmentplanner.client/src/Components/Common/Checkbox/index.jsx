import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { UI_COLORS } from '../../../Theme';

const CustomCheckbox = ({ label, checked, onChange }) => {
    const grey = UI_COLORS.light_grey2;

    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        onChange={onChange}
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
        </FormGroup>
    );
};

export default CustomCheckbox;
