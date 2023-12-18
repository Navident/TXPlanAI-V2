import './DefaultProcedures.css';
import HeaderBar from "../HeaderBar/HeaderBar";
import circleIcon from '../../assets/circle-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import editIcon from '../../assets/pencil-edit-icon.svg';
import { useNavigate } from 'react-router-dom';


import { useState, useEffect } from 'react';
const DefaultProcedures = () => {
    const [subCategories, setSubCategories] = useState([]);

    const navigate = useNavigate();

    const handleEditClick = (subcategoryName) => {
        navigate(`/ProceduresCustomizer/${subcategoryName}`);
    };

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const response = await fetch('https://localhost:7089/api/ProcedureCategory/subcategories/Crowns');
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                const data = await response.json();
                console.log('Data:', data);
                setSubCategories(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchSubCategories();
    }, []);

    return (
        <div className="tx-container">
            <HeaderBar
                leftCornerElement={<img src={circleIcon} alt="Circle Icon" />}
                rightCornerElement={<img src={userIcon} alt="User Icon" />}
                className="dashboard-header"
            />
            <div className="tx-main-content">
                <div className="tx-content-area">
                    <div className="large-text">Procedure Defaults</div>
                    <div className="edit-procedures-container">
                        <div className="edit-procedures-inner">
                            <div className="large-text">Procedure Categories</div>
                            <div className="table-container">
                                <div className="edit-procedures-table-outer-header">Crowns</div>
                                <table className="tx-table">
                                    <thead>
                                        <tr className="table-inner-header">
                                            <th>Sub-Categories</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subCategories.map(subCategory => (
                                            <tr key={subCategory.procedureSubCategoryId}>
                                                <td>{subCategory.name}

                                                    <img src={editIcon} className="edit-button" alt="Edit" onClick={() => handleEditClick(subCategory.name)} />

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefaultProcedures;
