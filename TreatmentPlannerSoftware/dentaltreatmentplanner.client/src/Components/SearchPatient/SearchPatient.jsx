import { useContext } from 'react';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import searchIcon from '../../assets/search-icon.svg';
import { BusinessContext } from '../../Contexts/BusinessContext/BusinessContext';

const SearchPatient = () => {
    const { searchQuery, setSearchQuery } = useContext(BusinessContext);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="search-patient rounded-box box-shadow">
            <div className="patients-inner-section">
                <div className="large-text">Search Patient</div>
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

            </div>
        </div>
    );
};

export default SearchPatient;
