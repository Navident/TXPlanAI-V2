import { StyledRoundedBoxContainer, StyledRoundedBoxContainerInner, StyledSemiboldBlackTitle } from '../../../GlobalStyledComponents';
import { StyledRoundedBoxContainerTitle } from './index.style';

const ContainerRoundedBox = ({ children, title = 'Notes Preview', showTitle = true, centerTitle = true }) => {
    return (
        <StyledRoundedBoxContainer>
            <StyledRoundedBoxContainerInner>
                {showTitle && (
                    <h2 className="container-rounded-box-title">
                        {title}
                    </h2>
                )}
                {children}
            </StyledRoundedBoxContainerInner>
        </StyledRoundedBoxContainer>
    );
};

export default ContainerRoundedBox;


