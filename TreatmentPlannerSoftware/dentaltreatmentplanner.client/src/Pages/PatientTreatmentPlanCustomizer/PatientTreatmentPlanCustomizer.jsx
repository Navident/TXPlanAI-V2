import useTreatmentPlan from "../../Contexts/TreatmentPlanContext/useTreatmentPlan";
import TreatmentPlanOutput from "../TreatmentPlanOutput/TreatmentPlanOutput";
import GoBack from "../../Components/Common/GoBack/GoBack";
import {
	StyledContainerWithTableInner,
	StyledRoundedBoxContainer,
} from "../../GlobalStyledComponents";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
	generateTreatmentPlan,
	getTreatmentPlanById,
} from "../../ClientServices/apiService";
import {
	StyledAppContainer,
	StyledMainContentWrapper,
	StyledContentArea,
} from "../../GlobalStyledComponents";
import HeaderBar from "../../Components/Common/HeaderBar/HeaderBar";
import logo from "../../assets/navident-logo.svg";
import { useNavigate } from "react-router-dom";
import { useBusiness } from "../../Contexts/BusinessContext/useBusiness";
import { CircularProgress } from "@mui/material";
import { selectPatientTreatmentPlans } from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectPayersForFacility } from '../../Redux/ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice';

const PatientTreatmentPlanCustomizer = () => {
	const { treatmentPlanId } = useParams();
	const [plan, setPlan] = useState(null);
	const { businessName, fetchFacilityPayerCdtCodeFees } = useBusiness();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true); 
	const patientTreatmentPlans = useSelector(selectPatientTreatmentPlans);
	const payers = useSelector(selectPayersForFacility);

	const {
		treatmentPlans,
		cdtCodes,
		handleAddVisit,
		onDeleteVisit,
		onUpdateVisitsInTreatmentPlan,
	} = useTreatmentPlan();

	useEffect(() => {
		const fetchPlanAndFees = async () => {
			if (treatmentPlanId && patientTreatmentPlans.length > 0) {
				const id = parseInt(treatmentPlanId, 10);
				const foundPlan = patientTreatmentPlans.find(plan => parseInt(plan.treatmentPlanId, 10) === id);
				setPlan(foundPlan);

				setIsLoading(false); 
			} else {
				setIsLoading(false); 
			}
		};

		fetchPlanAndFees();
	}, [treatmentPlanId, patientTreatmentPlans]);

	const handleLogoClick = () => {
		navigate("/");
	};

	return (
		<div className="procedure-customizer-wrapper">
			<StyledAppContainer>
				<HeaderBar
					leftCornerElement={
						<img
							src={logo}
							alt="Logo"
							className="navident-logo"
							onClick={handleLogoClick}
						/>
					}
					rightCornerElement={
						<div className="headerbar-business-name">{businessName}</div>
					}
					className="dashboard-header"
					showDropdownArrow={true}
				/>
				<StyledMainContentWrapper>
					<StyledContentArea>
						<GoBack text="Go Back" />
						<StyledRoundedBoxContainer>
							<StyledContainerWithTableInner>
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
									plan && (
										<TreatmentPlanOutput
											key={`treatment-plan-${plan.treatmentPlanId}`}
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
											isInGenerateTreatmentPlanContext={false}
										/>
									)
								)}
							</StyledContainerWithTableInner>
						</StyledRoundedBoxContainer>
					</StyledContentArea>
				</StyledMainContentWrapper>
			</StyledAppContainer>
		</div>
	);
};

export default PatientTreatmentPlanCustomizer;