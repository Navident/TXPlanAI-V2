import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

// Custom Slide Transition from left
function SlideTransition(props) {
    return <Slide {...props} direction="right" />;
}

const Alert = ({ open, handleClose, type, message }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            TransitionComponent={SlideTransition}
            transitionDuration={700}
        >
            <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleClose}
                severity={type} // 'success', 'error', 'warning', 'info'
            >
                {message}
            </MuiAlert>
        </Snackbar>
    );
};

export default Alert;
