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

	const parseLineToPlan = async (line, lineIndex) => {
		// Splitting the line based on " - " to separate the tooth number and subcategory
		const [toothNumberPart, subcategory] = line
			.split(" - ")
			.map((part) => part.trim());
		const toothNumber = parseInt(toothNumberPart.replace("#", ""));

		const plans = await getTreatmentPlansBySubcategory(subcategory);
		if (plans && plans.length > 0) {
			return { ...plans[0], toothNumber, lineIndex };
		}
		return null;
	};

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
			const aiResponsePreprocessedInputText = await runGeminiPro(inputText);
			const lines = aiResponsePreprocessedInputText.split("\n");
			const planPromises = lines.map((line, index) => parseLineToPlan(line, index));
			let newTreatmentPlans = (await Promise.all(planPromises)).filter(plan => plan !== null);

			if (newTreatmentPlans.length > 0) {
				const combinedTreatmentPlan = newTreatmentPlans.reduce((acc, currPlan, currPlanIndex) => {
					const visitsWithOrigin = currPlan.visits.map(visit => ({
						...visit,
						originLineIndex: currPlan.lineIndex, // Use lineIndex to track origin
					})).map(visit => {
						// Insert tooth number into each cdtCodeMap where it's null
						const updatedCdtCodes = visit.cdtCodes.map(cdtCodeMap => {
							return { ...cdtCodeMap, toothNumber: cdtCodeMap.toothNumber ?? currPlan.toothNumber };
						});
						return { ...visit, cdtCodes: updatedCdtCodes };
					});

					acc.visits = [...acc.visits, ...visitsWithOrigin];
					return acc;
				}, { visits: [] });

				// Sort the combined visits by their origin line index before setting the plan
				combinedTreatmentPlan.visits.sort((a, b) => a.originLineIndex - b.originLineIndex || a.visitNumber - b.visitNumber);

				// Now set the combined plan as the only treatment plan
				setTreatmentPlans([combinedTreatmentPlan]);
			}
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
