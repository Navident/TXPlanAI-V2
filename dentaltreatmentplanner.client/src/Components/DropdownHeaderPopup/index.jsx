import PropTypes from 'prop-types';
import { StyledDropdownPopup, StyledDropdownList, StyledDropdownListItem, StyledItemIcon, StyledItemText } from './index.style';
import settingsIconActive from '../../assets/tx-plan-settings-icon.svg';
import settingsIcon2 from '../../assets/tx-plan-settings-icon.svg';
import PopupAlert from '../Common/PopupAlert';
import { useState } from 'react';
import { logoutUser } from '../../ClientServices/apiService';
import { useNavigate } from 'react-router-dom';

const DropdownHeaderPopup = ({ isVisible }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate(); 

    const handleLogout = async () => {
        await logoutUser();
        setOpenDialog(false); 
        navigate('/'); 
    };

    const dropdownItems = [
        { imgSrc: settingsIconActive, text: "Logout", onClick: () => setOpenDialog(true) },
        { imgSrc: settingsIconActive, text: "Edit Profile", onClick: () => console.log("Edit Profile Clicked") },
    ];

    return (
        <>
            <StyledDropdownPopup isVisible={isVisible}>
                <StyledDropdownList>
                    {dropdownItems.map((item, index) => (
                        <StyledDropdownListItem key={index} onClick={item.onClick}>
                            <StyledItemIcon src={item.imgSrc} alt={item.text} />
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

