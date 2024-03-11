import RoundedButton from "../Common/RoundedButton/RoundedButton";
import './PatientList.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { StyledLargeText } from '../../GlobalStyledComponents';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedPatient, selectFilteredPatients, selectSelectedPatient } from '../../Redux/ReduxSlices/Patients/patientsSlice';
import SearchPatient from "../../Components/SearchPatient/SearchPatient";

const PatientList = () => {
    const dispatch = useDispatch();
    const filteredPatients = useSelector(selectFilteredPatients);
    const selectedPatient = useSelector(selectSelectedPatient);
    const navigate = useNavigate();
    const location = useLocation(); 

    const handlePatientSelection = (patient) => {
        dispatch(setSelectedPatient(patient));
        // Check if the current path includes 'saved-patient-tx-plans' before navigating
        if (location.pathname.includes('/saved-patient-tx-plans')) {
            navigate(`/PatientManagementDashboard/saved-patient-tx-plans/${patient.patientId}`);
        }
    };
    const handleNewPatientClick = () => {
        navigate('/PatientManagementDashboard/create-new-patient');
    };

    return (
        <div className="all-patients-container rounded-box box-shadow">
            <div className="patients-inner-section">
                <SearchPatient />

                <div style={{ borderTop: '1px solid #ccc', margin: '5px 0', marginTop: '15px' }}></div>

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
