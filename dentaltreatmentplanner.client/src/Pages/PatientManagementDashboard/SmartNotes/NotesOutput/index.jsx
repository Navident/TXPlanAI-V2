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
        }
        return updatedObj;
    };

    const extraOralFindingsWithNPP = setDefaultValues(extraOralAndIntraOralFindings, "NPP");

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
            <h2>Subjective</h2>
            <h4> Chief Complaint</h4>
            <div className="final-note-child-label">Text: {chiefComplaint}</div>
            <h4>Medical History{formatTreeData(medicalHistory.treeData)}</h4>
            <h4>Additional Medical Notes {medicalHistory.additionalNotes}</h4>
            <h4>Medications{formatTreeData(medications.treeData)}</h4>
            <h4>Additional Medication Notes: {medications.additionalNotes}</h4>
            <h4>Allergies{formatTreeData(allergies.treeData)}</h4>
            <h4>Additional Allergy Notes {allergies.additionalNotes}</h4>
        </>
    );

    const oNotes = (
        <>
            <h2>Objective</h2>
            <h4>Extra Oral and Intra Oral Findings</h4>

            <div className="final-note-child-label">Head and Neck: {extraOralFindingsWithNPP.headAndNeck}</div>
            <div className="final-note-child-label">Lymph Chain: {extraOralFindingsWithNPP.lymphChain}</div>
            <div className="final-note-child-label">Lips: {extraOralFindingsWithNPP.lips}</div>
            <div className="final-note-child-label">Tongue: {extraOralFindingsWithNPP.tongue}</div>
            <div className="final-note-child-label">Floor and Mouth: {extraOralFindingsWithNPP.floorAndMouth}</div>
            <div className="final-note-child-label">Hard and Soft Palate: {extraOralFindingsWithNPP.hardAndSoftPalate}</div>
            <div className="final-note-child-label">Pharynx: {extraOralFindingsWithNPP.pharynx}</div>
            <div className="final-note-child-label">Gingiva: {extraOralFindingsWithNPP.gingiva}</div>

            <h4>Additional Notes</h4>
            <div className="final-note-child-label">Text: {extraOralAndIntraOralFindings.additionalNotes}</div>

            <h4>Occlusion</h4>
            <div className="final-note-child-label">Overjet: {occlusions.overjet}</div>
            <div className="final-note-child-label">Overbite: {occlusions.overbite}</div>
            <div className="final-note-child-label">Anterior Crossbite: {occlusions.anteriorCrossbite}</div>
            <div className="final-note-child-label">Posterior Crossbite: {occlusions.posteriorCrossbite}</div>
            <div className="final-note-child-label">Left Molar Classification: {occlusions.leftMolarClassification}</div>
            <div className="final-note-child-label">Right Molar Classification: {occlusions.rightMolarClassification}</div>
            <div className="final-note-child-label">Left Canine Classification: {occlusions.leftCanineClassification}</div>
            <div className="final-note-child-label">Right Canine Classification: {occlusions.rightCanineClassification}</div>
            <div className="final-note-child-label">Does the Patient Wear a Night Guard: {occlusions.doesThePatientWearANightGuard}</div>
            <div className="final-note-child-label">Overall Spacing: {occlusions.overallSpacing}</div>
            <div className="final-note-child-label">Overall Crowding: {occlusions.overallCrowding}</div>
            <div className="final-note-child-label">Is the Patient Interested in Orthodontics: {occlusions.isThePatientInterestedInOrthodontics}</div>
            <h4>Additional Notes</h4>
            <div className="final-note-child-label">Text: {occlusions.additionalNotes}</div>
        </>
    );

    const aNotes = (
        <>
            <h2>Assessment</h2>
            <h4>Findings</h4>
            <div className="final-note-child-label">Existing: {findings.existing}</div>
            <div className="final-note-child-label">Conditions: {findings.conditions}</div>
        </>
    );

    const pNotes = (
        <>
            <h2>Plan</h2>
            <h4>Findings</h4>
            <div className="final-note-child-label">Treatment Plan: {findings.treatments}</div>
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