import HeaderBar from "../Common/HeaderBar/HeaderBar";
import { Link } from 'react-router-dom';
import logo from '../../assets/navident-logo.svg';
import twitterIconSmall from '../../assets/twitter-small-icon.svg';
import googleIconSmall from '../../assets/google-small-icon.svg';
import facebookIconSmall from '../../assets/facebook-small-icon.svg';
import appleIconSmall from '../../assets/apple-small-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import { TextField } from "@mui/material";
import { useState } from 'react';
import RoundedButton from "../Common/RoundedButton/RoundedButton";
import { useNavigate } from 'react-router-dom';
import backButton from '../../assets/back-button.svg';
import { loginUser } from '../../ClientServices/apiService';
import './Login.css'; 
import Alert from '../Common/Alert/Alert';
import { useBusiness } from '../../Contexts/BusinessContext/useBusiness';
import { Backdrop, CircularProgress } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [alertInfo, setAlertInfo] = useState({ open: false, type: '', message: '' });
    const { setBusinessName } = useBusiness(); 
    const [loading, setLoading] = useState(false); // new state for loading


    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLoginClick = async () => {
        setLoading(true); // Start loading
        const credentials = { email, password };
        const response = await loginUser(credentials);

        setLoading(false); // Stop loading

        if (response.isSuccess) {
            console.log("Backend response object:", response);
            // Extract the facility name from the nested user object
            const facilityName = response.user?.facility?.name;
            console.log("Calling setBusinessName with:", facilityName);
            setBusinessName(facilityName); // Set the business name with the facility name
            navigate("/dashboard");
        } else {
            // Handle failed login
            console.error('Login failed:', response.message);
            setAlertInfo({ open: true, type: 'error', message: 'Invalid login' });
        }
    };




    const handleBackClick = () => {
        navigate("/"); 
    };
    const handleCloseAlert = () => {
        setAlertInfo({ ...alertInfo, open: false });
    };

    return (
        <div className="login-wrapper">
            <Backdrop open={loading} style={{ zIndex: 1000 }}>
                <CircularProgress style={{ color: 'rgb(162, 225, 201)' }} />
            </Backdrop>

            {alertInfo.type && (
                <Alert
                    open={alertInfo.open}
                    handleClose={handleCloseAlert}
                    type={alertInfo.type}
                    message={alertInfo.message}
                />
            )}
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
                            value={email} 
                            onChange={handleEmailChange}
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
                            value={password}
                            onChange={handlePasswordChange} 
                            type="password"
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
