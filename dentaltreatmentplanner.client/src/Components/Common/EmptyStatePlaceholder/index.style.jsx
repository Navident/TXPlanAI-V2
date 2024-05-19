import styled from 'styled-components'

export const StyledEmptyStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
        align-items: center;
        height: 100%;
`;

export const StyledEmptyStateGraphic = styled.img`
    width: 175px;
    height: 175px;
`;

export const StyledEmptyStateTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: center;
    max-width: 500px;
`;


export const StyledEmptyStateTitle = styled.div`
    font-weight: 600;
    font-size: 18px;
`;


export const StyledEmptyStateInfoText = styled.div`
    font-size: 14px;
`;