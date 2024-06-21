import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chiefComplaint: '',
    medicalHistory: {
        treeData: [],
        additionalNotes: '',
        expandedNodes: []

    },
    medications: {
        treeData: [],
        additionalNotes: '',
        expandedNodes: []

    },
    allergies: {
        treeData: [],
        additionalNotes: '',
        expandedNodes: []

    },
    extraOralAndIntraOralFindings: {
        headAndNeck: '',
        lymphChain: '',
        lips: '',
        tongue: '',
        floorAndMouth: '',
        hardAndSoftPalate: '',
        pharynx: '',
        buccalMucosa: '',
        gingiva: '',
        additionalNotes: ''
    },
    occlusions: {
        overjet: '',
        overbite: '',
        anteriorCrossbite: '',
        posteriorCrossbite: '',
        leftMolarClassification: '',
        rightMolarClassification: '',
        leftCanineClassification: '',
        rightCanineClassification: '',
        doesThePatientWearANightGuard: '',
        overallSpacing: '',
        overallCrowding: '',
        isThePatientInterestedInOrthodontics: '',
        additionalNotes: ''
    },
    findings: {
        existing: '',
        conditions: '',
        treatments: ''
    }
};
const expandNewNode = (treeData, expandedNodes, numNewNodes = 1) => {
    const newPaths = [];
    for (let i = treeData.length - numNewNodes; i < treeData.length; i++) {
        const newPath = String(i);
        const childrenPaths = treeData[i]?.children?.map((_, index) => `${newPath}-${index}`) || [];
        newPaths.push(newPath, ...childrenPaths);
    }
    return [...expandedNodes, ...newPaths];
};

const deleteNode = (treeData, path) => {
    console.log('deleteNode called with:', { treeData: JSON.stringify(treeData), path });

    if (path.length === 1) {
        const filteredTreeData = treeData.filter((_, index) => index !== path[0]);
        console.log('Filtered treeData at root level:', JSON.stringify(filteredTreeData));
        return filteredTreeData;
    }

    const updatedTreeData = treeData.map((node, index) =>
        index === path[0]
            ? { ...node, children: deleteNode(node.children || [], path.slice(1)) }
            : node
    );

    console.log('Updated treeData at deeper level:', JSON.stringify(updatedTreeData));
    return updatedTreeData;
};


const compExamTabsSlice = createSlice({
    name: 'compExamTabs',
    initialState,
    reducers: {
        setChiefComplaint: (state, action) => {
            state.chiefComplaint = action.payload;
        },
        setMedicalHistory: (state, action) => {
            state.medicalHistory = action.payload;
        },
        setMedicalHistoryTreeData: (state, action) => {
            const numNewNodes = action.payload.length - state.medicalHistory.treeData.length;
            state.medicalHistory.treeData = action.payload;
            state.medicalHistory.expandedNodes = expandNewNode(action.payload, state.medicalHistory.expandedNodes, numNewNodes);
        },
        setMedicalHistoryExpandedNodes: (state, action) => {
            state.medicalHistory.expandedNodes = action.payload;
        },
        setMedicalHistoryNotes: (state, action) => {
            state.medicalHistory.additionalNotes = action.payload;
        },
        deleteMedicalHistoryNode: (state, action) => {
            state.medicalHistory.treeData = deleteNode(state.medicalHistory.treeData, action.payload);
        },
        setMedications: (state, action) => {
            state.medications = action.payload;
        },
        setMedicationsTreeData: (state, action) => {
            const numNewNodes = action.payload.length - state.medications.treeData.length;
            state.medications.treeData = action.payload;
            state.medications.expandedNodes = expandNewNode(action.payload, state.medications.expandedNodes, numNewNodes);
        },
        setMedicationsExpandedNodes: (state, action) => {
            state.medications.expandedNodes = action.payload;
        },
        setMedicationsNotes: (state, action) => {
            state.medications.additionalNotes = action.payload;
        },
        deleteMedicationsNode: (state, action) => {
            state.medications.treeData = deleteNode(state.medications.treeData, action.payload);
        },
        setAllergies: (state, action) => {
            state.allergies = action.payload;
        },
        setAllergiesTreeData: (state, action) => {
            const numNewNodes = action.payload.length - state.allergies.treeData.length;
            state.allergies.treeData = action.payload;
            state.allergies.expandedNodes = expandNewNode(action.payload, state.allergies.expandedNodes, numNewNodes);
        },
        setAllergiesExpandedNodes: (state, action) => {
            state.allergies.expandedNodes = action.payload;
        },
        setAllergiesNotes: (state, action) => {
            state.allergies.additionalNotes = action.payload;
        },
        deleteAllergiesNode: (state, action) => {
            state.allergies.treeData = deleteNode(state.allergies.treeData, action.payload);
        },
        setExtraOralAndIntraOralFindings: (state, action) => {
            state.extraOralAndIntraOralFindings = {
                ...state.extraOralAndIntraOralFindings,
                ...action.payload
            };
        },
        setOcclusions: (state, action) => {
            state.occlusions = {
                ...state.occlusions,
                ...action.payload
            };
        },

        setFindings: (state, action) => {
            state.findings = {
                ...state.findings,
                ...action.payload
            };
        }
    }
});

export const {
    setChiefComplaint,
    setMedicalHistory,
    setMedicalHistoryTreeData,
    setMedicalHistoryExpandedNodes,
    setMedicalHistoryNotes,
    setMedications,
    setMedicationsTreeData,
    setMedicationsExpandedNodes,
    setMedicationsNotes,
    setAllergies,
    setAllergiesTreeData,
    setAllergiesExpandedNodes,
    setAllergiesNotes,
    setExtraOralAndIntraOralFindings,
    setOcclusions,
    setFindings,
    deleteMedicalHistoryNode,
    deleteMedicationsNode,
    deleteAllergiesNode
} = compExamTabsSlice.actions;

export const selectChiefComplaint = (state) => state.compExamTabs.chiefComplaint;
export const selectMedicalHistory = (state) => state.compExamTabs.medicalHistory;
export const selectMedications = (state) => state.compExamTabs.medications;
export const selectAllergies = (state) => state.compExamTabs.allergies;
export const selectExtraOralAndIntraOralFindings = (state) => state.compExamTabs.extraOralAndIntraOralFindings;
export const selectOcclusions = (state) => state.compExamTabs.occlusions;
export const selectFindings = (state) => state.compExamTabs.findings;

export default compExamTabsSlice.reducer;