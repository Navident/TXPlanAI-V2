import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import TreeView from '../../../../../Components/TreeView/index';
import { useSelector, useDispatch } from 'react-redux';
import { setMedicationsTreeData, setMedicationsNotes, selectMedications, setMedicationsExpandedNodes, deleteMedicationsNode } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getMedicationsTabPrompt } from './prompt';
import { StyledHorizontalCenterContainer } from '../../../../../GlobalStyledComponents';

const MedicationsTab = ({ medications, setAudioProcessingFunction, setLoading }) => {
    const dispatch = useDispatch();
    const { treeData, expandedNodes } = useSelector(selectMedications);

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
        const newExpandedNodes = [
            ...treeData.map((_, index) => String(index)),
            String(treeData.length),
            ...newNode.children.map((_, index) => `${treeData.length}-${index}`)
        ];
        dispatch(setMedicationsExpandedNodes(newExpandedNodes));
    };

    const updateInputTexts = useCallback((newValues) => {
        const updatedData = [...treeData];
        const currentIndex = updatedData.length;
        const newExpandedNodes = [...expandedNodes];

        newValues.forEach((medication, index) => {
            // Check if the medication already exists
            const exists = updatedData.some(node => node.value === medication.medName);
            if (!exists) {
                const node = createNode(medication, currentIndex + index);
                updatedData.push(node);
                newExpandedNodes.push(String(currentIndex + index));
                node.children.forEach((_, childIndex) => {
                    newExpandedNodes.push(`${currentIndex + index}-${childIndex}`);
                });
            }
        });

        dispatch(setMedicationsTreeData(updatedData));
        dispatch(setMedicationsExpandedNodes(newExpandedNodes));
    }, [dispatch, treeData, expandedNodes]);

    const processAudioFile = useCallback(async (audioFile) => {
        setLoading(true);
        try {
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
        } catch (error) {
            console.error("Error during audio file processing:", error);
        } finally {
            setLoading(false);
        }
    }, [updateInputTexts, setLoading]);

    useEffect(() => {
        setAudioProcessingFunction(() => processAudioFile);
    }, [setAudioProcessingFunction, processAudioFile]);

    return (
        <TreeView
            addParentNode={addParentNode}
            addButtonText="Add Medications"
            selector={selectMedications}
            setTreeData={setMedicationsTreeData}
            setExpandedNodes={(nodes) => dispatch(setMedicationsExpandedNodes(nodes))}
            deleteNodeAction={(path) => {
                console.log('Dispatching deleteNodeAction with path:', path);
                dispatch(deleteMedicationsNode(path));
            }}
        />
    );
};

export default MedicationsTab;