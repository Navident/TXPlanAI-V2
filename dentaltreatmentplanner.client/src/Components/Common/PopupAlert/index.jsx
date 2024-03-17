import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { UI_COLORS } from '../../../Theme';
import StandardTextField from '../../../Components/Common/StandardTextfield/StandardTextfield';
import { useState } from 'react';


function AlertDialog({ title, content, open, onClose, onAgree, textInput = false }) {
    const purple = UI_COLORS.purple;
    const [inputValue, setInputValue] = useState(''); 

    const handleTextSubmit = () => {
        onAgree(inputValue);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
                {textInput && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <StandardTextField
                            width="75px" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            borderColor={purple}
                        />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                {!textInput ? (
                    <>
                        <Button onClick={onClose} style={{ color: purple }}>
                            Disagree
                        </Button>
                        <Button onClick={onAgree} autoFocus style={{ color: purple }}>
                            Agree
                        </Button>
                    </>
                ) : (
                    <Button onClick={handleTextSubmit} style={{ color: purple }}>
                        Submit
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;
