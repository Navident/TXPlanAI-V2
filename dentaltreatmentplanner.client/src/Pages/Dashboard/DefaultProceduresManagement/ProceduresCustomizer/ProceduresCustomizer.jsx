import "./ProceduresCustomizer.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTreatmentPlansBySubcategory } from "../../../../ClientServices/apiService";
import TreatmentPlanConfiguration from "../../../../Components/TreatmentPlanConfiguration/TreatmentPlanConfiguration";
import {
	addVisitToTreatmentPlan,
	deleteVisitInTreatmentPlan,
} from "../../../../Utils/helpers";
import {
	StyledLargeText,
	StyledContainerWithTableInner,
	StyledRoundedBoxContainer,
	StyledTableLabelText
} from "../../../../GlobalStyledComponents";
import GoBack from "../../../../Components/Common/GoBack/GoBack";
import { useSelector, useDispatch } from 'react-redux';
import {
	selectAllSubcategoryTreatmentPlans,
	setTreatmentPlans,
	handleAddVisit,
	onUpdateVisitsInTreatmentPlan,
	onDeleteVisit,
	selectAllTreatmentPlans
} from '../../../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';


const ProceduresCustomizer = () => {
	const dispatch = useDispatch();
	const treatmentPlans = useSelector(selectAllTreatmentPlans);
	const params = useParams();
	const paramsSubcategoryId = Number(params.subcategory);
	console.log("subcategoryid passed from params is: ", paramsSubcategoryId);
	const subcategoryTreatmentPlans = useSelector(selectAllSubcategoryTreatmentPlans);

	const currentSubcategoryPlan = subcategoryTreatmentPlans.find(plan => plan && plan.procedureSubcategoryId === paramsSubcategoryId);
	// Check if the names are defined, otherwise use fallbacks from the first treatment plan, if available.
	const activeCategoryName = currentSubcategoryPlan?.procedureCategoryName ??
		treatmentPlans[0]?.procedureCategoryName ??
		'N/A';

	const activeSubcategoryName = currentSubcategoryPlan?.procedureSubCategoryName ??
		treatmentPlans[0]?.procedureSubCategoryName ??
		'N/A';

	useEffect(() => {
		if (currentSubcategoryPlan) {
			// Assuming you only want to dispatch the plans that match the current subcategory.
			dispatch(setTreatmentPlans([currentSubcategoryPlan]));
		}
	}, [paramsSubcategoryId]);

	useEffect(() => {
		console.log("treatmentPlans updated:", treatmentPlans);
	}, [treatmentPlans]);

	const handleDeleteVisitInTreatmentPlan = (
		treatmentPlanId,
		deletedVisitId
	) => {
		setTreatmentPlans((prevPlans) =>
			deleteVisitInTreatmentPlan(prevPlans, treatmentPlanId, deletedVisitId)
		);
	};

	const handleUpdateVisitsInTreatmentPlan = (
		treatmentPlanId,
		updatedVisits
	) => {
		setTreatmentPlans((prevPlans) => {
			return prevPlans.map((plan) => {
				if (plan.treatmentPlanId === treatmentPlanId) {
					return { ...plan, visits: updatedVisits };
				}
				return plan;
			});
		});
	};

	return (
		<div className="procedure-customizer-wrapper">
			<GoBack text="Go Back" />
			<StyledRoundedBoxContainer>
				<StyledContainerWithTableInner>
					<StyledTableLabelText>Procedure Category: {activeCategoryName}</StyledTableLabelText>
					<StyledTableLabelText>Procedure Sub-Category: {activeSubcategoryName}</StyledTableLabelText>

					<div>
						{treatmentPlans.length > 0 &&
							treatmentPlans.map((plan, index) => {
								return (
									<TreatmentPlanConfiguration
										key={`treatment-plan-${index}`}
										treatmentPlan={plan}
										includeExtraRow={true}
										addProcedureElement={<span>+ Add Procedure</span>}
										onAddVisit={(newVisit) =>
											dispatch(handleAddVisit({ treatmentPlanId: plan.treatmentPlanId, newVisit }))
										}
										onUpdateVisitsInTreatmentPlan={(
											treatmentPlanId,
											updatedVisits
										) =>
											handleUpdateVisitsInTreatmentPlan(
												treatmentPlanId,
												updatedVisits
											)
										}
										onDeleteVisit={(treatmentPlanId, deletedVisitId) =>
											handleDeleteVisitInTreatmentPlan(
												treatmentPlanId,
												deletedVisitId
											)
										}
										showToothNumber={false}
										isInGenerateTreatmentPlanContext={false}
									/>
								);
							})}
					</div>
				</StyledContainerWithTableInner>
			</StyledRoundedBoxContainer>
		</div>
	);
};

export default ProceduresCustomizer;
