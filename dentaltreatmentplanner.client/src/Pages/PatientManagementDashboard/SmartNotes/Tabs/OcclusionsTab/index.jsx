import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import { useState } from 'react';
import StandardTextField from '../../../../../Components/Common/StandardTextfield/StandardTextfield';
import { StyledLabelTextfieldRow  } from '../../index.style';
import { StyledTwoColumnContainer, StyledColumn, StyledOcclusionsContainer } from './index.style';
import { setOcclusions, selectOcclusions } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { getOcclusionsTabPrompt } from './prompt';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { useDispatch, useSelector } from 'react-redux';

const OcclusionsTab = ({ setAudioProcessingFunction, setLoading }) => {
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

    const processAudioFile = useCallback(async (audioFile) => {
        setLoading(true);
        try {
            const transcribedText = await transcribeAudio(audioFile);
            if (!transcribedText) {
                console.log("No transcribed text available");
                return;
            }

            const categorizedText = await postProcessTranscriptWithGPT(transcribedText, getOcclusionsTabPrompt());
            console.log("Processed categories:", categorizedText);

            if (categorizedText) {
                const updatedOcclusions = {
                    ...occlusions,
                    ...Object.fromEntries(Object.entries(categorizedText).map(([key, value]) => {
                        return [key, occlusions[key] ? occlusions[key] + ' ' + value : value];
                    }))
                };

                dispatch(setOcclusions(updatedOcclusions));
            }
        } catch (error) {
            console.error("Error during audio file processing:", error);
        } finally {
            setLoading(false);
        }
    }, [occlusions, dispatch, setLoading]);

    useEffect(() => {
        setAudioProcessingFunction(() => processAudioFile);
    }, [setAudioProcessingFunction, processAudioFile]);

    return (
                                <>
            <div>Occlusions</div>     
        <StyledOcclusionsContainer>
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
                placeholder="patient wants to wait for ortho until next year"
            />
            </StyledOcclusionsContainer>
        </>
    );
};

export default OcclusionsTab;
