import { StyledSaveButtonRow, } from "./index.style";
import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import { UI_COLORS } from '../../../Theme';
import { Children } from 'react';

const SaveButton = ({ onSave, children, gap }) => {
    const hasChildren = Children.count(children) > 0;

    return (
        <StyledSaveButtonRow hasChildren={hasChildren} gap={gap}>
            {children}
            <RoundedButton
                text="Save"
                backgroundColor={UI_COLORS.green}
                textColor="white"
                border={false}
                width="200px"
                minWidth="200px"
                className="green-button-hover"
                onClick={onSave}
            />
        </StyledSaveButtonRow>
    );
};

export default SaveButton;