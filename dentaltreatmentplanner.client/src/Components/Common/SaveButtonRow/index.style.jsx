import styled from 'styled-components'

export const StyledSaveButtonRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: ${props => props.hasChildren ? 'space-between' : 'end'};
    flex-direction: row;
    gap: ${props => props.gap || '0px'};
`;
