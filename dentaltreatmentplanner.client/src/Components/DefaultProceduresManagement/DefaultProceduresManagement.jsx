import './DefaultProceduresManagement.css';
import TXicon from '../../assets/tx-icon.svg';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import DropdownSearch from "../Common/DropdownSearch/DropdownSearch";
import { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import searchIcon from '../../assets/search-icon.svg';
import TextField from '@mui/material/TextField';

const DefaultProcedures = () => {
    const { categories } = useOutletContext();
    const [inputText, setInputText] = useState('');
    const navigate = useNavigate();
    const [selectedSubcategories, setSelectedSubcategories] = useState({});

    const handleEditClick = (categoryId) => {
        const subcategory = selectedSubcategories[categoryId];
        const category = categories.find(cat => cat.procedureCategoryId === categoryId)?.name;
        if (subcategory && category) {
            navigate(`/dashboard/defaultprocedures/procedurescustomizer/${category}/${subcategory.name}`);
        }
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value.toLowerCase());
    };

    const handleSubcategorySelect = (categoryId, subcategory) => {
        setSelectedSubcategories(prevSelected => ({
            ...prevSelected,
            [categoryId]: subcategory
        }));
    };

    // Filter categories based on inputText
    const filteredCategories = inputText
        ? categories.filter(category => category.name.toLowerCase().includes(inputText))
        : categories;

    // Check if the current route is for editing a specific treatment plan
    const isEditingTreatmentPlan = location.pathname.includes("/procedurescustomizer/");

    return (
        isEditingTreatmentPlan ? (
            <Outlet />
        ) : (
                <div className="default-procedure-management-wrapper">
                    <div className="dashboard-right-side-row">
                        <div className="semibold-black-title">Tx Plan Settings</div>
                        <TextField
                            className="box-shadow"
                            placeholder="Search Procedure Categories"
                            value={inputText}
                            onChange={handleInputChange}
                            sx={{
                                width: '350px',
                                backgroundColor: 'white',
                                '& label.Mui-focused': {
                                    color: '#7777a1',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#7777a1',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7777a1',
                                    },
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img src={searchIcon} alt="Search" />
                                    </InputAdornment>
                                ),
                            }}
                            />
                    </div>
                <div className="edit-procedures-container rounded-box box-shadow">
                    <div className="edit-procedures-inner">
                            {filteredCategories.map(category => (
                                <div className="dropdown-container" key={category.procedureCategoryId}>
                                    <div className="dropdown-header large-text">{category.name}</div>
                                    <DropdownSearch
                                        items={category.subCategories}
                                        onSelect={(subcategory) => handleSubcategorySelect(category.procedureCategoryId, subcategory)}
                                        selectedItem={selectedSubcategories[category.procedureCategoryId]}
                                        valueKey="procedureSubCategoryId"
                                        labelKey="name"
                                        width="100%"
                                        icon={<img src={TXicon} alt="TXicon" />}
                                    />
                                    <div className="light-grey-text">
                                        Make a selection, then click <span className="underlined-text" onClick={() => handleEditClick(category.procedureCategoryId)}>Edit</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        )
    );
};

export default DefaultProcedures;

