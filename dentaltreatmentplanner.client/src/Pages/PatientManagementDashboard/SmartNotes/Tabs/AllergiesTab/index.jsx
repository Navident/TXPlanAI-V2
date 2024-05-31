import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import TreeView from '../../../../../Components/TreeView/index';
import { useSelector, useDispatch } from 'react-redux';
import { setAllergiesTreeData, setAllergiesExpandedNodes, setAllergiesNotes, selectAllergies } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getAllergiesTabPrompt } from './prompt';

const AllergiesTab = ({ allergies, setAudioProcessingFunction }) => {
    const dispatch = useDispatch();
    const { treeData, additionalNotes, expandedNodes } = useSelector(selectAllergies);

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
    };

    const updateInputTexts = useCallback((newValues) => {
        const updatedData = [...treeData];
        newValues.forEach((allergy, index) => {
            const node = createNode(allergy, updatedData.length + index);
            updatedData.push(node);
        });
        dispatch(setAllergiesTreeData(updatedData));
    }, [dispatch, treeData]);

    const processAudioFile = useCallback(async (audioFile) => {
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
    }, [updateInputTexts]);

    useEffect(() => {
        setAudioProcessingFunction(() => processAudioFile);
    }, [setAudioProcessingFunction, processAudioFile]);

    return (
        <div>
            <TreeView
                addParentNode={addParentNode}
                addButtonText="Add Allergies"
                selector={selectAllergies}
                setTreeData={setAllergiesTreeData}
                setExpandedNodes={(nodes) => dispatch(setAllergiesExpandedNodes(nodes))}
            />
        </div>
    );
};

export default AllergiesTab;
