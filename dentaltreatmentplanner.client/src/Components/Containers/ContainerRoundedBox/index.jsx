import { StyledRoundedBoxContainer, StyledRoundedBoxContainerInner, StyledSemiboldBlackTitle } from '../../../GlobalStyledComponents';
import { StyledRoundedBoxContainerTitle } from './index.style';

const ContainerRoundedBox = ({ children, title = 'Notes Preview', showTitle = true, centerTitle = true }) => {
    return (
        <StyledRoundedBoxContainer>
            <StyledRoundedBoxContainerInner>
                {showTitle && (
                    <StyledSemiboldBlackTitle center={centerTitle}>
                        {title}
                    </StyledSemiboldBlackTitle>
                )}
                {children}
            </StyledRoundedBoxContainerInner>
        </StyledRoundedBoxContainer>
    );
};

export default ContainerRoundedBox;


