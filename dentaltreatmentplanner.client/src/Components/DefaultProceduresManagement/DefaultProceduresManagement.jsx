import './DefaultProceduresManagement.css';
import HeaderBar from "../Common/HeaderBar/HeaderBar";
import circleIcon from '../../assets/circle-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import editIcon from '../../assets/pencil-edit-icon.svg';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


import { useState, useEffect } from 'react';
import { getCategories, getTreatmentPlansBySubcategory, getSubCategoriesByCategoryName } from '../../ClientServices/apiService';

const DefaultProcedures = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getCategories(async (fetchedCategories) => {
            console.log("Fetched Categories with Structure:", fetchedCategories);
            const categoriesWithStatus = fetchedCategories.map(category => ({
                ...category,
                subCategories: [],
                subCategoriesStatus: 'not_fetched'
            }));

            // Fetch subcategories and treatment plans in parallel
            const categoriesWithSubcategories = await Promise.all(
                categoriesWithStatus.map(async (category) => {
                    const subCategories = await fetchSubCategories(category.name);
                    const subCategoriesWithTreatmentPlans = await fetchTreatmentPlansForSubCategories(subCategories);
                    return {
                        ...category,
                        subCategories: subCategoriesWithTreatmentPlans,
                        subCategoriesStatus: 'fetched'
                    };
                })
            );

            setCategories(categoriesWithSubcategories);
        });
    }, []);

    const fetchSubCategories = async (categoryName) => {
        const subCategories = await getSubCategoriesByCategoryName(categoryName);
        return subCategories.map(subCat => ({
            ...subCat,
            treatmentPlans: [],
            treatmentPlansStatus: 'not_fetched'
        }));
    };

    const fetchTreatmentPlansForSubCategories = async (subCategories) => {
        return Promise.all(
            subCategories.map(async (subCategory) => {
                const treatmentPlans = await getTreatmentPlansBySubcategory(subCategory.name);
                return {
                    ...subCategory,
                    treatmentPlans,
                    treatmentPlansStatus: treatmentPlans ? 'fetched' : 'not_fetched'
                };
            })
        );
    };



    const handleEditClick = (subcategoryName) => {
        navigate(`/dashboard/defaultprocedures/procedurescustomizer/${subcategoryName}`);
    };
    // Check if the current route is for editing a specific treatment plan
    const isEditingTreatmentPlan = location.pathname.includes("/procedurescustomizer/");

    return (
        isEditingTreatmentPlan ? (
            <Outlet />
        ) : (
            <div className="default-procedure-management-wrapper">
                <div className="large-text">Procedure Defaults</div>

                <div className="edit-procedures-container rounded-box">
                    <div className="edit-procedures-inner">
                        <div className="centered-title large-text">Procedure Categories</div>
                        {categories.map(category => (
                            <div className="table-container" key={category.procedureCategoryId}>
                                <div className="edit-procedures-table-outer-header large-text">{category.name}</div>
                                <table className="tx-table">
                                    <thead>
                                        <tr className="table-inner-header">
                                            <th>Sub-Categories</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {category.subCategories?.map(subCategory => (
                                            <tr key={subCategory.procedureSubCategoryId}>
                                                <td>
                                                    {subCategory.name}
                                                    <img src={editIcon} className="edit-button" alt="Edit" onClick={() => handleEditClick(subCategory.name)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    );

};
export default DefaultProcedures;
