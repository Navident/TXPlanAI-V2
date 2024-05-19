import { StyledEmptyStateContainer, StyledEmptyStateTextContainer, StyledEmptyStateGraphic, StyledEmptyStateTitle, StyledEmptyStateInfoText } from "./index.style";
import emptyStateIllustration from "../../../assets/empty-state-illustration.svg";

const EmptyStatePlaceholder = () => {
    return (
        <StyledEmptyStateContainer>
            <StyledEmptyStateGraphic src={emptyStateIllustration} alt="empty state icon" />
            <StyledEmptyStateTextContainer>
                <StyledEmptyStateTitle>
                    Your comprehensive treatment plan will display here.
                </StyledEmptyStateTitle>
                <StyledEmptyStateInfoText>
                    Please input your treatments and then click the generate button to create your treatment plan.
                </StyledEmptyStateInfoText>
            </StyledEmptyStateTextContainer>
        </StyledEmptyStateContainer>
    );
};



export default EmptyStatePlaceholder;
