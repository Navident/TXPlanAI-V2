import {
	StyledLightGrey2Text,
	StyledRoundedBoxContainer,
	StyledRoundedBoxContainerInner,
} from "../../GlobalStyledComponents";
import {
	StyledHomeBoxBottomContainer,
	StyledSeparator,
	StyledHomeBoxTopContainer,
	StyledItemContainer,
} from "../../Pages/Dashboard/index.style";
import { useNavigate } from "react-router-dom";
import { selectPatientTreatmentPlans } from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import { useSelector } from 'react-redux';

const RecentTxPlans = () => {
	const navigate = useNavigate();
	const patientTreatmentPlans = useSelector(selectPatientTreatmentPlans);

	// Sort treatment plans by createdAt in descending order and filter out duplicates
	const sortedPlans = [...patientTreatmentPlans]
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 5);

	// Function to handle redirection
	const handleViewAllClick = () => {
		navigate("/dashboard/all-saved-patient-tx-plans");
	};

	return (
		<StyledRoundedBoxContainer>
			<StyledRoundedBoxContainerInner flexBasisZero padding="20px">
				<StyledHomeBoxTopContainer>
					<div className="large-text">Recent TX Plans</div>
					<StyledLightGrey2Text hoverEffect onClick={handleViewAllClick}>
						View all
					</StyledLightGrey2Text>
				</StyledHomeBoxTopContainer>
				<StyledSeparator />
				<StyledHomeBoxBottomContainer itemsList>
					{sortedPlans.map((plan, index) => (
						<StyledItemContainer key={index}>
							<div>{plan.patientName}</div>
							<StyledLightGrey2Text hoverEffect className="editText">
								Edit
							</StyledLightGrey2Text>
						</StyledItemContainer>
					))}
				</StyledHomeBoxBottomContainer>
			</StyledRoundedBoxContainerInner>
		</StyledRoundedBoxContainer>
	);
};

export default RecentTxPlans;
