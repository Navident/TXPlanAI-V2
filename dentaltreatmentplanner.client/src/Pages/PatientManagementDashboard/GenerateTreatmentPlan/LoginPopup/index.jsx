import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import StandardTextField from '../../../../Components/Common/StandardTextfield/StandardTextfield';
import { useState } from 'react';
import { UI_COLORS } from '../../../../Theme';
import NavidentShortLogo from "../../../../assets/navident-short-logo.svg";
import { StyledSmallLogo } from "./index.style";
import { useDispatch } from 'react-redux';
import { useLoginUserMutation } from '../../../../Redux/ReduxSlices/User/userApiSlice';
import { setUserDetails } from '../../../../Redux/ReduxSlices/User/userSlice';
import { Backdrop, CircularProgress } from '@mui/material';
import { showAlert } from '../../../../Redux/ReduxSlices/Alerts/alertSlice';

function LoginPopup({ open, onClose }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const purple = UI_COLORS.purple;
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const [loginError, setLoginError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await loginUser({ email, password }).unwrap();
            dispatch(setUserDetails({
                jwtToken: response.token,
                isUserLoggedIn: true,
                isSuperAdmin: response.isSuperAdmin,
                facilityName: response.user.facility.name,
                facilityId: response.user.facility.facilityId,
            }));
            onClose(); // Close the popup on successful login
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError('Invalid login credentials');
            dispatch(showAlert({ type: 'error', message: 'Invalid login' }));
        }
    };

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    onClose();
                }
            }}
            aria-labelledby="login-dialog-title"
            aria-describedby="login-dialog-description"
            PaperProps={{
                style: { width: '300px' } 
            }}
        >
            <Backdrop open={isLoading} style={{ color: '#fff', zIndex: 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <StyledSmallLogo src={NavidentShortLogo} alt="Navident Logo" />
            <DialogTitle id="login-dialog-title">Login</DialogTitle>
            <DialogContent>
                <StandardTextField
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: 16, width: '100%' }}
                    borderColor={purple}
                />
                <StandardTextField
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%' }}
                    borderColor={purple}
                />
            </DialogContent>
            <DialogActions>

                <Button onClick={handleLogin} disabled={isLoading} style={{ color: purple }} autoFocus>
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LoginPopup;
