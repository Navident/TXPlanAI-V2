import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import { TextField } from "@mui/material";
import PenIcon from "../../../assets/pen-icon.svg";
import { useState, useEffect } from "react";
import { getTreatmentPlansBySubcategory } from "../../../ClientServices/apiService";
import TreatmentPlanOutput from "../../TreatmentPlanOutput/TreatmentPlanOutput";
import useTreatmentPlan from "../../../Contexts/TreatmentPlanContext/useTreatmentPlan";
import {
	generateTreatmentPlan,
	getTreatmentPlanById,
} from "../../../ClientServices/apiService";
import { useBusiness } from "../../../Contexts/BusinessContext/useBusiness";
import { StyledContainerWithTableInner } from "../../../GlobalStyledComponents";
import { runGeminiPro } from "../../../GeminiPro/geminiProRunner";
import { CircularProgress } from "@mui/material";

const GenerateTreatmentPlan = () => {
	const {
		treatmentPlans,
		setTreatmentPlans,
		treatmentPlanId,
		setTreatmentPlanId,
		setTreatmentPlan,
		cdtCodes,
		handleAddVisit,
		onDeleteVisit,
		onUpdateVisitsInTreatmentPlan,
		selectedPayer,
		showAlert,
	} = useTreatmentPlan();

	const [inputText, setInputText] = useState("");
	const {
		fetchFacilityPayerCdtCodeFees,
		selectedPatient,
		facilityPayerCdtCodeFees,
	} = useBusiness();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (treatmentPlanId) {
			getTreatmentPlanById(treatmentPlanId).then((fetchedPlan) => {
				if (fetchedPlan) {
					setTreatmentPlan(fetchedPlan);
				}
			});
		}
	}, [treatmentPlanId, setTreatmentPlans]);

	useEffect(() => {
		if (selectedPayer) {
			fetchFacilityPayerCdtCodeFees(selectedPayer.payerId);
		}
	}, [selectedPayer]);

	const handleInputChange = (event) => {
		setInputText(event.target.value);
	};


	// Utility function to preprocess input text and maintain order
	async function preprocessInputText(inputText) {
		console.log("inputText sent to ai", inputText);
		const aiResponse = await runGeminiPro(inputText);
		console.log("aiResponsePreprocessedInputText", aiResponse);
		const parsedResponse = JSON.parse(aiResponse);
		// Convert to array of [toothNumber, treatments, originalOrder] to maintain original input order
		return Object.entries(parsedResponse).map((entry, index) => [...entry, index]);
	}

	// Utility function to fetch and process treatments with order maintained
	async function fetchAndProcessTreatments(treatmentEntries) {
		let allVisits = [];
		let visitIdCounter = 0;

		for (const [toothNumber, treatments, originalOrder] of treatmentEntries) {
			for (const treatment of treatments) {
				const plans = await getTreatmentPlansBySubcategory(treatment);
				if (plans && plans.length > 0) {
					const plan = plans[0];
					plan.visits.forEach(visit => {
						visit.visitId = `custom-${visitIdCounter++}`;
						visit.cdtCodes = visit.cdtCodes.map(cdtCode => ({
							...cdtCode,
							toothNumber: toothNumber
						}));
						visit.originLineIndex = originalOrder; // Use the original order for sorting
					});
					allVisits.push(...plan.visits);
				}
			}
		}

		// Sort visits by originLineIndex and then by visitNumber
		allVisits.sort((a, b) => a.originLineIndex - b.originLineIndex || a.visitNumber - b.visitNumber);
		return allVisits;
	}


	// Main function to generate treatment plan
	const handleGenerateTreatmentPlan = async () => {
		if (!inputText.trim()) {
			showAlert("error", "Please enter some text to generate a treatment plan.");
			return;
		}
		if (!selectedPatient) {
			showAlert("error", "Please select a patient before generating a treatment plan.");
			return;
		}
		setIsLoading(true);

		try {
			const treatmentEntries = await preprocessInputText(inputText);
			const allVisits = await fetchAndProcessTreatments(treatmentEntries);
			const combinedTreatmentPlan = { visits: allVisits };
			console.log("Final Consolidated Treatment Plan:", combinedTreatmentPlan);
			setTreatmentPlans([combinedTreatmentPlan]);
		} catch (error) {
			showAlert("error", "An error occurred while generating the treatment plan.");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};


	return (
		<div className="dashboard-bottom-inner-row">
			<div className="large-text">Create New TX Plan</div>
			<div className="create-treatment-plan-section rounded-box box-shadow">
				<div className="create-treatment-plan-section-inner">
					<img src={PenIcon} alt="Edit" />
					<div className="large-text">
						What can I help you treatment plan today?
					</div>
					<TextField
						label="Input your text"
						multiline
						minRows={3}
						value={inputText}
						onChange={handleInputChange}
						sx={{
							width: "100%",
							backgroundColor: "white",
							"& label.Mui-focused": {
								color: "#7777a1",
							},
							"& .MuiOutlinedInput-root": {
								"& fieldset": {
									borderColor: "#ccc",
								},
								"&:hover fieldset": {
									borderColor: "#7777a1",
								},
								"&.Mui-focused fieldset": {
									borderColor: "#7777a1",
								},
							},
						}}
					/>
					<RoundedButton
						text="Generate Treatment Plan"
						backgroundColor="#7777a1"
						textColor="white"
						border={false}
						width="fit-content"
						onClick={handleGenerateTreatmentPlan}
						className="purple-button-hover"
					/>
				</div>
			</div>
			<div className="treatment-plan-output-section rounded-box box-shadow">
				<div className="treatment-plan-output-section-inner">
					<StyledContainerWithTableInner>
						<div className="large-text">Treatment Plan</div>
						{isLoading ? (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "100%",
								}}
							>
								<CircularProgress style={{ color: "#7777a1" }} />
							</div>
						) : (
							treatmentPlans.map((plan, index) => (
								<TreatmentPlanOutput
									key={`treatment-plan-${index}`}
									treatmentPlan={plan}
									treatmentPlans={treatmentPlans}
									cdtCodes={cdtCodes}
									onAddVisit={(newVisit) =>
										handleAddVisit(plan.treatmentPlanId, newVisit)
									}
									onUpdateVisitsInTreatmentPlan={(updatedVisits) =>
										onUpdateVisitsInTreatmentPlan(
											plan.treatmentPlanId,
											updatedVisits
										)
									}
									onDeleteVisit={(deletedVisitId) =>
										onDeleteVisit(plan.treatmentPlanId, deletedVisitId)
									}
									showToothNumber={true}
									isInGenerateTreatmentPlanContext={true}
								/>
							))
						)}
					</StyledContainerWithTableInner>
				</div>
			</div>
		</div>
	);
};

export default GenerateTreatmentPlan;