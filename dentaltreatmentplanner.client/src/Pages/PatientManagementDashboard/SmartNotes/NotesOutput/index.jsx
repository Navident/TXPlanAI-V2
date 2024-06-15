import { useSelector } from 'react-redux';
import {
    selectChiefComplaint,
    selectMedicalHistory,
    selectMedications,
    selectAllergies,
    selectExtraOralAndIntraOralFindings,
    selectOcclusions,
    selectFindings
} from '../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';

import ContainerRoundedBox from '../../../../Components/Containers/ContainerRoundedBox/index';
import { StyledNotesContainer, StyledNote } from './index.style';
import {
    StyledLargeText,

} from "../../../../GlobalStyledComponents";


const NotesOutput = () => {
    const chiefComplaint = useSelector(selectChiefComplaint);
    const medicalHistory = useSelector(selectMedicalHistory);
    const medications = useSelector(selectMedications);
    const allergies = useSelector(selectAllergies);
    const extraOralAndIntraOralFindings = useSelector(selectExtraOralAndIntraOralFindings);
    const occlusions = useSelector(selectOcclusions);
    const findings = useSelector(selectFindings);

    const setDefaultValues = (obj, defaultValue) => {
        const updatedObj = {};
        for (const key in obj) {
            if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
                updatedObj[key] = defaultValue;
            } else {
                updatedObj[key] = obj[key];
            }
            console.log(`Key: ${key}, Value: ${updatedObj[key]}`); // Debugging line
        }
        return updatedObj;
    };

    // Check if the "pharynx" key is present in extraOralAndIntraOralFindings
    console.log("Before setting default values:", extraOralAndIntraOralFindings);

    const extraOralFindingsWithNPP = setDefaultValues(extraOralAndIntraOralFindings, "WNL");

    const filterAndRemoveEmptyFields = (obj) => {
        const filteredObj = {};
        for (const key in obj) {
            if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined) {
                filteredObj[key] = obj[key];
            }
        }
        return filteredObj;
    };

    const filteredOcclusions = filterAndRemoveEmptyFields(occlusions);


    const formatTreeData = (treeData) => {
        return treeData.map((node, index) => {
            const children = node.children.map(child => (
                <div className="final-note-child-label" key={child.label}>{child.label}: {child.value}</div>
            ));
            return (
                <div className="final-note-child-label" key={index}>
                    Problem {index + 1}:
                    {children}
                </div>
            );
        });
    };

    const sNotes = (
        <>
            <h2>SUBJECTIVE:</h2>
            <h4>-Chief Complaint-</h4>
            <div className="final-note-child-label">{chiefComplaint}</div>
            <h4>-Medical History-{formatTreeData(medicalHistory.treeData)}</h4>
            <h4>Additional Medical Notes {medicalHistory.additionalNotes}</h4>
            <h4>-Medications-{formatTreeData(medications.treeData)}</h4>
            <h4>Additional Medication Notes: {medications.additionalNotes}</h4>
            <h4>-Allergies-{formatTreeData(allergies.treeData)}</h4>
            <h4>Additional Allergy Notes {allergies.additionalNotes}</h4>
        </>
    );

    const oNotes = (
        <>
            <h2>OBJECTIVE:</h2>
            <h4>-Extra Oral and Intra Oral Findings-</h4>

            <div className="final-note-child-label">Head and Neck: {extraOralFindingsWithNPP.headAndNeck}</div>
            <div className="final-note-child-label">Lymph Chain: {extraOralFindingsWithNPP.lymphChain}</div>
            <div className="final-note-child-label">Lips: {extraOralFindingsWithNPP.lips}</div>
            <div className="final-note-child-label">Tongue: {extraOralFindingsWithNPP.tongue}</div>
            <div className="final-note-child-label">Floor and Mouth: {extraOralFindingsWithNPP.floorAndMouth}</div>
            <div className="final-note-child-label">Hard and Soft Palate: {extraOralFindingsWithNPP.hardAndSoftPalate}</div>
            <div className="final-note-child-label">Pharynx: {extraOralFindingsWithNPP.pharynx}</div>
            <div className="final-note-child-label">Gingiva: {extraOralFindingsWithNPP.gingiva}</div>
            <div className="final-note-child-label">Buccal Mucosa: {extraOralFindingsWithNPP.buccalMucosa}</div>
            <h4>Additional Notes:</h4>
            <div className="final-note-child-label">{extraOralAndIntraOralFindings.additionalNotes}</div>

            <h4>-Occlusion-</h4>
            {Object.keys(filteredOcclusions).map(key => (
                <div className="final-note-child-label" key={key}>{key}: {filteredOcclusions[key]}</div>
            ))}
            <h4>Additional Notes:</h4>
            <div className="final-note-child-label">{occlusions.additionalNotes}</div>
        </>
    );

    const aNotes = (
        <>
            <h2>ASSESSMENT:</h2>
            <h4>-Existing-</h4>
            <div className="final-note-child-label">{findings.existing}</div>
            <h4>-Conditions-</h4>          
            <div className="final-note-child-label">{findings.conditions}</div>
        </>
    );

    const pNotes = (
        <>
            <h2>PLAN:</h2>
            <h4>-Treatment Plan-</h4>
            <div className="final-note-child-label"> {findings.treatments}</div>
        </>
    );

    return (
        <div className="notes-output-wrap">
            <h2>Final Note</h2>
            <StyledNotesContainer>
                <StyledNote>{sNotes}</StyledNote>
                <StyledNote>{oNotes}</StyledNote>
                <StyledNote>{aNotes}</StyledNote>
                <StyledNote>{pNotes}</StyledNote>
            </StyledNotesContainer>
        </div>
    );
};

export default NotesOutput;