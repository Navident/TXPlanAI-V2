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

    const formatTreeData = (treeData) => {
        return treeData.map((node, index) => {
            const children = node.children.map(child => `${child.label}: ${child.value}`).join('\n        ');
            return `Problem ${index + 1}:\n        ${children}`;
        }).join('\n    ');
    };

    const formatNotes = () => {
        const sNotes = `
Subjective
    Chief Complaint: ${chiefComplaint}
    Medical History: ${formatTreeData(medicalHistory.treeData)}
    Additional Medical Notes: ${medicalHistory.additionalNotes}
    Medications: ${formatTreeData(medications.treeData)}
    Additional Medication Notes: ${medications.additionalNotes}
    Allergies: ${formatTreeData(allergies.treeData)}
    Additional Allergy Notes: ${allergies.additionalNotes}
`;

        const oNotes = `
Objective
    Extra Oral and Intra Oral Findings:
        Head and Neck: ${extraOralAndIntraOralFindings.headAndNeck}
        Lymph Chain: ${extraOralAndIntraOralFindings.lymphChain}
        Lips: ${extraOralAndIntraOralFindings.lips}
        Tongue: ${extraOralAndIntraOralFindings.tongue}
        Floor and Mouth: ${extraOralAndIntraOralFindings.floorAndMouth}
        Hard and Soft Palate: ${extraOralAndIntraOralFindings.hardAndSoftPalate}
        Pharynx: ${extraOralAndIntraOralFindings.pharynx}
        Gingiva: ${extraOralAndIntraOralFindings.gingiva}
        Additional Notes: ${extraOralAndIntraOralFindings.additionalNotes}
    Occlusion:
        Overjet: ${occlusions.overjet}
        Overbite: ${occlusions.overbite}
        Anterior Crossbite: ${occlusions.anteriorCrossbite}
        Posterior Crossbite: ${occlusions.posteriorCrossbite}
        Left Molar Classification: ${occlusions.leftMolarClassification}
        Right Molar Classification: ${occlusions.rightMolarClassification}
        Left Canine Classification: ${occlusions.leftCanineClassification}
        Right Canine Classification: ${occlusions.rightCanineClassification}
        Does the Patient Wear a Night Guard: ${occlusions.doesThePatientWearANightGuard}
        Overall Spacing: ${occlusions.overallSpacing}
        Overall Crowding: ${occlusions.overallCrowding}
        Is the Patient Interested in Orthodontics: ${occlusions.isThePatientInterestedInOrthodontics}
        Additional Notes: ${occlusions.additionalNotes}
`;

        const aNotes = `
Assessment
    Existing: ${findings.existing}
    Conditions: ${findings.conditions}
`;

        const pNotes = `
Plan
    Treatment Plan: ${findings.treatments}
`;

        return { sNotes, oNotes, aNotes, pNotes };
    };

    const { sNotes, oNotes, aNotes, pNotes } = formatNotes();
    return (
        <>
        <StyledLargeText>Final Note</StyledLargeText>
        <StyledNotesContainer>
            
                <StyledNote><pre>{sNotes}</pre></StyledNote>
                <StyledNote><pre>{oNotes}</pre></StyledNote>
                <StyledNote><pre>{aNotes}</pre></StyledNote>
                <StyledNote><pre>{pNotes}</pre></StyledNote>
            </StyledNotesContainer>
            
        </>
    );
};

export default NotesOutput;
