import { TextField } from "@mui/material";
import React, { useState } from 'react';
import HeaderBar from "../Common/HeaderBar/HeaderBar";
import RoundedButton from "../Common/RoundedButton/RoundedButton";
import './SignUp.css';
import logo from '../../assets/navident-logo.svg';
import circleIcon from '../../assets/circle-icon.svg';
import backButton from '../../assets/back-button.svg';
const Signup = () => {
    const [inputText, setInputText] = useState('');
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };
    return (
        <div className="signup-wrapper">
            <div className="login-signup-container">
                <HeaderBar
                    leftCornerElement={<img src={backButton} alt="Logo" />}
                    rightCornerElement={<img src={logo} alt="Logo" className="navident-logo" />}
                    centerLogo={true}
                />
                <div className="login-signup-content">
                    <div className="login-signup-header large-text">Create an account</div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label">Email Address or user name</div>
                        <TextField
                            value={inputText}
                            onChange={handleInputChange}
                            sx={{
                                width: '100%',
                                '& label.Mui-focused': {
                                    color: '#7777a1',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7777a1',
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label">Phone Number</div>
                        <TextField
                            value={inputText}
                            onChange={handleInputChange}
                            sx={{
                                width: '100%',
                                '& label.Mui-focused': {
                                    color: '#7777a1',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7777a1',
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label">Business Name</div>
                        <TextField
                            value={inputText}
                            onChange={handleInputChange}
                            sx={{
                                width: '100%',
                                '& label.Mui-focused': {
                                    color: '#7777a1',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7777a1',
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
                                    color: '#7777a1',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7777a1',
                                    },
                                },
                            }}
                        />
                    </div>
                    <RoundedButton
                        text="Sign up"
                        backgroundColor="#7777a1"
                        textColor="white"
                        border={false}
                        className="purple-button-hover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Signup;
