import Alert from '../../Components/Common/Alert/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { selectAlertInfo, closeAlert } from '../../Redux/ReduxSlices/Alerts/alertSlice';

const AlertWrapper = () => {

    const alertInfo = useSelector(selectAlertInfo);
    const dispatch = useDispatch();

    const handleCloseAlert = () => {
        dispatch(closeAlert());
    };

    return alertInfo.open ? (
        <Alert
            open={alertInfo.open}
            handleClose={handleCloseAlert}
            type={alertInfo.type}
            message={alertInfo.message}
        />
    ) : null;
};

export default AlertWrapper;