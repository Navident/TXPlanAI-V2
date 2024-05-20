import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import TreeView from '../../../../../Components/TreeView/index';
import { useSelector, useDispatch } from 'react-redux';
import { setMedicalHistoryTreeData, setMedicalHistoryNotes, selectMedicalHistory } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getMedicalHistoryTabPrompt } from './prompt';

const MedicalHistoryTab = ({ medications, setAudioProcessingFunction }) => {
    const dispatch = useDispatch();
    const { treeData, additionalNotes } = useSelector(selectMedicalHistory);

    const createNode = (disease, index) => ({
        label: `Problem ${index + 1}`,
        value: disease?.medName || '',
        children: [
            { label: 'Patient Note', value: disease?.patNote || '' },
            { label: 'Date Start', value: disease?.dateStart || '' },
            { label: 'Date Stop', value: disease?.dateStop || '' }
        ]
    });

    useEffect(() => {
        if (medications && treeData.length === 0) {
            const initialData = medications.map(createNode);
            dispatch(setMedicalHistoryTreeData(initialData));
        }
    }, [medications, treeData.length, dispatch]);

    const addParentNode = () => {
        const newNode = createNode({}, treeData.length);
        dispatch(setMedicalHistoryTreeData([...treeData, newNode]));
    };



    const updateInputTexts = useCallback((newValues) => {
        const updatedData = [...treeData];
        newValues.forEach((medication, index) => {
            const node = createNode(medication, updatedData.length + index);
            updatedData.push(node);
        });
        dispatch(setMedicalHistoryTreeData(updatedData));
    }, [dispatch, treeData]);

    const processAudioFile = useCallback(async (audioFile) => {
        const transcribedText = await transcribeAudio(audioFile);
        if (!transcribedText) {
            console.log("No transcribed text available");
            return;
        }

        const categorizedText = await postProcessTranscriptWithGPT(transcribedText, getMedicalHistoryTabPrompt());
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
            <TreeView
                addParentNode={addParentNode}
                addButtonText="Add Medical"
                selector={selectMedicalHistory}
                setTreeData={setMedicalHistoryTreeData}
            />
        </div>
    );
};

export default MedicalHistoryTab;
