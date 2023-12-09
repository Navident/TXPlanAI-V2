// HeaderBar component
import './HeaderBar.css';
import PropTypes from 'prop-types';
import logo from '../../assets/header-logo.png';

const HeaderBar = ({ children }) => {
    return (
        <div className="header-bar">
            <div className="header-logo-container">
                <img src={logo} alt="Logo" />
            </div>
            <div className="header-text-container">
                {children} {/* This will render any children passed to HeaderBar */}
            </div>
        </div>
    );
};

// Define the prop types
HeaderBar.propTypes = {
    children: PropTypes.node 
};

export default HeaderBar;
