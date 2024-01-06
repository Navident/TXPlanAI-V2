import HeaderBar from "../Common/HeaderBar/HeaderBar";
import { Link } from 'react-router-dom';
import logo from '../../assets/navident-logo.svg';
import circleIcon from '../../assets/circle-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import Alert from '../Common/Alert/Alert';

import SideBar from "./SideBar/SideBar";
import './Dashboard.css';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getCategories, getTreatmentPlansBySubcategory, getSubCategoriesByCategoryName } from '../../ClientServices/apiService';
import { useBusiness } from '../../Contexts/useBusiness';


const Dashboard = () => {
    const [categories, setCategories] = useState([]);
    const [alertInfo, setAlertInfo] = useState({ open: false, type: '', message: '' });
    const handleCloseAlert = () => {
        setAlertInfo({ ...alertInfo, open: false });
    };
    const { businessName } = useBusiness();
    console.log("Business Name in Dashboard:", businessName);

    const fetchCategoriesAndDetails = async () => {
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
        }
    };
    useEffect(() => {
        console.log("Dashboard mounted. Received businessName:", businessName);

        fetchCategoriesAndDetails();
        setAlertInfo({ open: true, type: 'success', message: 'You have successfully logged in.' });
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
                    leftCornerElement={<img src={circleIcon} alt="Logo" />}
                    rightCornerElement={<div className="headerbar-business-name">{businessName}</div>}
                    className="dashboard-header"
                />
                <div className="tx-main-content">
                    <SideBar />
                    <div className="tx-content-area">                       
                        <Outlet context={{ categories }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
