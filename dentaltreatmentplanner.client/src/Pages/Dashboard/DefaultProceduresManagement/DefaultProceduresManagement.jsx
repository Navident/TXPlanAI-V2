import "./DefaultProceduresManagement.css";
import TXicon from "../../../assets/tx-icon.svg";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Outlet } from "react-router-dom";
import DropdownSearch from "../../../Components/Common/DropdownSearch/DropdownSearch";
import { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import searchIcon from "../../../assets/search-icon.svg";
import TextField from "@mui/material/TextField";
import { CircularProgress } from "@mui/material";
import {
	StyledRoundedBoxContainer,
	StyledLightGreyText,
	StyledContainerWithTableInner,
	StyledSemiboldBlackTitle,
} from "../../../GlobalStyledComponents";
import { useGetCategoriesQuery, useGetSubcategoriesQuery } from '../../../Redux/ReduxSlices/CategoriesSubcategories/categoriesSubcategoriesApiSlice';


const DefaultProcedures = () => {
	const [inputText, setInputText] = useState("");
	const navigate = useNavigate();
	// API call to fetch categories
	const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();


	// API call to fetch subcategories
	const { data: subcategories = [], isLoading: subcategoriesLoading } = useGetSubcategoriesQuery();

	const [selectedSubcategories, setSelectedSubcategories] = useState({});

	const handleEditClick = (categoryId) => {
		const subcategory = selectedSubcategories[categoryId];

		// Find the category name using the category ID for navigation
		const category = categories.find(cat => cat.procedureCategoryId === categoryId)?.name;

		if (subcategory && category) {
			navigate(`/dashboard/defaultprocedures/procedurescustomizer/${category}/${subcategory.procedureSubCategoryId}`);
		}
	};


	const handleInputChange = (event) => {
		setInputText(event.target.value.toLowerCase());
	};

	const handleSubcategorySelect = (categoryId, subcategory) => {
		setSelectedSubcategories((prevSelected) => ({
			...prevSelected,
			[categoryId]: subcategory,
		}));
	};

	const categoryMatchesSearch = (category) => {
		return category.name.toLowerCase().includes(inputText);
	};

	const subcategoryMatchesSearch = (categoryId) => {
		return subcategories.some(sub =>
			sub.procedureCategoryId === categoryId &&
			sub.name.toLowerCase().includes(inputText)
		);
	};

	// Filter categories based on inputText
	const filteredCategories = categories.filter(category =>
		categoryMatchesSearch(category) || subcategoryMatchesSearch(category.procedureCategoryId)
	);

	// Check if current route is for editing a specific treatment plan
	const isEditingTreatmentPlan = location.pathname.includes("/procedurescustomizer/");

	if (isEditingTreatmentPlan) {
		return <Outlet />;
	}

	const isLoading = categoriesLoading || subcategoriesLoading;
	if (isLoading) {
		return (
			<div className="default-procedure-management-wrapper">
				<div className="loading-spinner">
					<CircularProgress
						style={{ color: "rgb(119, 119, 161)", margin: "auto" }}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="default-procedure-management-wrapper">
			<div className="dashboard-right-side-row">
				<StyledSemiboldBlackTitle>Tx Plan Settings</StyledSemiboldBlackTitle>
				<TextField
					className="rounded-box"
					placeholder="Search Procedure Categories"
					value={inputText}
					onChange={handleInputChange}
					sx={{
						width: "350px",
						backgroundColor: "white",
						"& label.Mui-focused": {
							color: "#7777a1",
						},
						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								borderColor: "rgba(0, 0, 0, 0)",
							},
							"&:hover fieldset": {
								borderColor: "#7777a1",
							},
							"&.Mui-focused fieldset": {
								borderColor: "#7777a1",
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
			<StyledRoundedBoxContainer>
				<StyledContainerWithTableInner>
					{filteredCategories.map((category) => (
						<div className="dropdown-container" key={category.procedureCategoryId}>
							<div className="dropdown-header large-text">{category.name}</div>
							<DropdownSearch
								items={subcategories.filter(subcategory => subcategory.procedureCategoryId === category.procedureCategoryId)}
								onSelect={(subcategory) =>
									handleSubcategorySelect(category.procedureCategoryId, subcategory)
								}
								selectedItem={selectedSubcategories[category.procedureCategoryId]}
								valueKey="procedureSubCategoryId"
								labelKey="name"
								width="100%"
								icon={<img src={TXicon} alt="TXicon" />}
							/>
							<div className="light-grey-text">
								Make a selection, then click{" "}
								<span className="underlined-text" onClick={() => handleEditClick(category.procedureCategoryId)}>
									Edit
								</span>
							</div>
						</div>
					))}
				</StyledContainerWithTableInner>
			</StyledRoundedBoxContainer>
		</div>
	);
};

export default DefaultProcedures;
