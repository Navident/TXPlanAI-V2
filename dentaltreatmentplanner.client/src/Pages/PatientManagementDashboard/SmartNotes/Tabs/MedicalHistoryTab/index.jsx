import MultilineTextfield from '../../../../../Components/Common/MultilineTextfield';
import TreeView from '../../../../../Components/TreeView/index';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMedicalHistoryTreeData, setMedicalHistoryNotes, selectMedicalHistory } from '../../../../../Redux/ReduxSlices/CompExamTabs/compExamTabsSlice';


const MedicalHistoryTab = ({ diseases }) => {
    const dispatch = useDispatch();
    const { treeData, additionalNotes } = useSelector(selectMedicalHistory);

    useEffect(() => {
        if (diseases && treeData.length === 0) {
            const initialData = diseases.map((disease, index) => ({
                label: `Problem ${index + 1}`,
                value: disease.diseaseDefName || '',
                children: [
                    { label: 'Patient Note', value: disease.patNote || '' },
                    { label: 'Date Start', value: disease.dateStart || '' },
                    { label: 'Date Stop', value: disease.dateStop || '' }
                ]
            }));
            dispatch(setMedicalHistoryTreeData(initialData));
        }
    }, [diseases, treeData.length, dispatch]);

    const addParentNode = () => {
        const newNode = {
            label: `Problem ${treeData.length + 1}`,
            value: '',
            children: [
                { label: 'Patient Note', value: '' },
                { label: 'Date Start', value: '' },
                { label: 'Date Stop', value: '' }
            ]
        };
        dispatch(setMedicalHistoryTreeData([...treeData, newNode]));
    };

    const handleNotesChange = (e) => {
        dispatch(setMedicalHistoryNotes(e.target.value));
    };

    return (
        <div>
            <TreeView
                addParentNode={addParentNode}
                addButtonText="Add Medical"
                selector={selectMedicalHistory}
                setTreeData={setMedicalHistoryTreeData}
                setAdditionalNotes={setMedicalHistoryNotes}
            />
            <MultilineTextfield
                label="Additional Notes"
                value={additionalNotes}
                onChange={handleNotesChange}
            />
        </div>
    );
};

export default MedicalHistoryTab;