import {
	StyledLightGrey2Text,
	StyledRoundedBoxContainer,
    StyledRoundedBoxContainerInner,
    StyledSpinnerContainer
} from "../../GlobalStyledComponents";
import {
	StyledHomeBoxBottomContainer,
	StyledSeparator,
	StyledHomeBoxTopContainer,
	StyledItemContainer,
} from "../../Pages/Dashboard/index.style";
import { useNavigate } from "react-router-dom";
import { useGetAllPatientTreatmentPlansForFacilityQuery } from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansApiSlice';
import { CircularProgress } from "@mui/material";

const RecentTxPlans = () => {
    const navigate = useNavigate();
    const {
        data: patientTreatmentPlans,
        isLoading,
        isError,
        error
    } = useGetAllPatientTreatmentPlansForFacilityQuery();

    // Sort treatment plans by createdAt in descending order and filter out duplicates
    const sortedPlans = patientTreatmentPlans
        ? [...patientTreatmentPlans]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        : [];


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
                    {isLoading ? (
                        <StyledItemContainer>
                            <StyledSpinnerContainer>
                                <CircularProgress style={{ color: "#7777a1" }} />
                            </StyledSpinnerContainer>
                        </StyledItemContainer>
                    ) : isError ? (
                        <StyledItemContainer>
                            Error: {error?.data?.message || 'Failed to fetch treatment plans'}
                        </StyledItemContainer>
                    ) : (
                        sortedPlans.map((plan, index) => (
                            <StyledItemContainer key={index}>
                                <div>{plan.description}</div>
                                <StyledLightGrey2Text
                                    hoverEffect
                                    className="editText"
                                    onClick={() => handleEditClick(plan.treatmentPlanId)}
                                >
                                    Edit
                                </StyledLightGrey2Text>
                            </StyledItemContainer>
                        ))
                    )}
                </StyledHomeBoxBottomContainer>
            </StyledRoundedBoxContainerInner>
        </StyledRoundedBoxContainer>
    );
};

export default RecentTxPlans;
