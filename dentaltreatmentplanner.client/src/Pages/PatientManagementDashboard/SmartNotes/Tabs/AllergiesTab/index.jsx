import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import TreeView from '../../../../../Components/TreeView/index';
import { useSelector, useDispatch } from 'react-redux';
import { setAllergiesTreeData, setAllergiesExpandedNodes, setAllergiesNotes, selectAllergies, deleteAllergiesNode } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getAllergiesTabPrompt } from './prompt';

const AllergiesTab = ({ allergies, setAudioProcessingFunction, setLoading }) => {
    const dispatch = useDispatch();
    const { treeData, expandedNodes } = useSelector(selectAllergies);

    const createNode = (allergy, index) => ({
        label: `Allergy ${index + 1}`,
        value: allergy?.defDescription || '',
        children: [
            { label: 'Reaction', value: allergy?.reaction || '' },
            { label: 'Date Adverse Reaction', value: allergy?.dateAdverseReaction || '' },
            { label: 'Patient Note', value: allergy?.patNote || '' },
        ]
    });

    useEffect(() => {
        if (allergies && treeData.length === 0) {
            const initialData = allergies.map(createNode);
            dispatch(setAllergiesTreeData(initialData));
        }
    }, [allergies, treeData.length, dispatch]);

    const addParentNode = () => {
        const newNode = createNode({}, treeData.length);
        dispatch(setAllergiesTreeData([...treeData, newNode]));
        const newExpandedNodes = [
            ...expandedNodes,
            String(treeData.length),
            ...newNode.children.map((_, index) => `${treeData.length}-${index}`)
        ];
        dispatch(setAllergiesExpandedNodes(newExpandedNodes));
    };

    const updateInputTexts = useCallback((newValues) => {
        const updatedData = [...treeData];
        const currentIndex = updatedData.length;
        const newExpandedNodes = [...expandedNodes];

        newValues.forEach((allergy, index) => {
            const node = createNode(allergy, currentIndex + index);
            updatedData.push(node);
            newExpandedNodes.push(String(currentIndex + index));
            node.children.forEach((_, childIndex) => {
                newExpandedNodes.push(`${currentIndex + index}-${childIndex}`);
            });
        });

        dispatch(setAllergiesTreeData(updatedData));
        dispatch(setAllergiesExpandedNodes(newExpandedNodes));
    }, [dispatch, treeData, expandedNodes]);

    const processAudioFile = useCallback(async (audioFile) => {
        setLoading(true);
        try {
            const transcribedText = await transcribeAudio(audioFile);
            if (!transcribedText) {
                console.log("No transcribed text available");
                return;
            }

            const categorizedText = await postProcessTranscriptWithGPT(transcribedText, getAllergiesTabPrompt());
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
            addButtonText="Add Allergies"
            selector={selectAllergies}
            setTreeData={setAllergiesTreeData}
            setExpandedNodes={(nodes) => dispatch(setAllergiesExpandedNodes(nodes))}
            deleteNodeAction={(path) => {
                console.log('Dispatching deleteNodeAction with path:', path);
                dispatch(deleteAllergiesNode(path));
            }}
        />
    );
};

export default AllergiesTab;