import './HeaderBar.css';
import PropTypes from 'prop-types';

const HeaderBar = ({ leftCornerElement, rightCornerElement }) => {
    return (
        <div className="header-bar">
            <div className="header-left-corner-container">
                {leftCornerElement}
            </div>
            {rightCornerElement && (
                <div className="header-right-corner-container">
                    {rightCornerElement}
                </div>
            )}
        </div>
    );
};

// Define the prop types
HeaderBar.propTypes = {
    leftCornerElement: PropTypes.node, // Required element for the left corner
    rightCornerElement: PropTypes.node // Optional element for the right corner
};

// Set default props
HeaderBar.defaultProps = {
    rightCornerElement: null // Default to null if not provided
};

export default HeaderBar;
