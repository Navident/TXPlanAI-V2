import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import StandardTextField from '../../../../../Components/Common/StandardTextField/StandardTextfield';
import { StyledLabelTextfieldRow  } from '../../index.style';

import { useDispatch, useSelector } from 'react-redux';
import { setExtraOralAndIntraOralFindings, selectExtraOralAndIntraOralFindings } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';

const ExtraOralAndIntraOralFindingsTab = () => {
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
        { label: "Phoyne", field: "phoyne" },
        { label: "Gingiva", field: "gingiva" },
    ];

    return (
        <div>
            {fieldData.map((data, index) => (
                <StyledLabelTextfieldRow key={index}>
                    <div>{data.label}:</div>
                    <StandardTextField
                        label=""
                        value={findings[data.field] || ''}
                        onChange={handleTextFieldChange(data.field)}
                        borderColor="#ccc"
                    />
                </StyledLabelTextfieldRow>
            ))}
            <MultilineTextfield
                label="Additional Notes"
                value={findings.additionalNotes || ''}
                onChange={(e) => dispatch(setExtraOralAndIntraOralFindings({ additionalNotes: e.target.value }))}
            />
        </div>
    );
};

export default ExtraOralAndIntraOralFindingsTab;
