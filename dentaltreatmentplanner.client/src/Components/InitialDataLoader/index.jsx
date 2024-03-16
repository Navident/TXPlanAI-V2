import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchInitialDataIfLoggedIn } from '../../Redux/sharedThunks';
import { initializeUser } from '../../Redux/ReduxSlices/User/userSlice';

const InitialDataLoader = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // First, initialize the user state from localStorage
        dispatch(initializeUser()).then(() => {
            // After the user state is initialized, fetch the initial data
            dispatch(fetchInitialDataIfLoggedIn());
        });
    }, [dispatch]);

    return null; 
};
export default InitialDataLoader;
