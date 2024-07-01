import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import TreeView from '../../../../../Components/TreeView/index';
import { useSelector, useDispatch } from 'react-redux';
import { setAllergiesTreeData, setAllergiesExpandedNodes, setAllergiesNotes, selectAllergies, deleteAllergiesNode } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';
import { useEffect, useCallback } from "react";
import { transcribeAudio, postProcessTranscriptWithGPT } from "../../../../../OpenAI/Whisper/whisperService";
import { getAllergiesTabPrompt } from './prompt';

const AllergiesTab = ({ setAudioProcessingFunction, processAudioFile, updateAllergies }) => {
    const dispatch = useDispatch();
    const allergies = useSelector(selectAllergies);
    const { treeData, expandedNodes } = allergies;

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
        if (treeData.length === 0 && allergies.length > 0) {
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

    useEffect(() => {
        console.log("Setting audio processing function in AllergiesTab");

        const wrappedProcessAudioFile = (audioFile) => processAudioFile(audioFile, { Allergies: updateAllergies });
        setAudioProcessingFunction(() => wrappedProcessAudioFile);
    }, [setAudioProcessingFunction, processAudioFile, updateAllergies]);

    return (
        <>
            <div>Allergies</div>
            <TreeView
                addParentNode={addParentNode}
                addButtonText="Add Allergies"
                selector={selectAllergies}
                setTreeData={data => dispatch(setAllergiesTreeData(data))}
                setExpandedNodes={nodes => dispatch(setAllergiesExpandedNodes(nodes))}
                deleteNodeAction={path => {
                    console.log('Dispatching deleteNodeAction with path:', path);
                    dispatch(deleteAllergiesNode(path));
                }}
            />
        </>
    );
};

export default AllergiesTab;