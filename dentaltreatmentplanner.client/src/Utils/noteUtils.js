export const formatNotes = (chiefComplaint, medicalHistory, medications, allergies, extraOralAndIntraOralFindings, occlusions, findings) => {
    const formatTreeData = (treeData) => {
        return treeData.map((node, index) => {
            const children = node.children.map(child => `${child.label}: ${child.value}`).join('\n        ');
            return `Problem ${index + 1}:\n        ${children}`;
        }).join('\n    ');
    };

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
