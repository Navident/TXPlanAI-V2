import styled, { css } from 'styled-components'
import { UI_COLORS } from '../../Theme';

const purpleContainerStyles = css`
    background-color: ${UI_COLORS.light_purple};
    border-radius: 10px;
    align-items: center;
    display: flex;
    justify-content: center;
`;

const itemsListStyles = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const StyledHomeBoxBottomContainer = styled.div`
    flex-grow: 1;
    background-color: initial;
    border-radius: 0;
    align-items: initial;
    display: initial;
    justify-content: initial;
    ${props => props.purpleContainer && purpleContainerStyles}
    ${props => props.itemsList && itemsListStyles}
`;

export const StyledHomeBoxTopContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 12px;
    justify-content: space-between;
`;

export const StyledSeparator = styled.div`
  height: 1px;
  background-color: #EAEBEB; 
  width: 100%;
  margin-top: -5px;
`;

export const StyledItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;   
    align-items: center;
    height: 100%;
`;