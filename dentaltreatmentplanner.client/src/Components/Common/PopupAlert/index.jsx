import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { UI_COLORS } from '../../../Theme';


function AlertDialog({ title, content, open, onClose, onAgree }) { 
    const purple = UI_COLORS.purple;

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
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} style={{ color: purple }}>
                    Disagree
                </Button>
                <Button onClick={onAgree} autoFocus style={{ color: purple }}> 
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;
