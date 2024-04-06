import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import { TextField } from "@mui/material";
import  { useState } from 'react';
import './CreateNewPatient.css';
import Alert from '../../../Components/Common/Alert/Alert';

const CreateNewPatient = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [alertInfo, setAlertInfo] = useState({ open: false, type: '', message: '' });

    const handleCloseAlert = () => {
        setAlertInfo({ ...alertInfo, open: false });
    };

/*    const handleRegisterPatient = async () => {
        if (!firstName || !lastName || !dateOfBirth) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const patientId = await createPatient({
                firstName,
                lastName,
                dateOfBirth
            });

            if (patientId) {
                setAlertInfo({ open: true, type: 'success', message: 'Patient created successfully.' });
                // Clear the input fields after successful registration
                setFirstName('');
                setLastName('');
                setDateOfBirth('');
                await refreshPatients();
            } else {
                alert("Failed to register patient.");
            }
        } catch (error) {
            console.error('Error creating patient:', error);
            alert("An error occurred while registering the patient.");
        }
    };*/

    return (
        <div className="create-new-patient-wrapper">
            {alertInfo.type && (
                <Alert
                    open={alertInfo.open}
                    handleClose={handleCloseAlert}
                    type={alertInfo.type}
                    message={alertInfo.message}
                />
            )}
            <div className="create-new-patient-container rounded-box box-shadow">
                <div className="login-signup-header large-text">Add a New Patient</div>
                <div className="login-signup-input-field">
                    <div className="textbox-label light-grey-text">First Name</div>
                    <TextField
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
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
                    <div className="textbox-label light-grey-text">Last Name</div>
                    <TextField
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
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
                    <div className="textbox-label light-grey-text">Date of Birth</div>
                    <TextField
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
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
                    text="Register Patient"
                    backgroundColor="#7777a1"
                    textColor="white"
                    border={false}
                    className="purple-button-hover"
                    //onClick={handleRegisterPatient} 
                />
                </div>
        </div>
    );
};

export default CreateNewPatient;