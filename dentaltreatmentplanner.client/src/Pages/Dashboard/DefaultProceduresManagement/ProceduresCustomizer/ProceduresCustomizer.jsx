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
} from "../../../../GlobalStyledComponents";
import GoBack from "../../../../Components/Common/GoBack/GoBack";
import { useBusiness } from '../../../../Contexts/BusinessContext/useBusiness';


const ProceduresCustomizer = () => {
	const [treatmentPlans, setTreatmentPlans] = useState([]);
	const params = useParams();
	console.log("params", params);
	// Ensure paramsSubcategoryId is a number for accurate comparison
	const paramsSubcategoryId = Number(params.subcategory);
	console.log("subcategoryid passed from params is: ", paramsSubcategoryId);
	const { subcategoryTreatmentPlans } = useBusiness();

	useEffect(() => {
		// Filter out any null values 
		const filteredPlans = subcategoryTreatmentPlans.filter(plan => plan && plan.procedureSubcategoryId === paramsSubcategoryId);
		setTreatmentPlans(filteredPlans);
	}, [paramsSubcategoryId, subcategoryTreatmentPlans]); 

	useEffect(() => {
		console.log("treatmentPlans updated:", treatmentPlans);
	}, [treatmentPlans]);
	const handleAddVisitToTreatmentPlan = (treatmentPlanId, newVisit) => {
		setTreatmentPlans((prevPlans) =>
			addVisitToTreatmentPlan(prevPlans, treatmentPlanId, newVisit)
		);
	};

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
					<StyledLargeText>Procedure Category: {treatmentPlans.procedureCategoryName}</StyledLargeText>
					<StyledLargeText>
						Procedure Sub-Category: {treatmentPlans.procedureCategoryName}

					</StyledLargeText>
					<div>
						{treatmentPlans.length > 0 &&
							treatmentPlans.map((plan, index) => {
								const key = index;
								return (
									<TreatmentPlanConfiguration
										key={key}
										treatmentPlan={plan}
										includeExtraRow={true}
										addProcedureElement={<span>+ Add Procedure</span>}
										onAddVisit={(newVisit) =>
											handleAddVisitToTreatmentPlan(
												plan.treatmentPlanId,
												newVisit
											)
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
