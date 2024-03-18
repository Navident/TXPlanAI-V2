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

    // Function to handle redirection to view all
    const handleViewAllClick = () => {
        navigate("/dashboard/all-saved-patient-tx-plans");
    };

    // Function to handle edit click, redirects to customize treatment plan
    const handleEditClick = (planId) => {
        navigate(`/customize-treatment-plan/${planId}`);
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
                            <div>{plan.description}</div>
                            {/* Add onClick handler to the edit text */}
                            <StyledLightGrey2Text
                                hoverEffect
                                className="editText"
                                onClick={() => handleEditClick(plan.treatmentPlanId)} // Assume plan has a property treatmentPlanId
                            >
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
