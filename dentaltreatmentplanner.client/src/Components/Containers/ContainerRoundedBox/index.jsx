import { StyledRoundedBoxContainer, StyledRoundedBoxContainerInner, StyledLargeText } from '../../../GlobalStyledComponents';
import { StyledRoundedBoxContainerTitle } from './index.style';

const ContainerRoundedBox = ({ children }) => {
    return (
        <StyledRoundedBoxContainer>
            <StyledRoundedBoxContainerInner>
                <StyledRoundedBoxContainerTitle>Notes Preview</StyledRoundedBoxContainerTitle>
                {children}
            </StyledRoundedBoxContainerInner>
        </StyledRoundedBoxContainer>
    );
};

export default ContainerRoundedBox;
