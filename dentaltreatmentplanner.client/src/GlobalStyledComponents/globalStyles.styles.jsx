import styled from 'styled-components'
import { UI_COLORS } from '../Theme';

export const StyledLargeText = styled.div`
    font-size: 18px;
    font-weight: 600;
    text-align: ${props => props.textAlign || 'inherit'};
`;

export const StyledSeparator = styled.div`
  height: 1px;
  background-color: #EAEBEB; 
  width: 100%;
  margin-top: ${props => props.customMarginTop || '-5px'};
`;

export const StyledTitleAndPaymentTotalsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%; 
`;


export const StyledUnderlinedText = styled.div`
    text-decoration: underline;
    color: black;

    &:hover {
        color: #7777a1;
        cursor: pointer;
    }
`;

export const TableHeader = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
`;

export const StyledTableLabelText = styled.div`
    font-size: 20px;
`;

export const StyledContainerWithTableInner = styled.div`
    display: flex;
    flex-direction: column;
    padding: 30px;
    gap: 20px;

`;
export const StyledAppContainer = styled.div`
    background-color: #eeeef3;
    height: 100vh;
    display: flex;
    overflow: hidden;
`;

export const StyledMainContentWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    padding-top: 80px;
    max-width: 100vw;
    width: 100%;
`;

export const StyledContentArea = styled.div`
    flex-grow: 1;
    padding: 20px;
    gap: 20px;
    display: flex;
    overflow-y: auto;
    flex-direction: column;
`;


export const StyledLargeTextBold = styled.div`
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 18px;
`;

export const StyledSemiboldBlackTitle = styled.div`
    font-size: 21px;
    font-weight: 600;
    white-space: nowrap;
`;

export const StyledLightGreyText = styled.div`
    color: ${UI_COLORS.light_grey};
`;

export const StyledLightGrey2Text = styled.div`
  color: ${UI_COLORS.light_grey2};
  ${props => props.hoverEffect && `
    &:hover {
      color: #7777a1;
      cursor: pointer;
    }
  `}
`;

export const StyledRoundedBoxContainer = styled.div`
    background-color: ${UI_COLORS.white};
    width: 100%;
    height: ${({ height }) => height || '100%'};
     flex-grow: ${({ flexGrow }) => flexGrow ?? 1};

    border-radius: 15px;

    -webkit-box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

export const StyledRoundedBoxContainerInner = styled.div`
    display: flex;
    flex-direction: column;
    flex-basis: ${props => props.flexBasisZero ? '0' : 'auto'};
    padding: ${props => props.padding || '30px'};
    gap: 20px;
    height: 100%;
`;

export const StyledSaveTextBtn = styled.div`
    text-decoration: underline;
    cursor: pointer;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: end;
        &:hover {
        color: ${UI_COLORS.purple};
    }
`;



export const StyledEditDeleteIconsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    flex-direction: row;
    gap: 15px;
`;

export const StyledEditIcon = styled.img`
    cursor: pointer;
    width: 13px;
    height: 13px;
`;

export const StyledDeleteIcon = styled.img`
    cursor: pointer;
    width: 13px;
    height: 13px;

`;

export const StyledClickableText = styled.div`
    cursor: pointer;
    text-decoration: underline;

    &:hover {
        color: ${UI_COLORS.purple};
    }
`;

export const StyledAddButtonCellContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const StyledRedCircleWithArrowDropdownContainer = styled.div`
  position: relative;
  width: 20px; 
  height: 20px; 
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 0;
    height: 0;
    border-left: 4px solid transparent; 
    border-right: 4px solid transparent; 
    border-top: 5px solid red; 
    transition: transform 0.3s ease;
    transform: translate(-50%, -50%) ${({ isExpanded }) => isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

export const StyledDragCircleContainer = styled.div`
    display:flex;
    align-items:center;
    flex-direction: row;
    justify-content: ${props => props.justifyContent || 'space-between'};
    gap: 10px;
    width: fit-content
  }
`;