import TreatmentPlanOutput from "../TreatmentPlanOutput/TreatmentPlanOutput";
import GoBack from "../../Components/Common/GoBack/GoBack";
import {
	StyledContainerWithTableInner,
	StyledRoundedBoxContainer,
} from "../../GlobalStyledComponents";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import {
	StyledAppContainer,
	StyledMainContentWrapper,
	StyledContentArea,
	StyledSeparator,
	StyledTitleAndPaymentTotalsContainer,
	StyledLargeText
} from "../../GlobalStyledComponents";
import HeaderBar from "../../Components/Common/HeaderBar/HeaderBar";
import logo from "../../assets/navident-logo.svg";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { selectPatientTreatmentPlans, handleAddVisit, onDeleteVisit, setTreatmentPlans, selectAllTreatmentPlans, onUpdateVisitsInTreatmentPlan } from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import { useSelector, useDispatch } from 'react-redux';
import TxViewCustomizationToolbar from "../../Components/TxViewCustomizationToolbar/index";


/*import { selectGrandUcrTotal, selectGrandCoPayTotal, selectAreGrandTotalsReady } from '../../Redux/ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice';
*/import PaymentTotals from "../../Components/PaymentTotals/index";
import { selectFacilityName } from '../../Redux/ReduxSlices/User/userSlice';

const PatientTreatmentPlanCustomizer = () => {
	const dispatch = useDispatch();
	const { treatmentPlanId } = useParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true); 
	const patientTreatmentPlans = useSelector(selectPatientTreatmentPlans);
	const treatmentPlans = useSelector(selectAllTreatmentPlans);
/*	const grandUcrTotal = useSelector(selectGrandUcrTotal);
	const grandCoPayTotal = useSelector(selectGrandCoPayTotal);
	const areGrandTotalsReady = useSelector(selectAreGrandTotalsReady);*/
	const facilityName = useSelector(selectFacilityName);

	useEffect(() => {
		return () => {
			// Reset treatmentPlans when component unmounts
			dispatch(setTreatmentPlans([]));
		};
	}, [dispatch]);

	useEffect(() => {
		const fetchPlanAndFees = async () => {
			if (treatmentPlanId && patientTreatmentPlans.length > 0) {
				const id = parseInt(treatmentPlanId, 10);
				const foundPlan = patientTreatmentPlans.find(plan => parseInt(plan.treatmentPlanId, 10) === id);
				dispatch(setTreatmentPlans([foundPlan]));

				setIsLoading(false); 
			} else {
				setIsLoading(false); 
			}
		};

		fetchPlanAndFees();
	}, [treatmentPlanId, patientTreatmentPlans]);

	useEffect(() => {
		if (treatmentPlans) {
			console.log("treatmentPlans state in parent", treatmentPlans);
		}
	}, [treatmentPlans]);

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
						<div className="headerbar-business-name">{facilityName}</div>
					}
					className="dashboard-header"
					showDropdownArrow={true}
				/>
				<StyledMainContentWrapper>
					<StyledContentArea>
						<GoBack text="Go Back" />
						<StyledRoundedBoxContainer height="auto">
							<TxViewCustomizationToolbar immediateSave={true} hideGroupBtnAndFilters={true} />
							<StyledSeparator customMarginTop="0px" />
							<StyledContainerWithTableInner>
								<StyledTitleAndPaymentTotalsContainer>
									<div style={{ flex: 1 }}></div>
									<StyledLargeText>Treatment Plan</StyledLargeText>
									<div style={{ flex: 1 }}></div>
								</StyledTitleAndPaymentTotalsContainer>

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
											isInGenerateTreatmentPlanContext={false}
										/>
									))
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
