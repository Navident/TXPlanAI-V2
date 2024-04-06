import { TextField } from "@mui/material";
import React, { useState } from 'react';
import HeaderBar from "../../Components/Common/HeaderBar/HeaderBar";
import RoundedButton from "../../Components/Common/RoundedButton/RoundedButton";
import './SignUp.css';
import logo from '../../assets/navident-logo.svg';
import circleIcon from '../../assets/circle-icon.svg';
import backButton from '../../assets/back-button.svg';
import { useNavigate } from 'react-router-dom';
import AlertDialog from "../../Components/Common/PopupAlert/index";
import privacyPolicyContent from './privacyPolicy';
import { useRegisterUserMutation } from '../../Redux/ReduxSlices/User/userApiSlice';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    // Add state to control the AlertDialog visibility
    const [showAlert, setShowAlert] = useState(false);

    const [registerUser, { isLoading, error }] = useRegisterUserMutation();

    const handleBackClick = () => {
        navigate("/");
    };

    const handleRegister = () => {
        if (!email) {
            alert('Please enter an email address.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        // Show the AlertDialog for user agreement
        setShowAlert(true);
    };

    const handleAgree = async () => {
        setShowAlert(false);
        const userData = {
            Email: email,
            PhoneNumber: phoneNumber,
            BusinessName: businessName,
            Password: password,
            ConfirmPassword: confirmPassword,
        };

        // Use the RTK Query hook for registration
        try {
            const result = await registerUser(userData).unwrap();
            console.log('Registration successful', result);
            navigate('/'); 
        } catch (apiError) {
            console.error('Registration failed', apiError);
            alert(`Registration failed: ${apiError.data?.errors || 'Unknown error'}`);
        }
    };

    const privacyPolicyLines = privacyPolicyContent.split('\n');
    const contentToDisplay = privacyPolicyLines.slice(2, privacyPolicyLines.length - 2); // Ignore first 2 and last 2 lines

    const formattedContent = contentToDisplay.map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));


    return (
        <div className="signup-wrapper">
            <AlertDialog
                open={showAlert}
                onClose={() => setShowAlert(false)}
                onAgree={handleAgree}
                title="Terms of Use for Beta Testers"
                content={formattedContent}
            />
            <div className="login-signup-container">
                <HeaderBar
                    leftCornerElement={<img src={backButton} alt="Back" className="back-btn-arrow" onClick={handleBackClick} />}
                    rightCornerElement={<img src={logo} alt="Logo" className="navident-logo" />}
                    centerLogo={true}
                />
                <div className="login-signup-content box-shadow">
                    <div className="login-signup-header large-text">Create an account</div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label light-grey-text">Email Address</div>
                        <TextField
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                width: '100%',
                                '& label.Mui-focused': {
                                    color: '#7777a1',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#7777a1', 
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7777a1',
                                    },
                                },
                            }}
                        />

                    </div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label light-grey-text">Phone Number (optional)</div>
                        <TextField
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            sx={{
                                width: '100%',
                                '& label.Mui-focused': {
                                    color: '#7777a1',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#7777a1', 
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7777a1', 
                                    },
                                },
                            }}
                        />

                    </div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label light-grey-text">Business Name</div>
                        <TextField
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            sx={{
                                width: '100%',
                                '& label.Mui-focused': {
                                    color: '#7777a1',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#7777a1', 
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7777a1',
                                    },
                                },
                            }}
                        />

                    </div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label light-grey-text">Password</div>
                        <TextField
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                width: '100%',
                                '& label.Mui-focused': {
                                    color: '#7777a1',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#7777a1', 
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7777a1', 
                                    },
                                },
                            }}
                        />

                    </div>
                    <div className="login-signup-input-field">
                        <div className="textbox-label light-grey-text">Confirm Password</div>
                        <TextField
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{
                                width: '100%',
                                '& label.Mui-focused': {
                                    color: '#7777a1',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#7777a1', 
                                    },
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
                        onClick={handleRegister}
                    />
                </div>
            </div>
        </div>
    );
};

export default Signup;
