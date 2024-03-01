import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import TxViewCustomizationToolbar from "../../../Components/TxViewCustomizationToolbar/index";

import { TextField } from "@mui/material";
import PenIcon from "../../../assets/pen-icon.svg";
import { useState, useEffect } from "react";
import TreatmentPlanOutput from "../../TreatmentPlanOutput/TreatmentPlanOutput";
import useTreatmentPlan from "../../../Contexts/TreatmentPlanContext/useTreatmentPlan";
import { useBusiness } from "../../../Contexts/BusinessContext/useBusiness";
import {
	StyledContainerWithTableInner,
	StyledLargeText,
	StyledSeparator,
} from "../../../GlobalStyledComponents";
import { runGeminiPro } from "../../../GeminiPro/geminiProRunner";
import { CircularProgress } from "@mui/material";
import {
	setSortBy,
	setActiveTxCategories,
	selectSortBy,
	selectActiveTxCategories,
} from "../../../Redux/ReduxSlices/TableViewControls/tableViewControlSlice";
import { useDispatch, useSelector } from "react-redux";
import { onDeleteVisit } from "../../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice";
import { selectSelectedPayer } from "../../../Redux/ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice";
import { showAlert } from '../../../Redux/ReduxSlices/Alerts/alertSlice';
import { selectAllSubcategoryTreatmentPlans } from '../../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';

const GenerateTreatmentPlan = () => {
	const {
		treatmentPlans,
		setTreatmentPlans,
		handleAddVisit,
		onUpdateVisitsInTreatmentPlan,
	} = useTreatmentPlan();

	const subcategoryTreatmentPlans = useSelector(selectAllSubcategoryTreatmentPlans);
	const selectedPayer = useSelector(selectSelectedPayer);

	const [inputText, setInputText] = useState("");
	const dispatch = useDispatch();

	const {
		fetchFacilityPayerCdtCodeFees,
		selectedPatient,
	} = useBusiness();

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (selectedPayer) {
			fetchFacilityPayerCdtCodeFees(selectedPayer.payerId);
		}
	}, [selectedPayer]);

	const handleInputChange = (event) => {
		setInputText(event.target.value);
	};

	function extractActiveTxCategories(visits) {
		const uniqueCategories = visits.reduce((acc, visit) => {
			acc.add(visit.procedureCategoryName);
			return acc;
		}, new Set());

		return Array.from(uniqueCategories);
	}

	// Utility function to preprocess input text and maintain order
	async function preprocessInputText(inputText) {
		console.log("inputText sent to ai", inputText);
		const aiResponse = await runGeminiPro(inputText);
		console.log("aiResponsePreprocessedInputText", aiResponse);
		const parsedResponse = JSON.parse(aiResponse);
		console.log("parsedResponse", parsedResponse);

		return parsedResponse.map((item, index) => ({
			...item,
			originalOrder: index,
		}));
	}

	// Utility function to fetch and process treatments with order maintained
	async function fetchAndProcessTreatments(
		treatmentEntries,
		subcategoryTreatmentPlans
	) {
		console.log("Treatment entries (with original order):", treatmentEntries);
		let allVisits = [];
		let globalVisitIdCounter = 0;

		// Preprocess subcategoryTreatmentPlans into a Map
		const plansMap = new Map(
			subcategoryTreatmentPlans.map((plan) => [
				plan.procedureSubCategoryName.toLowerCase(),
				plan,
			])
		);

		for (const item of treatmentEntries) {
			const { toothNumber, treatments, originalOrder } = item;

			for (const [treatmentIndex, treatment] of treatments.entries()) {
				const plan = plansMap.get(treatment.toLowerCase());
				if (plan) {
					const clonedVisits = plan.visits.map((visit) => ({
						...visit,
						visitId: `custom-${originalOrder}-${treatmentIndex}-${globalVisitIdCounter++}`,
						cdtCodes: visit.cdtCodes.map((cdtCode) => ({
							...cdtCode,
							toothNumber,
							originalVisitCategory: plan.procedureCategoryName,
						})),
						originLineIndex: originalOrder,
						procedureCategoryName: plan.procedureCategoryName,
					}));

					allVisits.push(...clonedVisits);
				}
			}
		}

		allVisits.sort(
			(a, b) =>
				a.originLineIndex - b.originLineIndex || a.visitNumber - b.visitNumber
		);
		return allVisits;
	}

	function combineVisitsIntoOne(allVisits) {
		let combinedCdtCodes = [];

		allVisits.forEach((visit) => {
			visit.cdtCodes.forEach((cdtCode) => {
				combinedCdtCodes.push({
					...cdtCode,
					originLineIndex: visit.originLineIndex,
					visitNumber: visit.visitNumber,
					orderWithinVisit: cdtCode.order,
				});
			});
		});

		// Sort combinedCdtCodes by originLineIndex, visitNumber, and then by orderWithinVisit
		combinedCdtCodes.sort(
			(a, b) =>
				a.originLineIndex - b.originLineIndex ||
				a.visitNumber - b.visitNumber ||
				a.orderWithinVisit - b.orderWithinVisit
		);

		return {
			visitId: "combined",
			description: "Combined Visit",
			cdtCodes: combinedCdtCodes,
			originLineIndex: 0,
		};
	}

	// Main function to generate treatment plan
	const handleGenerateTreatmentPlan = async () => {
		if (!inputText.trim()) {
			showAlert(
				"error",
				"Please enter some text to generate a treatment plan."
			);
			return;
		}
		if (!selectedPatient) {
			dispatch(showAlert({ type: 'error', message: 'Please select a patient before creating a treatment plan' }));
			return;
		}
		setIsLoading(true);

		try {
			const treatmentEntries = await preprocessInputText(inputText);
			let allVisits = await fetchAndProcessTreatments(
				treatmentEntries,
				subcategoryTreatmentPlans
			);
			const activeTxCategories = extractActiveTxCategories(allVisits);
			dispatch(setActiveTxCategories(activeTxCategories));

			const combinedVisit = combineVisitsIntoOne(allVisits);
			console.log("combinedVisit", combinedVisit);
			const combinedTreatmentPlan = { visits: [combinedVisit] };
			console.log("Final Consolidated Treatment Plan:", combinedTreatmentPlan);
			setTreatmentPlans([combinedTreatmentPlan]);
		} catch (error) {
			showAlert(
				"error",
				"An error occurred while generating the treatment plan."
			);
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
				<TxViewCustomizationToolbar />
				<StyledSeparator customMarginTop="0px" />
				<StyledContainerWithTableInner>
					<StyledLargeText textAlign="center">Treatment Plan</StyledLargeText>
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
	);
};

export default GenerateTreatmentPlan;
