import TreeView from '../../../../../Components/TreeView/index';
import { useSelector, useDispatch } from 'react-redux';
import { setMedicalHistoryTreeData, setMedicalHistoryNotes, setMedicalHistoryExpandedNodes, selectMedicalHistory, deleteMedicalHistoryNode } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getMedicalHistoryTabPrompt } from './prompt';
import { StyledHorizontalCenterContainer } from '../../../../../GlobalStyledComponents';

const MedicalHistoryTab = ({ setAudioProcessingFunction, processAudioFile, updateMedicalHistory, setLoading }) => {
    const dispatch = useDispatch();
    const medicalHistory = useSelector(selectMedicalHistory);
    const { treeData, expandedNodes } = medicalHistory;

    const createNode = (disease, index) => ({
        label: `Problem ${index + 1}`,
        value: disease?.diseaseDefName || '',
        children: [
            { label: 'Patient Note', value: disease?.patNote || '' },
            { label: 'Date Start', value: disease?.dateStart || '' },
            { label: 'Date Stop', value: disease?.dateStop || '' }
        ]
    });

    useEffect(() => {
        if (treeData.length === 0 && medicalHistory.length > 0) {
            const initialData = medicalHistory.map(createNode);
            dispatch(setMedicalHistoryTreeData(initialData));
        }
    }, [medicalHistory, treeData.length, dispatch]);

    const addParentNode = () => {
        const newNode = createNode({}, treeData.length);
        dispatch(setMedicalHistoryTreeData([...treeData, newNode]));
        const newExpandedNodes = [
            ...expandedNodes,
            String(treeData.length),
            ...newNode.children.map((_, index) => `${treeData.length}-${index}`)
        ];
        dispatch(setMedicalHistoryExpandedNodes(newExpandedNodes));
    };

    useEffect(() => {
        console.log("Setting audio processing function in MedicalHistoryTab");

        const wrappedProcessAudioFile = (audioFile) => processAudioFile(audioFile, { MedicalHistory: updateMedicalHistory });
        setAudioProcessingFunction(() => wrappedProcessAudioFile);
    }, [setAudioProcessingFunction, processAudioFile, updateMedicalHistory]);

    return (
        <>
            <div>Medical History</div>
            <StyledHorizontalCenterContainer>
                <TreeView
                    addParentNode={addParentNode}
                    addButtonText="Add Medical"
                    selector={selectMedicalHistory}
                    setTreeData={data => dispatch(setMedicalHistoryTreeData(data))}
                    setExpandedNodes={nodes => dispatch(setMedicalHistoryExpandedNodes(nodes))}
                    deleteNodeAction={path => {
                        console.log('Dispatching deleteNodeAction with path:', path);
                        dispatch(deleteMedicalHistoryNode(path));
                    }}
                />
            </StyledHorizontalCenterContainer>
        </>
    );
};

export default MedicalHistoryTab;