import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import { useState } from 'react';
import StandardTextField from '../../../../../Components/Common/StandardTextfield/StandardTextfield';
import { StyledLabelTextfieldRow  } from '../../index.style';
import { StyledTwoColumnContainer, StyledColumn } from './index.style';
import { useSelector, useDispatch } from 'react-redux';
import { setOcclusions, selectOcclusions } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';

const OcclusionsTab = () => {
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