import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chiefComplaint: '',
    medicalHistory: {
        treeData: [],
        additionalNotes: ''
    },
    medications: {
        treeData: [],
        additionalNotes: ''
    },
    allergies: {
        treeData: [],
        additionalNotes: ''
    },
    extraOralAndIntraOralFindings: {
        headAndNeck: '',
        lymphChain: '',
        lips: '',
        tongue: '',
        floorAndMouth: '',
        hardAndSoftPalate: '',
        phoyne: '',
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
            state.medicalHistory.treeData = action.payload;
        },
        setMedicalHistoryNotes: (state, action) => {
            state.medicalHistory.additionalNotes = action.payload;
        },
        setMedications: (state, action) => {
            state.medications = action.payload;
        },
        setMedicationsTreeData: (state, action) => {
            state.medications.treeData = action.payload;
        },
        setMedicationsNotes: (state, action) => {
            state.medications.additionalNotes = action.payload;
        },
        setAllergies: (state, action) => {
            state.allergies = action.payload;
        },
        setAllergiesTreeData: (state, action) => {
            state.allergies.treeData = action.payload;
        },
        setAllergiesNotes: (state, action) => {
            state.allergies.additionalNotes = action.payload;
        },
        setExtraOralAndIntraOralFindings: (state, action) => {
            state.extraOralAndIntraOralFindings = {
                ...state.extraOralAndIntraOralFindings,
                ...action.payload
            };
        },
        setOcclusions: (state, action) => {
            state.occlusions = action.payload;
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
    setMedicalHistoryNotes,
    setMedications,
    setMedicationsTreeData,
    setMedicationsNotes,
    setAllergies,
    setAllergiesTreeData,
    setAllergiesNotes,
    setExtraOralAndIntraOralFindings,
    setOcclusions,
    setFindings
} = compExamTabsSlice.actions;

export const selectChiefComplaint = (state) => state.compExamTabs.chiefComplaint;
export const selectMedicalHistory = (state) => state.compExamTabs.medicalHistory;
export const selectMedications = (state) => state.compExamTabs.medications;
export const selectAllergies = (state) => state.compExamTabs.allergies;
export const selectExtraOralAndIntraOralFindings = (state) => state.compExamTabs.extraOralAndIntraOralFindings;
export const selectOcclusions = (state) => state.compExamTabs.occlusions;
export const selectFindings = (state) => state.compExamTabs.findings;

export default compExamTabsSlice.reducer;
