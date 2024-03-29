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