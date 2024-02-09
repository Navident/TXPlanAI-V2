import RoundedButton from "../Common/RoundedButton/RoundedButton";
import { useContext } from 'react';
import { BusinessContext } from '../../Contexts/BusinessContext/BusinessContext';
import './PatientList.css';
import { useBusiness } from '../../Contexts/BusinessContext/useBusiness';
import { useNavigate } from 'react-router-dom';
import { StyledLargeText } from '../../GlobalStyledComponents';

const PatientList = () => {
    const { filteredPatients } = useContext(BusinessContext);
    const { selectedPatient, setSelectedPatient } = useBusiness();
    const navigate = useNavigate();

    const handlePatientSelection = (patient) => {
        setSelectedPatient(patient);
    };
    const handleNewPatientClick = () => {
        navigate('/PatientManagementDashboard/create-new-patient');
    };

    return (
        <div className="all-patients-container rounded-box box-shadow">
            <div className="patients-inner-section">
                <StyledLargeText>All Patients</StyledLargeText>
                <RoundedButton
                    text="New Patient"
                    backgroundColor="#7777a1"
                    textColor="white"
                    border={false}
                    width="100%"
                    className="purple-button-hover"
                    onClick={handleNewPatientClick}
                />
                <div style={{ borderTop: '1px solid #ccc', margin: '5px 0' }}></div>

            </div>

            {filteredPatients.map((patient) => (
                <div
                    key={patient.patientId}
                    className={`patient-name ${selectedPatient && selectedPatient.patientId === patient.patientId ? 'selected-patient' : ''}`}
                    onClick={() => handlePatientSelection(patient)}
                >
                    {patient.firstName}
                </div>
            ))}


        </div>
    );
};

export default PatientList;
