import {
    StyledPrintImportButton,
    StyledPrintSaveBtnContainer,
    StyledFlexAlignContainer,
    StyledPrintImportBtnContainer,
    StyledPrintExportBtnWithText
} from "./index.style";
import RoundedButton from "../../../../Components/Common/RoundedButton/RoundedButton";
import { UI_COLORS } from '../../../../Theme';
import { useState, useEffect, useRef } from 'react';
import ToolbarContainer from "../../../../Components/Containers/ToolbarContainer/index";
import { useSelector, useDispatch } from 'react-redux';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import MicIcon from '@mui/icons-material/Mic';
import { StyledListeningText } from '../../SmartNotes/index.style';

const SmartNotesToolbar = ({ recording, handleMicClick }) => {
    return (
        <>
            <ToolbarContainer>
                <StyledFlexAlignContainer justify="flex-end">
                    <StyledPrintSaveBtnContainer>
                        <div onClick={handleMicClick} style={{ cursor: "pointer", display: 'flex', alignItems: 'center', zIndex: "999" }}>
                            {recording ? (
                                <>
                                    <StopCircleIcon style={{ width: "40px", height: "auto", color: "red" }} />
                                    <StyledListeningText>listening...</StyledListeningText>
                                </>
                            ) : (
                                <MicIcon style={{ width: "40px", height: "auto" }} />
                            )}
                        </div>
                    </StyledPrintSaveBtnContainer>
                </StyledFlexAlignContainer>
            </ToolbarContainer>
        </>
    );
};

export default SmartNotesToolbar;
