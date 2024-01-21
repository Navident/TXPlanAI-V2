import './HeaderBar.css';
import PropTypes from 'prop-types';

const HeaderBar = ({ leftCornerElement, rightCornerElement, centerLogo }) => {
    // when logo is in center we need to set the leftcornerelement to position absolute
    const leftCornerStyle = centerLogo ? { position: 'absolute' } : null;

    return (
        <div className="header-bar box-shadow">
            <div className="header-left-corner-container" style={leftCornerStyle}>
                {leftCornerElement}
            </div>
            {rightCornerElement && centerLogo ? (
                <div className="header-center-container">
                    {rightCornerElement}
                </div>
            ) : rightCornerElement ? (
                <div className="header-right-corner-container">
                    {rightCornerElement}
                </div>
            ) : null}
        </div>
    );
};

// Define the prop types
HeaderBar.propTypes = {
    leftCornerElement: PropTypes.node, // Required element for the left corner
    rightCornerElement: PropTypes.node, // Optional element for the right corner
    centerLogo: PropTypes.bool // Optional boolean to center the right element
};

// Set default props
HeaderBar.defaultProps = {
    rightCornerElement: null, // Default to null if not provided
    centerLogo: false // Default is false
};

export default HeaderBar;
