import TreeView from '../../../../../Components/TreeView/index';
import { useSelector, useDispatch } from 'react-redux';
import { setMedicalHistoryTreeData, setMedicalHistoryNotes, setMedicalHistoryExpandedNodes, selectMedicalHistory, deleteMedicalHistoryNode } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getMedicalHistoryTabPrompt } from './prompt';
import { StyledHorizontalCenterContainer } from '../../../../../GlobalStyledComponents';

const MedicalHistoryTab = ({ diseases, setAudioProcessingFunction, setLoading }) => {
    const dispatch = useDispatch();
    const { treeData, expandedNodes } = useSelector(selectMedicalHistory);

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
        if (diseases && treeData.length === 0) {
            const initialData = diseases.map(createNode);
            dispatch(setMedicalHistoryTreeData(initialData));
        }
    }, [diseases, treeData.length, dispatch]);

    const addParentNode = () => {
        const newNode = createNode({}, treeData.length);
        dispatch(setMedicalHistoryTreeData([...treeData, newNode]));
        const newExpandedNodes = [
            ...treeData.map((_, index) => String(index)),
            String(treeData.length),
            ...newNode.children.map((_, index) => `${treeData.length}-${index}`)
        ];
        dispatch(setMedicalHistoryExpandedNodes(newExpandedNodes));
    };

    const updateInputTexts = useCallback((newValues) => {
        const updatedData = [...treeData];
        const currentIndex = updatedData.length;
        const newExpandedNodes = [...expandedNodes];

        newValues.forEach((disease, index) => {
            const node = createNode(disease, currentIndex + index);
            updatedData.push(node);
            newExpandedNodes.push(String(currentIndex + index));
            node.children.forEach((_, childIndex) => {
                newExpandedNodes.push(`${currentIndex + index}-${childIndex}`);
            });
        });

        dispatch(setMedicalHistoryTreeData(updatedData));
        dispatch(setMedicalHistoryExpandedNodes(newExpandedNodes));
    }, [dispatch, treeData, expandedNodes]);

    const processAudioFile = useCallback(async (audioFile) => {
        setLoading(true);
        try {
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
        <StyledHorizontalCenterContainer>
            <TreeView
                addParentNode={addParentNode}
                addButtonText="Add Medical"
                selector={selectMedicalHistory}
                setTreeData={setMedicalHistoryTreeData}
                setExpandedNodes={(nodes) => dispatch(setMedicalHistoryExpandedNodes(nodes))}
                deleteNodeAction={(path) => {
                    console.log('Dispatching deleteNodeAction with path:', path);
                    dispatch(deleteMedicalHistoryNode(path));
                }}
            />
        </StyledHorizontalCenterContainer>
    );
};

export default MedicalHistoryTab;