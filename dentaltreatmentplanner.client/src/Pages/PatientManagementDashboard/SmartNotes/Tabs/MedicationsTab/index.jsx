import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import TreeView from '../../../../../Components/TreeView/index';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMedicationsTreeData, setMedicationsNotes, selectMedications } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';

const MedicationsTab = ({ medications }) => {
    const dispatch = useDispatch();
    const { treeData, additionalNotes } = useSelector(selectMedications);

    useEffect(() => {
        if (medications && treeData.length === 0) {
            const initialData = medications.map((medication, index) => ({
                label: `Medication ${index + 1}`,
                value: medication.defDescription || '',
                children: [
                    { label: 'Patient Note', value: medication.patNote || '' },
                    { label: 'Date Start', value: medication.dateStart || '' },
                    { label: 'Date Stop', value: medication.dateStop || '' },
                ]
            }));
            dispatch(setMedicationsTreeData(initialData));
        }
    }, [medications, treeData.length, dispatch]);

    const addParentNode = () => {
        const newNode = {
            label: `Medication ${treeData.length + 1}`,
            value: '',
            children: [
                { label: 'Patient Note', value: '' },
                { label: 'Date Start', value: '' },
                { label: 'Date Stop', value: '' }
            ]
        };
        dispatch(setMedicationsTreeData([...treeData, newNode]));
    };

    const handleNotesChange = (e) => {
        dispatch(setMedicationsNotes(e.target.value));
    };

    return (
        <div>
            <TreeView
                addParentNode={addParentNode}
                addButtonText="Add Medications"
                selector={selectMedications}
                setTreeData={setMedicationsTreeData}
            />
            <MultilineTextfield
                label="Additional Notes"
                value={additionalNotes}
                onChange={handleNotesChange}
            />
        </div>
    );
};

export default MedicationsTab;