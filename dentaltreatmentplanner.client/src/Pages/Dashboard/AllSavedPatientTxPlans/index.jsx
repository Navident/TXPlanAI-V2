import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import searchIcon from "../../../assets/search-icon.svg";

import UniversalTable from "../../../Components/Common/UniversalTable/UniversalTable";
import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { StyledContainerWithTableInner, StyledRoundedBoxContainer } from "../../../GlobalStyledComponents";
import { selectPatientTreatmentPlans, removeTreatmentPlanById } from '../../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import { useSelector, useDispatch } from 'react-redux';
import PopupAlert from "../../../Components/Common/PopupAlert/index";
import { showAlert } from '../../../Redux/ReduxSlices/Alerts/alertSlice';
import { useDeleteTreatmentPlanByIdMutation } from '../../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansApiSlice';

const AllSavedPatientTxPlans = () => {
	const dispatch = useDispatch();
	const [inputText, setInputText] = useState("");
	const navigate = useNavigate();
	const patientTreatmentPlans = useSelector(selectPatientTreatmentPlans);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogContent, setDialogContent] = useState('');
	const [dialogTitle, setDialogTitle] = useState('');
	const [planToDelete, setPlanToDelete] = useState(null);
	const [deleteTreatmentPlanById] = useDeleteTreatmentPlanByIdMutation();

	const handleOpenClick = (planId) => {
		navigate(`/customize-treatment-plan/${planId}`);
	};

	const handleInputChange = (event) => {
		setInputText(event.target.value.toLowerCase());
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString("en-CA", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "numeric",
			hour12: true,
			minute: "2-digit",
		});
	};

	const handleDeleteClick = (planId) => {
		setPlanToDelete(planId);
		setDialogTitle("Confirm Deletion");
		setDialogContent("Are you sure you want to delete this treatment plan?");
		setIsDialogOpen(true);
	};

	const handleClose = () => {
		setIsDialogOpen(false);
	};

	const handleAgree = async () => {
		if (planToDelete) {
			try {
				// Attempt to delete the treatment plan and await the result
				await deleteTreatmentPlanById(planToDelete).unwrap();

				// If successful, proceed with the following actions
				dispatch(removeTreatmentPlanById(planToDelete)); 
				dispatch(showAlert({ type: 'success', message: 'Successfully deleted treatment plan!' }));
			} catch (error) {
				// Handle any errors that occur during the deletion process
				console.error("Error deleting treatment plan: ", error);
				dispatch(showAlert({ type: 'error', message: 'Failed to delete treatment plan' }));
			}
		}

		setIsDialogOpen(false); // Close the dialog in both cases
		setPlanToDelete(null); // Reset the planToDelete after handling
	};



	const headers = ["Date", "TX Description", "Treatment Plan ID", ""];


	// Update rows
	const rows = patientTreatmentPlans.map((plan) => {
		const date = plan.createdAt ? formatDate(plan.createdAt) : "N/A";
		const patientName = plan.description || "Unknown";

		const buttons = (
			<div className="savedPatientsTxTableButtons">
				<RoundedButton
					text="Open"
					backgroundColor="#7777a1"
					textColor="white"
					border={false}
					width="120px"
					className="purple-button-hover"
					onClick={() => handleOpenClick(plan.treatmentPlanId)}
				/>
				<RoundedButton
					text="Delete"
					backgroundColor="white"
					textColor="red"
					border={true}
					width="120px"
					borderColor="#7777a1"
					onClick={() => handleDeleteClick(plan.treatmentPlanId)}
					className="outline-button-hover"
				/>
			</div>
		);
		return {
			data: [date, patientName, plan.treatmentPlanId, buttons],
		};
	});

	return (

		<div className="dashboard-bottom-inner-row">
			{isDialogOpen && (
				<PopupAlert
					title={dialogTitle}
					content={dialogContent}
					open={isDialogOpen}
					onClose={handleClose}
					onAgree={handleAgree}
				/>
			)}
			<div className="dashboard-right-side-row">
				<div className="large-text">All Saved Patient Tx Plans</div>
				<TextField
					className="rounded-box"
					placeholder="Search By Date"
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
					<UniversalTable headers={headers} rows={rows} />
					<Outlet />
				</StyledContainerWithTableInner>
			</StyledRoundedBoxContainer>
		</div>
	);
};

export default AllSavedPatientTxPlans;
