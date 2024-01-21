import HeaderBar from "../Common/HeaderBar/HeaderBar";
import { Link } from 'react-router-dom';
import logo from '../../assets/navident-logo.svg';
import circleIcon from '../../assets/circle-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import Alert from '../Common/Alert/Alert';
import { useNavigate } from 'react-router-dom';

import SideBar from "./SideBar/SideBar";
import './Dashboard.css';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getCategories, getTreatmentPlansBySubcategory, getSubCategoriesByCategoryName, getPatientsForUserFacility } from '../../ClientServices/apiService';
import { useBusiness } from '../../Contexts/BusinessContext/useBusiness';


const Dashboard = () => {
    const [categories, setCategories] = useState([]);
    const [alertInfo, setAlertInfo] = useState({ open: false, type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { businessName } = useBusiness();
    const navigate = useNavigate();

    const handleCloseAlert = () => {
        setAlertInfo({ ...alertInfo, open: false });
    };

    const handleLogoClick = () => {
        navigate('/'); // Redirects to the root page
    };

    const fetchCategoriesAndDetails = async () => {
        setIsLoading(true);

        try {
            const fetchedCategories = await getCategories();

            const categoriesWithSubcategories = await Promise.all(
                fetchedCategories.map(async (category) => {
                    const subCategories = await getSubCategoriesByCategoryName(category.name);
                    const subCategoriesWithTreatmentPlans = await Promise.all(
                        subCategories.map(async (subCategory) => {
                            const treatmentPlans = await getTreatmentPlansBySubcategory(subCategory.name);
                            return {
                                ...subCategory,
                                treatmentPlans,
                                treatmentPlansStatus: treatmentPlans ? 'fetched' : 'not_fetched'
                            };
                        })
                    );
                    return {
                        ...category,
                        subCategories: subCategoriesWithTreatmentPlans,
                        subCategoriesStatus: 'fetched'
                    };
                })
            );

            setCategories(categoriesWithSubcategories);
        } catch (error) {
            console.error('Error fetching category data:', error);
        } finally {
            setIsLoading(false);

        }
    };

    useEffect(() => {
        fetchCategoriesAndDetails();

        // Check if the alert has been shown in this session
        if (!sessionStorage.getItem('alertShown')) {
            setAlertInfo({ open: true, type: 'success', message: 'You have successfully logged in.' });
            sessionStorage.setItem('alertShown', 'true');
        }
    }, []);
    return (
        <div className="dashboard-wrapper">
            {alertInfo.type && (
                <Alert
                    open={alertInfo.open}
                    handleClose={handleCloseAlert}
                    type={alertInfo.type}
                    message={alertInfo.message}
                />
            )}
            <div className="tx-container">
                <HeaderBar
                    leftCornerElement={<img src={logo} alt="Logo" className="navident-logo" onClick={handleLogoClick} />}
                    rightCornerElement={<div className="headerbar-business-name">{businessName}</div>}
                    className="dashboard-header"
                />
                <div className="tx-main-content">
                    <SideBar />
                    <div className="tx-content-area">                       
                        <Outlet context={{ categories, isLoading }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
