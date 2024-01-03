// Home.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

import InputAdornment from '@mui/material/InputAdornment';
import searchIcon from '../../../assets/search-icon.svg';
import createNewButton from '../../../assets/create-new-plus-button.svg';

const Home = () => {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };
    const handleGenerateTxButtonClick = () => {
        navigate("/treatmentplanoutput"); 

    };

    return (
        <div className="dashboard-right-side">
            <div className="dashboard-right-side-row">
                <div className="dashboard-right-side-row-top-text-section">
                    <div className="dashboard-text-header">Hi The Dental Office,</div>
                    <div>
                        You can manage your providers, add patients, generate new tx plans,
                        or view/edit existing tx plans.
                    </div>
                </div>
                <TextField
                    className="box-shadow rounded-box"
                    placeholder="Search Patient"
                    value={inputText}
                    onChange={handleInputChange}
                    sx={{
                        width: '350px',
                        backgroundColor: 'white',
                        '& label.Mui-focused': {
                            color: '#7777a1',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'rgba(0, 0, 0, 0)',
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
            <div className="dashboard-right-side-row">
                <div className="dashboard-right-side-row-box first-box rounded-box box-shadow">
                    <div className="large-text">Generate TX Plan</div>
                    <div className="dashboard-right-side-row-box-bottom-section">
                        <img src={createNewButton} alt="Create New TX Plan" onClick={handleGenerateTxButtonClick} />
                    </div>
                </div>
                <div className="dashboard-right-side-row-box rounded-box box-shadow">
                    <div className="large-text">Recent TX Plans</div>
                    <div className="dashboard-right-side-row-box-bottom-section"></div>
                </div>
                <div className="dashboard-right-side-row-box rounded-box box-shadow">
                    <div className="large-text">Providers</div>
                    <div className="dashboard-right-side-row-box-bottom-section"></div>
                </div>
            </div>
            <div className="dashboard-right-side-row">
                <div className="dashboard-right-side-row-box rounded-box box-shadow">
                    <div className="large-text">TX Plans Generated</div>
                    <div className="dashboard-right-side-row-box-bottom-section rounded-box"></div>
                </div>
            </div>
        </div>
    );
};

export default Home;
