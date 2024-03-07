import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import searchIcon from "../../../assets/search-icon.svg";
import {
	getTreatmentPlansByPatient,
	deleteTreatmentPlanById,
} from "../../../ClientServices/apiService";
import { useParams } from "react-router-dom";
import UniversalTable from "../../../Components/Common/UniversalTable/UniversalTable";
import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import { useBusiness } from '../../../Contexts/BusinessContext/useBusiness';
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { StyledContainerWithTableInner, StyledRoundedBoxContainer } from "../../../GlobalStyledComponents";
import { selectPatientTreatmentPlans, removeTreatmentPlanById } from '../../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import { useSelector, useDispatch } from 'react-redux';

const AllSavedPatientTxPlans = () => {
	const dispatch = useDispatch();
	const [inputText, setInputText] = useState("");
	const navigate = useNavigate();
	const patientTreatmentPlans = useSelector(selectPatientTreatmentPlans);
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

	const handleDeleteClick = async (planId) => {
		const confirmed = window.confirm("Are you sure you want to delete this treatment plan?");
		if (confirmed) {
			const success = await deleteTreatmentPlanById(planId);
			if (success) {
				dispatch(removeTreatmentPlanById(planId));
				alert("Treatment plan deleted successfully.");
			} else {
				alert("Failed to delete treatment plan.");
			}
		}
	};

	const headers = ["Date", "Patient Name", "Treatment Plan ID", ""];


	// Update rows
	const rows = patientTreatmentPlans.map((plan) => {
		const date = plan.createdAt ? formatDate(plan.createdAt) : "N/A";
		const patientName = plan.patientName || "Unknown";

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
