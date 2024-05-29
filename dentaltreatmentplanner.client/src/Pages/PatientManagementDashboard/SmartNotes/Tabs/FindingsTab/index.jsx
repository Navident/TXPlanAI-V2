
import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import RoundedButton from '../../../../../Components/Common/RoundedButton/RoundedButton';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getFindingsTabPrompt } from './prompt';
import { useDispatch, useSelector } from 'react-redux';
import { setFindings, selectFindings } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';

const FindingsTab = ({
    handleGenerateTreatmentPlan,
    setTreatmentsInputText,
    setAudioProcessingFunction
}) => {
    const dispatch = useDispatch();
    const inputTexts = useSelector(selectFindings);

    const updateInputTexts = useCallback((newValues) => {
        dispatch(setFindings(newValues));
        if (newValues.treatments) {
            setTreatmentsInputText(newValues.treatments);
        }
    }, [dispatch, setTreatmentsInputText]);

    const processAudioFile = useCallback(async (audioFile) => {
        const transcribedText = await transcribeAudio(audioFile);
        if (!transcribedText) {
            console.log("No transcribed text available");
            return;
        }

        const categorizedText = await postProcessTranscriptWithGPT(transcribedText, getFindingsTabPrompt());
        console.log("Processed categories:", categorizedText);

        const newTexts = {
            existing: categorizedText.Existing.join('\n'),
            conditions: categorizedText.Conditions.join('\n'),
            treatments: categorizedText.Treatments.join('\n')
        };

        updateInputTexts(newTexts);
    }, [updateInputTexts]);

    useEffect(() => {
        setAudioProcessingFunction(() => processAudioFile);
    }, [setAudioProcessingFunction, processAudioFile]);

    return (
        <div>
            <div className="textfield-row">
                <MultilineTextfield
                    label="Existing"
                    value={inputTexts.existing}
                    onChange={(e) => updateInputTexts({ existing: e.target.value })}
                />
                <MultilineTextfield
                    label="Conditions"
                    value={inputTexts.conditions}
                    onChange={(e) => updateInputTexts({ conditions: e.target.value })}
                />
            </div>
            <MultilineTextfield
                label="Treatments"
                value={inputTexts.treatments}
                onChange={(e) => updateInputTexts({ treatments: e.target.value })}
            />
            <RoundedButton
                text="Generate Treatment Plan"
                backgroundColor="#7777a1"
                textColor="white"
                border={false}
                width="fit-content"
                onClick={handleGenerateTreatmentPlan}
                className="purple-button-hover"
            />
        </div>
    );
};

export default FindingsTab;
