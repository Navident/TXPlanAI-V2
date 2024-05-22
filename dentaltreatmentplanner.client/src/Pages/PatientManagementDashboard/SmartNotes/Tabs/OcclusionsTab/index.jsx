import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import { useState } from 'react';
import StandardTextField from '../../../../../Components/Common/StandardTextfield/StandardTextfield';
import { StyledLabelTextfieldRow  } from '../../index.style';
import { StyledTwoColumnContainer, StyledColumn } from './index.style';
import { setOcclusions, selectOcclusions } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { getOcclusionsTabPrompt } from './prompt';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { useDispatch, useSelector } from 'react-redux';

const OcclusionsTab = ({ setAudioProcessingFunction }) => {
    const dispatch = useDispatch();
    const occlusions = useSelector(selectOcclusions);

    const handleTextFieldChange = (field) => (event) => {
        dispatch(setOcclusions({
            ...occlusions,
            [field]: event.target.value
        }));
    };

    const firstColumnFields = [
        { label: "Overjet", field: "overjet" },
        { label: "Overbite", field: "overbite" },
        { label: "Anterior Crossbite", field: "anteriorCrossbite" },
        { label: "Posterior Crossbite", field: "posteriorCrossbite" },
        { label: "Left Molar Classification", field: "leftMolarClassification" },
        { label: "Right Molar Classification", field: "rightMolarClassification" },
        { label: "Left Canine Classification", field: "leftCanineClassification" },
        { label: "Right Canine Classification", field: "rightCanineClassification" },
    ];

    const secondColumnFields = [
        { label: "Does the Patient Wear a night guard?", field: "doesThePatientWearANightGuard" },
        { label: "Overall Spacing", field: "overallSpacing" },
        { label: "Overall Crowding", field: "overallCrowding" },
        { label: "Is the patient interested in orthodontics", field: "isThePatientInterestedInOrthodontics" }
    ];

    const updateInputTexts = useCallback((newValues) => {
        dispatch(setOcclusions(newValues));
    }, [dispatch]);

    const processAudioFile = useCallback(async (audioFile) => {
        const transcribedText = await transcribeAudio(audioFile);
        if (!transcribedText) {
            console.log("No transcribed text available");
            return;
        }

        const categorizedText = await postProcessTranscriptWithGPT(transcribedText, getOcclusionsTabPrompt());
        console.log("Processed categories:", categorizedText);

        if (categorizedText) {
            updateInputTexts(categorizedText);
        }
    }, [updateInputTexts]);

    useEffect(() => {
        setAudioProcessingFunction(() => processAudioFile);
    }, [setAudioProcessingFunction, processAudioFile]);

    return (
        <div>
            <StyledTwoColumnContainer>
                <StyledColumn>
                    {firstColumnFields.map((data, index) => (
                        <StyledLabelTextfieldRow key={index}>
                            <div>{data.label}:</div>
                            <StandardTextField
                                value={occlusions[data.field] || ''}
                                onChange={handleTextFieldChange(data.field)}
                                width="300px"
                            />
                        </StyledLabelTextfieldRow>
                    ))}
                </StyledColumn>
                <StyledColumn>
                    {secondColumnFields.map((data, index) => (
                        <StyledLabelTextfieldRow key={index}>
                            <div>{data.label}:</div>
                            <StandardTextField
                                value={occlusions[data.field] || ''}
                                onChange={handleTextFieldChange(data.field)}
                                width="300px"
                            />
                        </StyledLabelTextfieldRow>
                    ))}
                </StyledColumn>
            </StyledTwoColumnContainer>
            <MultilineTextfield
                label="Additional Notes"
                value={occlusions.additionalNotes || ''}
                onChange={(e) => dispatch(setOcclusions({ ...occlusions, additionalNotes: e.target.value }))}
            />
        </div>
    );
};

export default OcclusionsTab;