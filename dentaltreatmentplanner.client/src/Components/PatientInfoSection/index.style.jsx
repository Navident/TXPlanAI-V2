import styled from 'styled-components'
import { UI_COLORS } from '../../Theme';

export const StyledPatientInfoInnerContainer = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr 1fr; 
    height: 100%;
`;

export const StyledGridItem = styled.div`
  padding: 15px;
  text-align: left;
  position: relative;
  display: flex;
  align-items: ${props => props.$alignItems || 'center'};
  flex-direction: ${props => props.$flexDirection || 'row'}; 
  gap: 10px;
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 50%;
    border-right: 1px solid #ccc;
    width: 1px;
  }
`;

export const StyledGridItemLabelAndValueText = styled.div`
    display: inline-flex;
    gap: 10px;
    align-items: center;
`;

export const StyledGridItemValueText = styled.div`
    font-size: 18px;
`;


export const StyledGridItemLabel = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
`;


