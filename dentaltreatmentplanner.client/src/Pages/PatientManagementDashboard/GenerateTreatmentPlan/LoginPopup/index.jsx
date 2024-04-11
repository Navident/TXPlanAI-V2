import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import StandardTextField from '../../../Components/Common/StandardTextfield/StandardTextfield';
import { useState } from 'react';
import { UI_COLORS } from '../../../Theme';

function LoginPopup({ open, onClose, onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const purple = UI_COLORS.purple;

    const handleLogin = () => {
        onLogin(email, password);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="login-dialog-title"
            aria-describedby="login-dialog-description"
        >
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
                <Button onClick={onClose} style={{ color: purple }}>
                    Cancel
                </Button>
                <Button onClick={handleLogin} style={{ color: purple }} autoFocus>
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LoginPopup;
