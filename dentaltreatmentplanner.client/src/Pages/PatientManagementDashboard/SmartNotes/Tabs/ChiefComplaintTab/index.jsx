import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import { useDispatch, useSelector } from 'react-redux';
import { setChiefComplaint, selectChiefComplaint } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getChiefComplaintsTabPrompt } from './prompt';

const ChiefComplaintsTab = ({ setAudioProcessingFunction, setLoading }) => {
    const dispatch = useDispatch();
    const chiefComplaint = useSelector(selectChiefComplaint);

    const updateInputTexts = useCallback((newValues) => {
        dispatch(setChiefComplaint(newValues));
    }, [dispatch]);

    const processAudioFile = useCallback(async (audioFile) => {
        setLoading(true);
        try {
            const transcribedText = await transcribeAudio(audioFile);
            if (!transcribedText) {
                console.log("No transcribed text available");
                return;
            }

            const chiefComplaintSummaryText = await postProcessTranscriptWithGPT(transcribedText, getChiefComplaintsTabPrompt());
            console.log("chiefComplaintSummaryText", chiefComplaintSummaryText);
            updateInputTexts(chiefComplaintSummaryText);
        } catch (error) {
            console.error("Error during audio file processing:", error);
        } finally {
            setLoading(false);
        }
    }, [updateInputTexts, setLoading]);

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
                placeholder="Pain on upper right when eating"
            />
        </div>
    );
};

export default ChiefComplaintsTab;
