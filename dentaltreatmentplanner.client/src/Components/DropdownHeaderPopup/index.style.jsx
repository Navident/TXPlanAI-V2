import styled from 'styled-components'
import { UI_COLORS } from '../../Theme';

export const StyledDropdownPopup = styled.div`
    position: absolute;
    top: 130%;
    right: 0;
    width: 150px;
    background-color: ${UI_COLORS.white};
    border-radius: 8px;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 100;
    opacity: ${props => props.isVisible ? 1 : 0};
    transform: translateY(${props => props.isVisible ? '0' : '-20px'});
    transition: opacity 0.3s ease, transform 0.3s ease ${props => props.isVisible ? '0s' : '0.3s'}, visibility 0s ${props => props.isVisible ? '0s' : '0.3s'};
    pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
    visibility: ${props => props.isVisible ? 'visible' : 'hidden'};

    /* Arrow at the top */
    &::before, &::after {
        content: '';
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
    }

    &::before {
        border-bottom: 10px solid rgba(0, 0, 0, 0.20); 
        margin-top: -1px;
    }

    &::after {
        border-bottom: 10px solid ${UI_COLORS.white};
    }
`;

export const StyledDropdownList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;

`;

export const StyledDropdownListItem = styled.li`
    display: flex;
    align-items: center;
    padding-bottom: 0px;
    cursor: pointer;
    position: relative;
    padding-left: 12px;

    &::after {
        content: ''; 
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%; 
        height: 2px; 
        background: linear-gradient(90deg, rgba(120, 118, 168, 0.70) 0%, rgba(255, 255, 255, 0.00) 100%);
        transform: scaleX(0); 
        transform-origin: bottom left; 
        transition: transform 0.3s ease-out; 
    }

    &:hover::after {
        transform: scaleX(1); 
    }

`;

export const StyledItemIcon = styled.img`
    margin-right: 6px;
    width: 20px;
    height: auto;
`;

export const StyledItemText = styled.span`
`;