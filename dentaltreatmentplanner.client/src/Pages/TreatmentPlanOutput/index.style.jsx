import styled from 'styled-components'
import { UI_COLORS } from '../../Theme';

export const StyledArrowIconContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

export const StyledArrowIcon = styled.img`
    cursor: pointer;
    width: 18px;
    height: 18px;
    transform: ${props => props.faceDown ? 'rotate(180deg)' : 'none'};
`;

export const StyledArrowWithTableRowContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;


export const StyledVisitSection = styled.div`
    display: flex;
    flex-direction: row; 
    align-items: center; 
    gap: 12px;
`;
export const StyledTableHeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const StyledBottomAddVisitSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 15px;
    padding-left: 30px;
`;