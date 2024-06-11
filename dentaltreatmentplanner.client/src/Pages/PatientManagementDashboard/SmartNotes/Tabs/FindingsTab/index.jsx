
import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import RoundedButton from '../../../../../Components/Common/RoundedButton/RoundedButton';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getFindingsTabPrompt } from './prompt';
import { useDispatch, useSelector } from 'react-redux';
import { setFindings, selectFindings } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { StyledFindingsTabContainer  } from './index.style';

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

    const groupTreatmentsByTooth = (treatments) => {
        const treatmentMap = {};

        treatments.forEach(treatment => {
            const [tooth, ...procedure] = treatment.split(' ');
            const procedureText = procedure.join(' ');

            if (treatmentMap[tooth]) {
                treatmentMap[tooth].push(procedureText);
            } else {
                treatmentMap[tooth] = [procedureText];
            }
        });

        return Object.entries(treatmentMap).map(
            ([tooth, procedures]) => `${tooth} ${procedures.join(', ')}`
        );
    };

    const processAudioFile = useCallback(async (audioFile) => {
        const transcribedText = await transcribeAudio(audioFile);
        if (!transcribedText) {
            console.log("No transcribed text available");
            return;
        }

        const categorizedText = await postProcessTranscriptWithGPT(transcribedText, getFindingsTabPrompt());
        console.log("Processed categories:", categorizedText);

        const processedTreatments = groupTreatmentsByTooth(categorizedText.Treatments);

        const newTexts = {
            existing: categorizedText.Existing.join('\n'),
            conditions: categorizedText.Conditions.join('\n'),
            treatments: processedTreatments.join('\n')
        };

        updateInputTexts(newTexts);
    }, [updateInputTexts]);

    useEffect(() => {
        setAudioProcessingFunction(() => processAudioFile);
    }, [setAudioProcessingFunction, processAudioFile]);

    return (
        <StyledFindingsTabContainer>
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
        </StyledFindingsTabContainer>
    );
};

export default FindingsTab;