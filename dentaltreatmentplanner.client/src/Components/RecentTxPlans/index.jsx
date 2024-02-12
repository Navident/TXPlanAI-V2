import { StyledLargeText, StyledUnderlinedText, StyledLightGreyText, StyledRoundedBoxContainer, StyledRoundedBoxContainerInner } from '../../GlobalStyledComponents';
import { useBusiness } from '../../Contexts/BusinessContext/useBusiness';
import { StyledHomeBoxBottomContainer, StyledItemContainer } from '../../Pages/Dashboard/index.style'

const RecentTxPlans = () => {
    const { patientTreatmentPlans } = useBusiness();

    // Sort treatment plans by createdAt in descending order and filter out duplicates
    const sortedPlans = patientTreatmentPlans
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5); 

    return (
        <StyledRoundedBoxContainer>
            <StyledRoundedBoxContainerInner flexBasisZero padding="20px">
                <div className="large-text">Recent TX Plans</div>
                <StyledHomeBoxBottomContainer itemsList>
                    {sortedPlans.map((plan, index) => (
                        <StyledItemContainer key={index}>
                            <div>{plan.patientName}</div>
                            <StyledUnderlinedText className="editText">Edit</StyledUnderlinedText>
                        </StyledItemContainer>
                    ))}
                </StyledHomeBoxBottomContainer>
            </StyledRoundedBoxContainerInner>
        </StyledRoundedBoxContainer>
    );
};

export default RecentTxPlans;