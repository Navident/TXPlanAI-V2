import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import backButton from '../../../assets/grey-back-button.svg';
import './GoBack.css'; 
import { useBusiness } from '../../../Contexts/BusinessContext/useBusiness';

const GoBack = ({ text, customOnClick }) => {
    const navigate = useNavigate();

    const goBackHandler = () => {
        if (customOnClick) {
            customOnClick();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="go-back-arrow-with-text" onClick={goBackHandler}>
            <img src={backButton} alt="Back" />
            <div className="light-grey-text"> {text} </div>
        </div>
    );
};

GoBack.propTypes = {
    text: PropTypes.string.isRequired,
    customOnClick: PropTypes.func,
};


export default GoBack;
