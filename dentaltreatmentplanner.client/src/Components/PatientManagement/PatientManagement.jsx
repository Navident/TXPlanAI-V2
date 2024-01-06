import HeaderBar from "../Common/HeaderBar/HeaderBar";

import { useBusiness } from '../../Contexts/useBusiness';

const PatientManagement = ({ open, handleClose, type, message }) => {
    const { businessName } = useBusiness();

    return (
        <div className="patient-management-wrapper">
            <div className="tx-container">
                <div className="tx-main-content">
                    <div className="tx-content-area">
                        <HeaderBar
                            leftCornerElement={<img src={circleIcon} alt="Logo" />}
                            rightCornerElement={<div className="headerbar-business-name">{businessName}</div>}
                            className="dashboard-header"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientManagement;
