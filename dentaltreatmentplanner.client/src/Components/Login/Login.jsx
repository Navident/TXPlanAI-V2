import HeaderBar from "../Common/HeaderBar/HeaderBar";
import { Link } from 'react-router-dom';
import logo from '../../assets/navident-logo.svg';
import twitterIconSmall from '../../assets/twitter-small-icon.svg';
import googleIconSmall from '../../assets/google-small-icon.svg';
import facebookIconSmall from '../../assets/facebook-small-icon.svg';
import appleIconSmall from '../../assets/apple-small-icon.svg';
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
        navigate("/dashboard"); 
    };
    const handleBackClick = () => {
        navigate("/"); 
    };

    return (
        <div className="login-wrapper">
            <HeaderBar
                leftCornerElement={<img src={backButton} alt="Back" className="back-btn-arrow" onClick={handleBackClick} />}
                rightCornerElement={<img src={logo} alt="Logo" className="navident-logo" />}
                centerLogo={true}
            />
            <div className="login-signup-container">
                <div className="login-signup-content">
                    <div className="login-signup-header large-text">Log in</div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label light-grey-text">Email Address or user name</div>
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
                                        borderColor: '#A2E1C9', 
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label light-grey-text">Password</div>
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
                                        borderColor: '#A2E1C9',
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
                    <div className="login-bottom-section">
                        <div className="underlined-text">Forgot your password?</div>
                        <div className="light-grey-text">Don't have an account? Sign up</div>
                        <div className="divider-container">
                            <div className="line"></div>
                            <span className="divider-text">Or continue with</span>
                            <div className="line"></div>
                        </div>
                        <div className="login-bottom-section-icons-row">
                            <img src={facebookIconSmall} alt="Logo" />
                            <img src={appleIconSmall} alt="Logo" />
                            <img src={googleIconSmall} alt="Logo" />
                            <img src={twitterIconSmall} alt="Logo" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
