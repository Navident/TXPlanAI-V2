import useTreatmentPlan from '../../Contexts/TreatmentPlanContext/useTreatmentPlan';
import Alert from '../../Components/Common/Alert/Alert';

const AlertWrapper = () => {
    const { alertInfo, closeAlert } = useTreatmentPlan();

    return alertInfo.open ? (
        <Alert
            open={alertInfo.open}
            handleClose={closeAlert}
            type={alertInfo.type}
            message={alertInfo.message}
        />
    ) : null;
};

export default AlertWrapper;