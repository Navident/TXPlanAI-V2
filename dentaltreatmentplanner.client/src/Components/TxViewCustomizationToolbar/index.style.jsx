import styled from 'styled-components'

export const StyledTxToolbarContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: sticky;
    top:-20px;
    z-index: 100;
    padding: 20px;
    background-color:white;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;

        &.sticky {
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        border-top-left-radius: 0px; 
        border-top-right-radius: 0px;
    }
`;

export const StyledToggleButtonGroupWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex: 1;
`;

export const StyledCategoryFiltersWrapper = styled.div`
    flex: 1;
    display: flex;
    justify-content: end;
`;

export const StyledPrintButton = styled.img`
    cursor: pointer;
    height: 20px;

`;


export const StyledPrintSaveBtnContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 15px;
    align-items: center;
`;

export const StyledFlexAlignContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: ${props => props.justify || 'center'};
    align-items: center;
`;