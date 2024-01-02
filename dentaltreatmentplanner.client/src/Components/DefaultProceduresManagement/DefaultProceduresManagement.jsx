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
        getCategories((fetchedCategories) => {
            console.log("Fetched Categories with Structure:", fetchedCategories);
            // Initialize subcategories with a status
            const categoriesWithStatus = fetchedCategories.map(category => ({
                ...category,
                subCategories: [],
                subCategoriesStatus: 'not_fetched'
            }));
            setCategories(categoriesWithStatus);
        });
    }, []);

    useEffect(() => { //we are going to have to make this more efficient, this is using a lot of nested loops.
        categories.forEach(category => {
            if (category.subCategoriesStatus === 'not_fetched') {
                getSubCategoriesByCategoryName(category.name, (subCategories) => {
                    // Update categories with fetched subcategories and change their status
                    setCategories(prevCategories => prevCategories.map(cat =>
                        cat.name === category.name ? {
                            ...cat,
                            subCategories: subCategories.map(subCat => ({ ...subCat, treatmentPlansStatus: 'not_fetched' })),
                            subCategoriesStatus: 'fetched'
                        } : cat
                    ));

                    // Fetch treatment plans for each subcategory
                    subCategories.forEach(subCategory => {
                        if (subCategory.treatmentPlansStatus === 'not_fetched') {
                            getTreatmentPlansBySubcategory(subCategory.name, (treatmentPlans) => {
                                setCategories(prevCategories => prevCategories.map(cat =>
                                    cat.name === category.name ? {
                                        ...cat,
                                        subCategories: cat.subCategories.map(subCat =>
                                            subCat.name === subCategory.name ? { ...subCat, treatmentPlans, treatmentPlansStatus: 'fetched' } : subCat
                                        )
                                    } : cat
                                ));
                            });
                        }
                    });
                });
            }
        });
    }, [categories]);



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
