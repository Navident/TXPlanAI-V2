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
import "./SavedPatientTxPlans.css";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
	StyledContainerWithTableInner,
	StyledRoundedBoxContainer,
} from "../../../GlobalStyledComponents";
import PatientInfoSection from "../../../Components/PatientInfoSection/PatientInfoSection";

const SavedPatientTxPlans = () => {
	const [inputText, setInputText] = useState("");
	const { patientId } = useParams();
	const navigate = useNavigate();
	const [localTreatmentPlans, setLocalTreatmentPlans] = useState([]);

	useEffect(() => {
		if (patientId) {
			fetchTreatmentPlansByPatientId(patientId);
		}
	}, [patientId]);

	const handleOpenClick = (planId) => {
		navigate(`/customize-treatment-plan/${planId}`);
	};

	const handleInputChange = (event) => {
		setInputText(event.target.value.toLowerCase());
	};

	const fetchTreatmentPlansByPatientId = async (id) => {
		try {
			const plans = await getTreatmentPlansByPatient(id);
			setLocalTreatmentPlans(plans || []);
		} catch (error) {
			console.error("Error fetching treatment plans:", error);
		}
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
		const confirmed = window.confirm(
			"Are you sure you want to delete this treatment plan?"
		);
		console.log("selected plan id to delete: ", planId);
		if (confirmed) {
			const success = await deleteTreatmentPlanById(planId);
			if (success) {
				// Remove the deleted plan from local state to update the UI
				const updatedPlans = localTreatmentPlans.filter(
					(plan) => plan.treatmentPlanId !== planId
				);
				setLocalTreatmentPlans(updatedPlans);
				alert("Treatment plan deleted successfully.");
			} else {
				// Handle deletion failure (e.g., display an error message)
				alert("Failed to delete treatment plan.");
			}
		}
	};

	const headers = ["Date", "Treatment Plan ID", ""];

	// Update rows
	const rows = localTreatmentPlans.map((plan) => {
		const date = plan.createdAt ? formatDate(plan.createdAt) : "N/A";

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
			data: [date, plan.treatmentPlanId, buttons],
		};
	});

	return (
		<div className="dashboard-bottom-inner-row">
			<PatientInfoSection />
			<div className="dashboard-right-side-row">
				<div className="large-text">Saved Tx Plans</div>
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
				</StyledContainerWithTableInner>
			</StyledRoundedBoxContainer>
		</div>
	);
};

export default SavedPatientTxPlans;
