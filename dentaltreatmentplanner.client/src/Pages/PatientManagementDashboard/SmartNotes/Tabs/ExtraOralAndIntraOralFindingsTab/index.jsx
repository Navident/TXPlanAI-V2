import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import StandardTextField from '../../../../../Components/Common/StandardTextfield/StandardTextfield';
import { StyledLabelTextfieldRow  } from '../../index.style';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { useDispatch, useSelector } from 'react-redux';
import { setExtraOralAndIntraOralFindings, selectExtraOralAndIntraOralFindings } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { getExtraOralAndIntraOralFindingsTabPrompt } from './prompt';
import { StyledHorizontalCenterContainer } from '../../../../../GlobalStyledComponents';

const ExtraOralAndIntraOralFindingsTab = ({ setAudioProcessingFunction, setLoading }) => {
    const dispatch = useDispatch();
    const findings = useSelector(selectExtraOralAndIntraOralFindings);

    const handleTextFieldChange = (field) => (event) => {
        dispatch(setExtraOralAndIntraOralFindings({ [field]: event.target.value }));
    };

    const fieldData = [
        { label: "Head and Neck", field: "headAndNeck" },
        { label: "Lymph Chain", field: "lymphChain" },
        { label: "Lips", field: "lips" },
        { label: "Tongue", field: "tongue" },
        { label: "Floor and Mouth", field: "floorAndMouth" },
        { label: "Hard and Soft Palate", field: "hardAndSoftPalate" },
        { label: "Pharynx", field: "pharynx" },
        { label: "Gingiva", field: "gingiva" },
        { label: "Buccal Mucosa", field: "buccalMucosa" },
    ];

    const updateInputTexts = useCallback((newValues) => {
        dispatch(setExtraOralAndIntraOralFindings(newValues));
    }, [dispatch]);

    const processAudioFile = useCallback(async (audioFile) => {
        setLoading(true);
        try {
            const transcribedText = await transcribeAudio(audioFile);
            if (!transcribedText) {
                console.log("No transcribed text available");
                return;
            }

            const categorizedText = await postProcessTranscriptWithGPT(transcribedText, getExtraOralAndIntraOralFindingsTabPrompt());
            console.log("Processed categories:", categorizedText);

            if (categorizedText) {
                updateInputTexts(categorizedText);
            }
        } catch (error) {
            console.error("Error during audio file processing:", error);
        } finally {
            setLoading(false);
        }
    }, [updateInputTexts, setLoading]);

    useEffect(() => {
        setAudioProcessingFunction(() => processAudioFile);
    }, [setAudioProcessingFunction, processAudioFile]);

    return (
                        <>
            <div>Extra Oral Intra Oral Health</div>      
        <StyledHorizontalCenterContainer>
            {fieldData.map((data, index) => (
                <StyledLabelTextfieldRow key={index}>
                    <div>{data.label}:</div>
                    <StandardTextField
                        label=""
                        value={findings[data.field] || ''}
                        onChange={handleTextFieldChange(data.field)}
                        borderColor="#ccc"
                        width="350px"
                    />
                </StyledLabelTextfieldRow>
            ))}

            </StyledHorizontalCenterContainer>
        </>
    );
};

export default ExtraOralAndIntraOralFindingsTab;
