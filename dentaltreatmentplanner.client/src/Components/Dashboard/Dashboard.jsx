import HeaderBar from "../Common/HeaderBar/HeaderBar";
import { Link } from 'react-router-dom';
import logo from '../../assets/navident-logo.svg';
import circleIcon from '../../assets/circle-icon.svg';
import userIcon from '../../assets/user-icon.svg';

import SideBar from "./SideBar/SideBar";
import './Dashboard.css';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getCategories, getTreatmentPlansBySubcategory, getSubCategoriesByCategoryName } from '../../ClientServices/apiService';


const Dashboard = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
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

        fetchCategoriesAndDetails();
    }, []);
    return (
        <div className="dashboard-wrapper">
            <div className="tx-container">
                <HeaderBar
                    leftCornerElement={<img src={circleIcon} alt="Logo" />}
                    rightCornerElement={<img src={userIcon} alt="User Icon" />}
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
