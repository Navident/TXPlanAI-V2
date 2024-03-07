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
import { useSelector } from 'react-redux';
import { selectCategoriesAndSubcategories } from '../../../Redux/ReduxSlices/CategoriesSubcategories/categoriesSubcategoriesSlice';
import {
	StyledRoundedBoxContainer,
	StyledLightGreyText,
	StyledContainerWithTableInner,
	StyledSemiboldBlackTitle,
} from "../../../GlobalStyledComponents";

const DefaultProcedures = () => {
	const { isLoading } = useOutletContext();
	const categories = useSelector(selectCategoriesAndSubcategories);
	const [inputText, setInputText] = useState("");
	const navigate = useNavigate();
	const [selectedSubcategories, setSelectedSubcategories] = useState({});

	const handleEditClick = (categoryId) => {
		const subcategory = selectedSubcategories[categoryId];
		console.log("subcategory in handleeditclick", subcategory);
		console.log("subcategory.procedureSubcategoryId in handleeditclick", subcategory.procedureSubCategoryId); 
		const category = categories.find(
			(cat) => cat.procedureCategoryId === categoryId
		)?.name;
		if (subcategory && category) {
			navigate(
				`/dashboard/defaultprocedures/procedurescustomizer/${category}/${subcategory.procedureSubCategoryId}`
			);
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

	// Filter categories based on inputText
	const filteredCategories = inputText
		? categories.filter(category => category.name.toLowerCase().includes(inputText))
		: categories;

	// Check if current route is for editing a specific treatment plan
	const isEditingTreatmentPlan = location.pathname.includes(
		"/procedurescustomizer/"
	);

	if (isEditingTreatmentPlan) {
		return <Outlet />;
	}

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
						<div
							className="dropdown-container"
							key={category.procedureCategoryId}
						>
							<div className="dropdown-header large-text">{category.name}</div>
							<DropdownSearch
								items={category.subCategories}
								onSelect={(subcategory) =>
									handleSubcategorySelect(
										category.procedureCategoryId,
										subcategory
									)
								}
								selectedItem={
									selectedSubcategories[category.procedureCategoryId]
								}
								valueKey="procedureSubCategoryId"
								labelKey="name"
								width="100%"
								icon={<img src={TXicon} alt="TXicon" />}
							/>
							<div className="light-grey-text">
								Make a selection, then click{" "}
								<span
									className="underlined-text"
									onClick={() => handleEditClick(category.procedureCategoryId)}
								>
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
