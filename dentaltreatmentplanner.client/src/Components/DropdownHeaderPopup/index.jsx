import PropTypes from 'prop-types';
import { StyledDropdownPopup, StyledDropdownList, StyledDropdownListItem, StyledItemIcon, StyledItemText } from './index.style';
import settingsIcon from '../../assets/tx-plan-settings-icon.svg';
import settingsIcon2 from '../../assets/tx-plan-settings-icon.svg';
import PopupAlert from '../Common/PopupAlert';
import { useState } from 'react';
import { logoutUser } from '../../ClientServices/apiService';
import { useNavigate } from 'react-router-dom';
import { useBusiness } from '../../Contexts/BusinessContext/useBusiness';
import logoutIcon from '../../assets/logout-icon.svg';
import logoutIconActive from '../../assets/logout-icon-active.svg';
import profileIcon from '../../assets/profile-icon.svg';
import profileIconActive from '../../assets/profile-icon-active.svg';

const DropdownHeaderPopup = ({ isVisible }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate(); 
    const { resetAppStates } = useBusiness(); 
    const [hoverIndex, setHoverIndex] = useState(null); 

    const handleLogout = async () => {
        await logoutUser();
        setOpenDialog(false);
        resetAppStates();
        navigate('/'); 
    };

    const dropdownItems = [
        { imgSrc: logoutIcon, activeImgSrc: logoutIconActive, text: "Logout", onClick: () => setOpenDialog(true) },
        { imgSrc: profileIcon, activeImgSrc: profileIconActive, text: "Edit Profile", onClick: () => console.log("Edit Profile Clicked") },
    ];


    return (
        <>
            <StyledDropdownPopup isVisible={isVisible}>
                <StyledDropdownList>
                    {dropdownItems.map((item, index) => (
                        <StyledDropdownListItem
                            key={index}
                            onClick={item.onClick}
                            onMouseEnter={() => setHoverIndex(index)} 
                            onMouseLeave={() => setHoverIndex(null)} 
                        >
                            <StyledItemIcon
                                src={hoverIndex === index ? item.activeImgSrc : item.imgSrc}
                                alt={item.text}
                            />
                            <StyledItemText>{item.text}</StyledItemText>
                        </StyledDropdownListItem>
                    ))}
                </StyledDropdownList>
            </StyledDropdownPopup>
            <PopupAlert
                title="Confirm Logout"
                content="Are you sure you want to logout?"
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onAgree={handleLogout}
            />
        </>
    );
};

DropdownHeaderPopup.propTypes = {
    isVisible: PropTypes.bool.isRequired
};

export default DropdownHeaderPopup;

