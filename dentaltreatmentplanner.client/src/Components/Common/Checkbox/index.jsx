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
                            padding: 0,
                            '& .MuiIconButton-root': {
                                padding: '0', 
                            }
                        }}
                    />
                }
                label={label}
                sx={{
                    marginLeft: 0, 
                    marginRight: 0, 
                    '& .MuiFormControlLabel-label': {
                        marginLeft: 0.5, 
                    }
                }}
            />
        </FormGroup>
    );
};


export default CustomCheckbox;
