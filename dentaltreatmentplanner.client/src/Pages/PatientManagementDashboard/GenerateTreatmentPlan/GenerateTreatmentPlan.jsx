import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import MultilineTextfield from "../../../Components/Common/MultilineTextfield/index";
import TxViewCustomizationToolbar from "../../../Components/TxViewCustomizationToolbar/index";
import { TextField, InputAdornment } from '@mui/material';
import PenIcon from "../../../assets/pen-icon.svg";
import { useState, useEffect } from "react";
import TreatmentPlanOutput from "../../TreatmentPlanOutput/TreatmentPlanOutput";
import {
	StyledContainerWithTableInner,
	StyledLargeText,
	StyledSeparator,
	StyledTitleAndPaymentTotalsContainer
} from "../../../GlobalStyledComponents";
import { fetchOpenAIResponse } from "../../../OpenAiLlm/gptRunner";
import { CircularProgress } from "@mui/material";
import {
	setActiveTxCategories,
	resetCategoryFilters
} from "../../../Redux/ReduxSlices/TableViewControls/tableViewControlSlice";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from '../../../Redux/ReduxSlices/Alerts/alertSlice';
import {
	setTreatmentPlans,
	handleAddVisit,
	onUpdateVisitsInTreatmentPlan,
	onDeleteVisit,
	selectAllTreatmentPlans
} from '../../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import appInsights from '../../../Utils/appInsights';
import { selectFacilityName, selectFacilityId, selectIsUserLoggedIn } from '../../../Redux/ReduxSlices/User/userSlice';
import EmptyStatePlaceholder from './EmptyStatePlaceholder';
import { useGetAllSubcategoryTreatmentPlansQuery } from '../../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansApiSlice';
import { useNavigate } from 'react-router-dom';

const GenerateTreatmentPlan = () => {
	const dispatch = useDispatch();
	const { data: subcategoryTreatmentPlans } = useGetAllSubcategoryTreatmentPlansQuery();
	const treatmentPlans = useSelector(selectAllTreatmentPlans);
	const [isLoading, setIsLoading] = useState(false);
	const [inputText, setInputText] = useState("");
	const facilityName = useSelector(selectFacilityName);
	const facilityId = useSelector(selectFacilityId);
	const [allRowsFromChild, setAllRowsFromChild] = useState({});
	const navigate = useNavigate();
	const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

	const handleAllRowsUpdate = (newAllRows) => {
		setAllRowsFromChild(newAllRows);
	};

	useEffect(() => {
		return () => {
			// Reset treatmentPlans when component unmounts
			dispatch(setTreatmentPlans([]));
		};
	}, [dispatch]);

	useEffect(() => {
		// Reset category filters when component unmounts
		return () => {
			dispatch(resetCategoryFilters());
		};
	}, [dispatch]);

	useEffect(() => {
		if (treatmentPlans) {
			console.log("treatmentPlans state in parent", treatmentPlans);
		}
	}, [treatmentPlans]);

	useEffect(() => {
		dispatch(setTreatmentPlans([]));
		// Check if the user is logged in, if not redirect to the login page
		if (!isUserLoggedIn) {
			navigate('/login');
		}
	}, [isUserLoggedIn, navigate]);

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

	// Utility function to adjust surface values based on tooth number
	function adjustSurfaceValues(toothNumber, surface) {
		// Define the tooth numbers range for adjustment
		const teethNumbersForAdjustment = [6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26, 27];
		// Convert toothNumber to integer
		const num = parseInt(toothNumber, 10);

		// Check if the tooth number is within the range for adjustment
		if (teethNumbersForAdjustment.includes(num)) {
			// Ensure surface is a string to avoid errors calling .replace on undefined
			if (typeof surface === 'string') {
				// Replace 'B' with 'F' and 'O' with 'I' in the surface string
				return surface.replace(/B/g, 'F').replace(/O/g, 'I');
			} else {
				return ''; 
			}
		}
		// Return the original surface if no adjustment is needed or if surface is undefined
		return surface || '';
	}



	// Utility function to preprocess input text and maintain order
	async function preprocessInputText(inputText) {
		console.log("inputText sent to ai", inputText);
		const aiResponse = await fetchOpenAIResponse(inputText);
		console.log("ai response", aiResponse);

		appInsights.trackEvent({
			name: "TreatmentPlan",
			properties: {
				facilityName: facilityName,
				facilityId: facilityId,
				inputText: inputText,
				aiResponse: aiResponse
			}
		});


		const parsedResponse = JSON.parse(aiResponse);
		console.log("parsedResponse", parsedResponse);

		// Wrap parsedResponse in an array if it's not already one
		const responseArray = Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse];
		console.log("responseArray", responseArray);

		return responseArray.map((item, index) => ({
			...item,
			toothNumber: item.toothNumber ? item.toothNumber.replace('#', '') : '', //if tooth number not provided we need to assign it empty string
			originalOrder: index,
		}));
	}

	// Utility function to fetch and process treatments with order maintained
	async function fetchAndProcessTreatments(treatmentEntries, subcategoryTreatmentPlans) {
		console.log("Treatment entries (with original order):", treatmentEntries);
		console.log(subcategoryTreatmentPlans);
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
			console.log("Processing item:", item); 
			const { arch, toothNumber, surface, treatments, originalOrder } = item;

			if (toothNumber === undefined) {
				console.error("Undefined toothNumber found in item:", item);
				continue; // Skip this item 
			}

			const adjustedSurface = adjustSurfaceValues(toothNumber, surface);
			const sanitizedToothNumber = typeof toothNumber === 'string' ? toothNumber.replace('#', '') : '';
			for (const [treatmentIndex, treatment] of treatments.entries()) {
				const plan = plansMap.get(treatment.toLowerCase());
				if (plan) {
					const clonedVisits = plan.visits.map((visit) => ({
						...visit,
						visitId: `custom-${originalOrder}-${treatmentIndex}-${globalVisitIdCounter++}`,
						VisitToProcedureMapDtos: visit.procedures.map((procedureMap) => ({
							...procedureMap,
							procedureToCdtMaps: procedureMap.procedureToCdtMaps.map((cdtMap) => ({ 
								...cdtMap,
								toothNumber: sanitizedToothNumber,
								surface: adjustedSurface,
								arch,
								originalVisitCategory: plan.procedureCategoryName,
							})),
							originLineIndex: originalOrder,
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
		let combinedProcedures = [];

		allVisits.forEach((visit) => {
			visit.VisitToProcedureMapDtos.forEach((procedureMap) => {
				combinedProcedures.push({
					...procedureMap, // Spread to inherit all properties
					procedureToCdtMaps: procedureMap.procedureToCdtMaps.map(cdtMap => ({
						...cdtMap,
						visitToProcedureMapId: procedureMap.visitToProcedureMapId,
						originLineIndex: visit.originLineIndex,
						visitNumber: visit.visitNumber,
						orderWithinVisit: procedureMap.order, 
					})) 
				});
			});
		});

		// Sort combinedProcedures by originLineIndex, visitNumber, and then by orderWithinVisit
		combinedProcedures.sort(
			(a, b) =>
				a.originLineIndex - b.originLineIndex ||
				a.visitNumber - b.visitNumber ||
				a.orderWithinVisit - b.orderWithinVisit
		);

		return {
			visitId: `temp-${Date.now()}`,
			description: "Table 1",
			procedures: combinedProcedures, 
			originLineIndex: 0,
			visitNumber: 1
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

		setIsLoading(true);

		try {
			const treatmentEntries = await preprocessInputText(inputText);
			console.log("treatmentEntries", treatmentEntries);
			let allVisits = await fetchAndProcessTreatments(
				treatmentEntries,
				subcategoryTreatmentPlans
			);
			const activeTxCategories = extractActiveTxCategories(allVisits);
			dispatch(setActiveTxCategories(activeTxCategories));

			const combinedVisit = combineVisitsIntoOne(allVisits);
			console.log("combinedVisit", combinedVisit);
			const combinedTreatmentPlan = { treatmentPlanId: null, description: null, visits: [combinedVisit] };
			console.log("Final Consolidated Treatment Plan:", combinedTreatmentPlan);
			dispatch(setTreatmentPlans([combinedTreatmentPlan]));
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
			{/* <PatientInfoSection /> */}
			{/* <div className="large-text">Create New TX Plan</div> */}
			<div className="create-treatment-plan-section rounded-box box-shadow">
				<div className="create-treatment-plan-section-inner">
					<img src={PenIcon} alt="Edit" />
					<div className="large-text">
						What can I help you treatment plan today?
					</div>
					<MultilineTextfield
						label="Input your treatments"
						value={inputText}
						onChange={handleInputChange}
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
				<TxViewCustomizationToolbar allRows={allRowsFromChild} />
				<StyledSeparator customMarginTop="0px" />
				<StyledContainerWithTableInner>
					{treatmentPlans.length > 0 && !isLoading && (
					<StyledTitleAndPaymentTotalsContainer>
						<div style={{ flex: 1 }}></div> 
						<StyledLargeText>Treatment Plan</StyledLargeText>
						<div style={{ flex: 1 }}>

						</div> 
					</StyledTitleAndPaymentTotalsContainer>
					)}

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
					) : treatmentPlans.length > 0 ? (
						treatmentPlans.map((plan, index) => (
							<TreatmentPlanOutput
								key={`treatment-plan-${index}`}
								treatmentPlan={plan}
								treatmentPlans={treatmentPlans}
								onAddVisit={(newVisit) =>
									dispatch(handleAddVisit({ treatmentPlanId: plan.treatmentPlanId, newVisit }))
								}
								onUpdateVisitsInTreatmentPlan={(treatmentPlanId, updatedVisits) => {
									console.log("Dispatching updated visits:", updatedVisits);
									dispatch(onUpdateVisitsInTreatmentPlan({ treatmentPlanId, updatedVisits }));
								}}
								onDeleteVisit={(deletedVisitId) =>
									dispatch(onDeleteVisit({ treatmentPlanId: plan.treatmentPlanId, deletedVisitId }))
								}
								showToothNumber={true}
								isInGenerateTreatmentPlanContext={true}
								onAllRowsUpdate={handleAllRowsUpdate}
							/>
						))
					) : (
					<EmptyStatePlaceholder />
					)}
				</StyledContainerWithTableInner>
			</div>
		</div>
	);
};

export default GenerateTreatmentPlan;
