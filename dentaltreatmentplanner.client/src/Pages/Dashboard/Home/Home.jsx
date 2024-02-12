import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

import InputAdornment from '@mui/material/InputAdornment';
import searchIcon from '../../../assets/search-icon.svg';
import createNewButton from '../../../assets/create-new-plus-button.svg';
import { useBusiness } from '../../../Contexts/BusinessContext/useBusiness';
import RecentTxPlans from '../../../Components/RecentTxPlans';
import { StyledLargeText, StyledRoundedBoxContainer, StyledRoundedBoxContainerInner } from '../../../GlobalStyledComponents';
import { StyledHomeBoxBottomContainer } from '../../Dashboard/index.style'

const Home = () => {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const { businessName } = useBusiness();
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };
    const handleGenerateTxButtonClick = () => {
        navigate("/PatientManagementDashboard"); 

    };

    return (
        <div className="dashboard-right-side">
            <div className="dashboard-right-side-row">
                <div className="dashboard-right-side-row-top-text-section">
                    <div className="dashboard-text-header">Hi {businessName || 'The Dental Office'},</div>
                    <div>
                        You can manage your providers, add patients, generate new tx plans,
                        or view/edit existing tx plans.
                    </div>
                </div>
                <TextField
                    className="rounded-box"
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
                <StyledRoundedBoxContainer>
                    <StyledRoundedBoxContainerInner flexBasisZero padding="20px">
                    <div className="large-text">Generate TX Plan</div>
                        <StyledHomeBoxBottomContainer purpleContainer>
                        <img src={createNewButton} alt="Create New TX Plan" onClick={handleGenerateTxButtonClick} />
                    </StyledHomeBoxBottomContainer>
                    </StyledRoundedBoxContainerInner>
                    </StyledRoundedBoxContainer>
                <RecentTxPlans />
                <StyledRoundedBoxContainer>
                    <StyledRoundedBoxContainerInner flexBasisZero padding="20px">
                    <div className="large-text">Providers</div>
                        <StyledHomeBoxBottomContainer></StyledHomeBoxBottomContainer>
                    </StyledRoundedBoxContainerInner>
                </StyledRoundedBoxContainer>
            </div>
            <div className="dashboard-right-side-row">
                <StyledRoundedBoxContainer>
                    <StyledRoundedBoxContainerInner flexBasisZero padding="20px">
                    <div className="large-text">TX Plans Generated</div>
                        <StyledHomeBoxBottomContainer></StyledHomeBoxBottomContainer>
                    </StyledRoundedBoxContainerInner>
                </StyledRoundedBoxContainer>
            </div>
        </div>
    );
};

export default Home;
