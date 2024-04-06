import "./PatientManagementDashboard.css";
import HeaderBar from "../../Components/Common/HeaderBar/HeaderBar";
import GoBack from "../../Components/Common/GoBack/GoBack";
import CreateNewPatient from "./CreateNewPatient/CreateNewPatient";
import PatientTreatmentPlanCustomizer from "../PatientTreatmentPlanCustomizer/PatientTreatmentPlanCustomizer";
import logo from "../../assets/navident-logo.svg";
import { Outlet } from "react-router-dom";
import backButton from "../../assets/back-button.svg";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
	StyledAppContainer,
	StyledMainContentWrapper,
	StyledContentArea,
} from "../../GlobalStyledComponents";
import { selectFacilityName } from '../../Redux/ReduxSlices/User/userSlice';
import { useSelector } from 'react-redux';

const PatientManagementDashboard = () => {
	const facilityName = useSelector(selectFacilityName);

	const location = useLocation();
	const navigate = useNavigate();
	const isCreatingNewPatient = location.pathname.includes(
		"/PatientManagementDashboard/create-new-patient"
	);
	const isCustomizingTreatmentPlan = location.pathname.includes(
		"/customize-treatment-plan"
	);
	const showGoBack = !(isCreatingNewPatient || isCustomizingTreatmentPlan);

	const handleBackClick = () => {
		navigate(-1);
	};
	const handleLogoClick = () => {
		navigate("/");
	};

	return (
		<StyledAppContainer>
			{isCreatingNewPatient ? (
				<HeaderBar
					leftCornerElement={
						<img
							src={backButton}
							alt="Back"
							className="back-btn-arrow"
							onClick={handleBackClick}
						/>
					}
					rightCornerElement={
						<div className="headerbar-business-name">{facilityName}</div>
					}
					centerLogo={false}
				/>
			) : (
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
			)}
			<StyledMainContentWrapper>
				<StyledContentArea>
					{showGoBack && (
						<GoBack
							text="Back To Dashboard"
							customOnClick={() => navigate("/dashboard")}
						/>
					)}

					{!isCreatingNewPatient && !isCustomizingTreatmentPlan ? (
						<div className="dashboard-bottom-row">

							{/* <PatientList /> */}
							<Outlet />
						</div>
					) : isCustomizingTreatmentPlan ? (
						<PatientTreatmentPlanCustomizer />
					) : (
						<CreateNewPatient />
					)}
				</StyledContentArea>
			</StyledMainContentWrapper>
		</StyledAppContainer>
	);
};

export default PatientManagementDashboard;
