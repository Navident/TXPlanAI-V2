import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import TreeView from '../../../../../Components/TreeView/index';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAllergiesTreeData, setAllergiesNotes, selectAllergies } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';

const AllergiesTab = ({ allergies }) => {
    const dispatch = useDispatch();
    const { treeData, additionalNotes } = useSelector(selectAllergies);

    useEffect(() => {
        if (allergies && treeData.length === 0) {
            const initialData = allergies.map((allergy, index) => ({
                label: `Allergy ${index + 1}`,
                value: allergy.defDescription || '',
                children: [
                    { label: 'Reaction', value: allergy.reaction || '' },
                    { label: 'Date Adverse Reaction', value: allergy.dateAdverseReaction || '' }
                ]
            }));
            dispatch(setAllergiesTreeData(initialData));
        }
    }, [allergies, treeData.length, dispatch]);

    const addParentNode = () => {
        const newNode = {
            label: `Allergy ${treeData.length + 1}`,
            value: '',
            children: [
                { label: 'Reaction', value: '' },
                { label: 'Date Adverse Reaction', value: '' }
            ]
        };
        dispatch(setAllergiesTreeData([...treeData, newNode]));
    };

    const handleNotesChange = (e) => {
        dispatch(setAllergiesNotes(e.target.value));
    };

    return (
        <div>
            <TreeView
                addParentNode={addParentNode}
                addButtonText="Add Allergy"
                selector={selectAllergies}
                setTreeData={setAllergiesTreeData}
            />
            <MultilineTextfield
                label="Additional Notes"
                value={additionalNotes}
                onChange={handleNotesChange}
            />
        </div>
    );
};

export default AllergiesTab;