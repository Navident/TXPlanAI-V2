import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import searchIcon from '../../assets/search-icon.svg';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, selectSearchQuery } from '../../Redux/ReduxSlices/Patients/patientsSlice';

const SearchPatient = () => {
    const dispatch = useDispatch();
    const searchQuery = useSelector(selectSearchQuery);

    const handleSearchChange = (event) => {
        dispatch(setSearchQuery(event.target.value));
    };

    return (
            <>
                <div className="large-text">Patients</div>
                <TextField
                    className="rounded-box"                   
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{
                        width: '100%',
                        backgroundColor: 'white',
                        '& label.Mui-focused': {
                            color: '#7777a1',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#ccc', 
                            },
                            '&:hover fieldset': {
                                borderColor: '#7777a1', 
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#7777a1', 
                            },
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <img src={searchIcon} alt="Search" />
                            </InputAdornment>
                        ),
                    }}
                />

            </>
    );
};

export default SearchPatient;
