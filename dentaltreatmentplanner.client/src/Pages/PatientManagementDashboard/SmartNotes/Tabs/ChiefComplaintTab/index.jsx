import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import { useDispatch, useSelector } from 'react-redux';
import { setChiefComplaint, selectChiefComplaint } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getChiefComplaintsTabPrompt } from './prompt';

const ChiefComplaintsTab = ({
    setAudioProcessingFunction
}) => {
    const dispatch = useDispatch();
    const chiefComplaint = useSelector(selectChiefComplaint);

    const updateInputTexts = useCallback((newValues) => {
        dispatch(setChiefComplaint(newValues));
    }, [dispatch]);

    const processAudioFile = useCallback(async (audioFile) => {
        const transcribedText = await transcribeAudio(audioFile);
        if (!transcribedText) {
            console.log("No transcribed text available");
            return;
        }

        const chiefComplaintSummaryText = await postProcessTranscriptWithGPT(transcribedText, getChiefComplaintsTabPrompt());
        console.log("chiefComplaintSummaryText", chiefComplaintSummaryText);
        updateInputTexts(chiefComplaintSummaryText);
    }, [updateInputTexts]);

    useEffect(() => {
        setAudioProcessingFunction(() => processAudioFile);
    }, [setAudioProcessingFunction, processAudioFile]);

    const handleInputChange = (event) => {
        updateInputTexts(event.target.value);
    };

    return (
        <div>
            <MultilineTextfield
                label="Chief Complaints"
                value={chiefComplaint}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default ChiefComplaintsTab;