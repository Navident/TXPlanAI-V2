import React from 'react';
import './RoundedButton.css';

const RoundedButton = ({
    icon,
    text,
    backgroundColor,
    textColor,
    border = true,
    borderColor = 'black',
    borderRadius = '20px',
    height, 
    onClick,
    width = '100%',
    className = ''
}) => {
    const buttonStyle = {
        backgroundColor: backgroundColor || 'white',
        color: textColor || 'black',
        border: border ? `1px solid ${borderColor}` : 'none',
        borderRadius: borderRadius,
        width: width,
        height: height, 
    };

    if (!height) {
        delete buttonStyle.height;
    }

    const combinedClassName = `rounded-button ${className}`;

    return (
        <button className={combinedClassName} style={buttonStyle} onClick={onClick}>
            {icon && <img src={icon} alt={text} className="button-icon" />}
            {text}
        </button>
    );
};

export default RoundedButton;



