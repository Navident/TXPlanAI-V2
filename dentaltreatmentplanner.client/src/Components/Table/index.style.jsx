import styled from 'styled-components'

export const StyledDragCheckmarkIconsContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 15px;
    align-items: center;
    justify-content: ${props => props.justifyContent || 'space-between'};
    width: 100px;

`;
