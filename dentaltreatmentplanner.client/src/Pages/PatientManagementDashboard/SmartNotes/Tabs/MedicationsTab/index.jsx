import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import TreeView from '../../../../../Components/TreeView/index';
import { useSelector, useDispatch } from 'react-redux';
import { setMedicationsTreeData, setMedicationsNotes, selectMedications } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getMedicationsTabPrompt } from './prompt';

const MedicationsTab = ({ medications, setAudioProcessingFunction }) => {
    const dispatch = useDispatch();
    const { treeData, additionalNotes } = useSelector(selectMedications);

    const createNode = (medication, index) => ({
        label: `Medication ${index + 1}`,
        value: medication?.medName || '',
        children: [
            { label: 'Patient Note', value: medication?.patNote || '' },
            { label: 'Date Start', value: medication?.dateStart || '' },
            { label: 'Date Stop', value: medication?.dateStop || '' }
        ]
    });

    useEffect(() => {
        if (medications && treeData.length === 0) {
            const initialData = medications.map(createNode);
            dispatch(setMedicationsTreeData(initialData));
        }
    }, [medications, treeData.length, dispatch]);

    const addParentNode = () => {
        const newNode = createNode({}, treeData.length);
        dispatch(setMedicationsTreeData([...treeData, newNode]));
    };

    const updateInputTexts = useCallback((newValues) => {
        const updatedData = [...treeData];
        newValues.forEach((medication, index) => {
            const node = createNode(medication, updatedData.length + index);
            updatedData.push(node);
        });
        dispatch(setMedicationsTreeData(updatedData));
    }, [dispatch, treeData]);

    const processAudioFile = useCallback(async (audioFile) => {
        const transcribedText = await transcribeAudio(audioFile);
        if (!transcribedText) {
            console.log("No transcribed text available");
            return;
        }

        const categorizedText = await postProcessTranscriptWithGPT(transcribedText, getMedicationsTabPrompt());
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
                addButtonText="Add Medications"
                selector={selectMedications}
                setTreeData={setMedicationsTreeData}
            />

        </div>
    );
};

export default MedicationsTab;
