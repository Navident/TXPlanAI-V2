import RoundedButton from "../../Common/RoundedButton/RoundedButton";
import { useBusiness } from '../../../Contexts/BusinessContext/useBusiness';
import { useNavigate, useLocation } from 'react-router-dom';

const PatientInfoSection = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { selectedPatient } = useBusiness();

    const handleViewSavedTxPlansClick = () => {
        if (selectedPatient && selectedPatient.patientId) {
            navigate(`/PatientManagementDashboard/saved-patient-tx-plans/${selectedPatient.patientId}`);
        } else {
            // Handle the case where no patient is selected
            alert('Please select a patient first.');
        }
    };

    const handleCreateNewTxPlanClick = () => {
            navigate(`/PatientManagementDashboard`);
    };

    // Determine which button to show based on the current route
    const showCreateNewTxPlanButton = location.pathname.includes("/saved-patient-tx-plans");
    const showViewSavedTxPlansButton = location.pathname === "/PatientManagementDashboard";

    return (
        <div className="patient-info-section rounded-box box-shadow">
            <div className="patient-info-inner-container ">
                <div className="grid-item">
                    <div className="grid-item-1-inner large-text">
                        {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : "Select a patient"}
                    </div>
                </div>
                <div className="grid-item">
                    <div className="grid-item-2-inner">
                        <div className="large-text grid-item-2-label">DOB:
                            <div>{selectedPatient ? new Date(selectedPatient.dateOfBirth).toLocaleDateString("en-CA") : ""}</div>
                        </div>
                        <div className="large-text grid-item-2-label">PATIENT ID:
                            <div> {selectedPatient ? selectedPatient.patientId : ""} </div>
                        </div>
                    </div>
                </div>
                <div className="grid-item">
                    <div className="patient-info-inner-buttons">
                        {showCreateNewTxPlanButton && (
                            <RoundedButton
                                text="Create New TX Plan"
                                backgroundColor="#7777a1"
                                textColor="white"
                                border={false}
                                width="fit-content"
                                className="purple-button-hover"
                                onClick={handleCreateNewTxPlanClick}
                            />
                        )}
                        {showViewSavedTxPlansButton && (
                            <RoundedButton
                                text="View Saved TX Plans"
                                backgroundColor="white"
                                textColor="#7777a1"
                                border={true}
                                width="fit-content"
                                borderColor="#7777a1"
                                className="outline-button-hover"
                                onClick={handleViewSavedTxPlansClick}
                            />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PatientInfoSection;
