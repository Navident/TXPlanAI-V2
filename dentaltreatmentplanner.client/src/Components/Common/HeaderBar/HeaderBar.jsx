import './HeaderBar.css';
import PropTypes from 'prop-types';
import dropdownArrowIcon from '../../../assets/dropdown-arrow.svg';
import { StyledArrowIcon } from './index.style';
import { useState } from 'react';
import DropdownHeaderPopup from '../../DropdownHeaderPopup';

const HeaderBar = ({ leftCornerElement, rightCornerElement, centerLogo, showDropdownArrow }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const leftCornerStyle = centerLogo ? { position: 'absolute' } : null;

    const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

    return (
        <div className="header-bar box-shadow">
            <div className="header-left-corner-container" style={leftCornerStyle}>
                {leftCornerElement}
            </div>
            {rightCornerElement && centerLogo ? (
                <div className="header-center-container">
                    {rightCornerElement}
                    {showDropdownArrow && (
                        <StyledArrowIcon
                            src={dropdownArrowIcon}
                            alt="Dropdown"
                            onClick={toggleDropdown}
                            isVisible={isDropdownVisible} 
                        />
                    )}
                    <DropdownHeaderPopup isVisible={isDropdownVisible}>
                        popup
                    </DropdownHeaderPopup>
                </div>
            ) : rightCornerElement ? (
                <div className="header-right-corner-container">
                    {rightCornerElement}
                    {showDropdownArrow && (
                        <StyledArrowIcon
                            src={dropdownArrowIcon}
                            alt="Dropdown"
                            onClick={toggleDropdown}
                            isVisible={isDropdownVisible} 
                        />
                    )}
                        <DropdownHeaderPopup isVisible={isDropdownVisible}>
                            popup
                        </DropdownHeaderPopup>
                </div>
            ) : null}
        </div>
    );
};

HeaderBar.propTypes = {
    leftCornerElement: PropTypes.node,
    rightCornerElement: PropTypes.node,
    centerLogo: PropTypes.bool,
    showDropdownArrow: PropTypes.bool
};

HeaderBar.defaultProps = {
    rightCornerElement: null,
    centerLogo: false,
    showDropdownArrow: false
};

export default HeaderBar;
