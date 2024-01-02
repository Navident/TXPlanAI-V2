import HeaderBar from "../Common/HeaderBar/HeaderBar";
import { Link } from 'react-router-dom';
import logo from '../../assets/navident-logo.svg';
import circleIcon from '../../assets/circle-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import { TextField } from "@mui/material";
import React, { useState } from 'react';
import RoundedButton from "../Common/RoundedButton/RoundedButton";
import { useNavigate } from 'react-router-dom';
import backButton from '../../assets/back-button.svg';

import './Login.css'; 

const Login = () => {
    const [inputText, setInputText] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };
    const handleLoginClick = () => {
        navigate("/dashboard"); // This will navigate to the SignUp page
    };
    return (
        <div className="login-wrapper">
            <HeaderBar
                leftCornerElement={<img src={backButton} alt="Logo" />}
                rightCornerElement={<img src={logo} alt="Logo" className="navident-logo" />}
                centerLogo={true}
            />
            <div className="login-signup-container">
                <div className="login-signup-content">
                    <div className="login-signup-header large-text">Log in</div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label">Email Address or user name</div>
                        <TextField
                            value={inputText}
                            onChange={handleInputChange}
                            sx={{
                                width: '100%',
                                '& label.Mui-focused': {
                                    color: '#A2E1C9',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#A2E1C9',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#A2E1C9', // Add this line for hover state
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label">Password</div>
                        <TextField
                            value={inputText}
                            onChange={handleInputChange}
                            sx={{
                                width: '100%',
                                '& label.Mui-focused': {
                                    color: '#A2E1C9',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#A2E1C9',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#A2E1C9', // Add this line for hover state
                                    },
                                },
                            }}
                        />
                    </div>
                    <RoundedButton
                        text="Log in"
                        backgroundColor="#A2E1C9"
                        textColor="white"
                        border={false}
                        onClick={handleLoginClick}
                        className="green-button-hover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
