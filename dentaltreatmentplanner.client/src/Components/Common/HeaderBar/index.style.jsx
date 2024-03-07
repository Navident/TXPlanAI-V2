import styled from 'styled-components'
import { UI_COLORS } from '../../../Theme';

export const StyledArrowIcon = styled.img`
  transition: transform 0.3s ease;
  transform: ${({ isVisible }) => isVisible ? 'rotate(180deg)' : 'rotate(0deg)'};
  cursor: pointer;
`;








