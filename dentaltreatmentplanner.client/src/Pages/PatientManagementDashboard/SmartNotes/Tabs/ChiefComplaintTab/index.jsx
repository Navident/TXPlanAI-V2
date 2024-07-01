import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import { useDispatch, useSelector } from 'react-redux';
import { setChiefComplaint, selectChiefComplaint } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getChiefComplaintsTabPrompt } from './prompt';

const ChiefComplaintsTab = ({ setAudioProcessingFunction, processAudioFile, updateChiefComplaints }) => {
    const dispatch = useDispatch();
    const chiefComplaint = useSelector(selectChiefComplaint);

    useEffect(() => {
        console.log("Setting audio processing function in ChiefComplaintsTab");

        const wrappedProcessAudioFile = (audioFile) => processAudioFile(audioFile, { ChiefComplaints: updateChiefComplaints });
        setAudioProcessingFunction(() => wrappedProcessAudioFile);
    }, [setAudioProcessingFunction, processAudioFile, updateChiefComplaints]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        updateChiefComplaints([{ description: value, duration: '', context: '' }]);
    };
    console.log("Chief Complaint state:", chiefComplaint);

    return (
        <>
            <div>Chief Complaints</div>
            <div>
                <MultilineTextfield
                    label=""
                    value={chiefComplaint.length ? chiefComplaint[0].description : ''}
                    onChange={handleInputChange}
                    placeholder="Pain on upper right when eating"
                />
            </div>
        </>
    );
};

export default ChiefComplaintsTab;