import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchInitialDataIfLoggedIn } from '../../Redux/sharedThunks';

const InitialDataLoader = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchInitialDataIfLoggedIn());
    }, [dispatch]);

    return null; 
};
export default InitialDataLoader;
