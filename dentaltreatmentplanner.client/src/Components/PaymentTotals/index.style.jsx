import styled from 'styled-components'
import { UI_COLORS } from '../../Theme';

export const StyledTotalsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justifyContent || 'center'};
  height: 15px;
  font-size: 14px;
    margin-top: ${props => props.marginTop || '0px'};

`;


export const StyledVerticalDivider = styled.div`
  height: 100%; 
  width: 1px; 
  background-color: black; 
  margin: 0 10px; 
`;
