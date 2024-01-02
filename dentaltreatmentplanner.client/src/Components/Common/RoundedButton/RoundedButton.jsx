import React from 'react';
import './RoundedButton.css';

// The onClick prop is optional here
const RoundedButton = ({
    icon,
    text,
    backgroundColor,
    textColor,
    border = true,
    borderColor = 'black',  // Default border color
    onClick,
    width = '100%',
    className = ''  // Optional class name
}) => {
    const buttonStyle = {
        backgroundColor: backgroundColor || 'white',
        color: textColor || 'black',
        border: border ? `1px solid ${borderColor}` : 'none',
        width: width,
    };

    // Combine the default class with any additional classes passed in
    const combinedClassName = `rounded-button ${className}`;

    return (
        <button className={combinedClassName} style={buttonStyle} onClick={onClick}>
            {icon && <img src={icon} alt={text} className="button-icon" />}
            {text}
        </button>
    );
};

export default RoundedButton;


