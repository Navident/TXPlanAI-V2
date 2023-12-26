import React from 'react';
import './RoundedButton.css';

const RoundedButton = ({ icon, text, backgroundColor, textColor, border = true }) => {
    const buttonStyle = {
        backgroundColor: backgroundColor || 'white', 
        color: textColor || 'black',
        border: border ? '1px solid black' : 'none',
    };

    return (
        <button className="rounded-button" style={buttonStyle}>
            {icon && <img src={icon} alt={text} className="button-icon" />}
            {text}
        </button>
    );
};

export default RoundedButton;
