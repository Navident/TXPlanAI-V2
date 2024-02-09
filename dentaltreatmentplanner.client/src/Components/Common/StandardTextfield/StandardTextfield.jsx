import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const StandardTextField = ({ label, value, onChange, adornment, borderColor, width = '115px', ...props }) => {
    return (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            variant="standard"
            InputProps={{
                startAdornment: adornment ? (
                    <InputAdornment position="start">{adornment}</InputAdornment>
                ) : null,
            }}
            sx={{
                width: width, 
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                    borderBottomColor: borderColor,
                },
                '& .MuiInput-underline:after': {
                    borderBottomColor: borderColor,
                },
            }}
            {...props}
        />
    );
};

export default StandardTextField;

