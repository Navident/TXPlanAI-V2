import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


const CustomCheckbox = ({ label, checked, onChange, color }) => {
    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        onChange={onChange}
                        sx={{
                            color: color,
                            '&.Mui-checked': {
                                color: color, 
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
