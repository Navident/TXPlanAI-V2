import PropTypes from 'prop-types';
import './TreatmentPlanConfiguration.css';
import Table from "../Table/Table";
import { useState, useEffect } from 'react';
import DropdownSearch from "../DropdownSearch/DropdownSearch";
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import { updateTreatmentPlan, createVisit } from '../../ClientServices/apiService';
import { mapToDto, mapToCreateVisitDto } from '../../Utils/mappingUtils';
import { sortTreatmentPlan } from '../../Utils/helpers';
import deleteIcon from '../../assets/delete-x.svg';
import dragIcon from '../../assets/drag-icon.svg';

// Function to sort visits based on the order
//const sortedVisits = (visits) => {
//return visits.sort((a, b) => a.Order - b.Order); // Use the Order property directly from visit
//};


const TreatmentPlanConfiguration = ({ treatmentPlan, cdtCodes, onAddVisit, onUpdateVisitsInTreatmentPlan, onDeleteVisit }) => {
    const [allRows, setAllRows] = useState({});
    const [visitOrder, setVisitOrder] = useState([]);
    const [deletedRowIds, setDeletedRowIds] = useState([]);
    const [deletedVisitIds, setDeletedVisitIds] = useState([]);


    const createStaticRows = (visit, index) => ({
        id: `static-${visit.visitId}-${index}`,
        visitCdtCodeMapId: visit.visitCdtCodeMapId,
        description: visit.longDescription,
        selectedCdtCode: visit,
        extraRowInput: [
            visit.toothNumber,
            visit.code,
            visit.longDescription
        ]
    });

    const createDynamicRow = (visitId, initialRowId) => ({
        id: initialRowId,
        description: '',
        selectedCdtCode: null,
        extraRowInput: [
            treatmentPlan.toothNumber,
            <DropdownSearch
                key={initialRowId}
                cdtCodes={cdtCodes}
                selectedCode={''}
                onSelect={(selectedCode) => handleSelect(selectedCode, visitId, initialRowId)}
            />
        ]
    });

    useEffect(() => {
        const { sortedVisits, sortedCdtCodes } = sortTreatmentPlan(treatmentPlan);

        // Process sorted data to create rows for the UI
        const newAllRows = Object.keys(sortedCdtCodes).reduce((acc, visitId) => {
            const staticRows = sortedCdtCodes[visitId].map(createStaticRows);
            const initialRowId = `initial-${visitId}`;
            const dynamicRows = [createDynamicRow(visitId, initialRowId)];

            acc[visitId] = [...staticRows, ...dynamicRows];
            return acc;
        }, {});

        setAllRows(newAllRows);
        setVisitOrder(sortedVisits.map(visit => visit.visitId));
    }, [treatmentPlan, cdtCodes]);

    const handleSelect = (selectedCode, visitId, rowId) => {
        // Lookup the CDT code object by its code value
        const cdtCodeObj = cdtCodes.find(cdtCode => cdtCode.code === selectedCode.value);

        setAllRows(prevRows => ({
            ...prevRows,
            [visitId]: prevRows[visitId].map(row =>
                row.id === rowId ? {
                    ...row,
                    selectedCdtCode: cdtCodeObj, // Update with the ID of the selected code
                    description: selectedCode.longDescription
                } : row
            )
        }));
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        if (result.type === "row") {
            const tableId = result.source.droppableId.replace('droppable-table-', '');
            const rows = allRows[tableId]; // Use the extracted tableId to access the rows

            if (!rows) {
                return;
            }

            const reorderedRows = reorder(
                rows,
                result.source.index,
                result.destination.index
            );

            setAllRows(prevRows => ({
                ...prevRows,
                [tableId]: reorderedRows
            }));
        }
    };

    const onTableDragEnd = (result) => {
        if (!result.destination || result.type !== "table") {
            return;
        }
        const newOrder = reorder(
            visitOrder,
            result.source.index,
            result.destination.index
        );
        setVisitOrder(newOrder);
    };

    const handleDeleteRow = (visitId, rowId) => {
        console.log("Deleting row:", rowId, "from visit:", visitId);
        setAllRows(prevRows => {
            console.log("Current rows before deletion:", prevRows);
            const updatedRows = prevRows[visitId].filter(row => row.id !== rowId);
            console.log("Updated rows after deletion:", updatedRows);
            return { ...prevRows, [visitId]: updatedRows };
        });
        setDeletedRowIds(prevIds => [...prevIds, rowId]);
    };

    const handleAddProcedure = (visitId) => {
        setAllRows(prevRows => {
            const newRowId = `dynamic-${visitId}-${Date.now()}`;
            const newRow = {
                id: newRowId,
                description: '',
                extraRowInput: [
                    treatmentPlan.toothNumber,
                    <DropdownSearch
                        key={newRowId}
                        cdtCodes={cdtCodes}
                        onSelect={(description) => handleSelect(description, visitId, newRowId)}
                    />
                ]
            };
            return {
                ...prevRows,
                [visitId]: [...(prevRows[visitId] || []), newRow]
            };
        });
    };

    const handleAddVisit = () => {
        const tempVisitId = `temp-${Date.now()}`;
        const initialRowId = `initial-${tempVisitId}`;

        const newVisit = {
            visitId: tempVisitId, // Use the temporary ID as a placeholder
            treatment_plan_id: treatmentPlan.treatmentPlanId,
            visit_number: treatmentPlan.visits.length,
            description: "Visit " + (treatmentPlan.visits.length)
        };
        console.log('Adding new visit:', newVisit);

        // update the parent component's state
        onAddVisit(newVisit);

        // Add a new dynamic row for the visit
        const newRow = createDynamicRow(tempVisitId, initialRowId);

        // Update visitOrder and allRows
        setVisitOrder(prevOrder => [...prevOrder, tempVisitId]);
        setAllRows(prevRows => ({
            ...prevRows,
            [tempVisitId]: [newRow]
        }));
    };

    const handleDeleteVisit = (visitId) => {
        // Update the visitOrder to remove the visit
        setVisitOrder(prevOrder => prevOrder.filter(id => id !== visitId));
        // Update allRows to remove the rows associated with the visit
        setAllRows(prevRows => {
            const updatedRows = { ...prevRows };
            delete updatedRows[visitId];
            return updatedRows;
        });
        setDeletedVisitIds(prevIds => [...prevIds, visitId]);
        onDeleteVisit(treatmentPlan.treatmentPlanId, visitId);
    };

    const handleUpdateTreatmentPlan = async () => {
        try {
            // Identify new visits
            const tempVisitIds = visitOrder.filter(visitId => String(visitId).startsWith('temp-'));

            // Create new visits and store the responses
            const createVisitPromises = tempVisitIds.map(tempVisitId => {
                const visitData = mapToCreateVisitDto(treatmentPlan, allRows, tempVisitId);
                return createVisit(visitData, tempVisitId);
            });

            const createdVisits = await Promise.all(createVisitPromises);

            // Create a mapping from tempVisitId to actualVisitId
            const visitIdMap = createdVisits.reduce((acc, visitResponse) => {
                const actualVisitId = visitResponse.visit.visitId; // Accessing visitId from the visit object
                const tempId = visitResponse.tempVisitId; // Accessing the tempVisitId

                acc[tempId] = actualVisitId; // Mapping the temp ID to the actual visit ID
                return acc;
            }, {});

            const updatedVisitOrder = visitOrder.map(visitId =>
                visitIdMap[visitId] ? visitIdMap[visitId] : visitId
            );

            const updatedVisits = treatmentPlan.visits.map(visit => {
                const actualVisitId = visitIdMap[visit.visitId] || visit.visitId;
                return { ...visit, visitId: actualVisitId };
            });

            if (typeof onUpdateVisitsInTreatmentPlan === 'function') {
                const orderedUpdatedVisits = updatedVisitOrder.map(visitId =>
                    updatedVisits.find(v => v.visitId === visitId)
                );
                onUpdateVisitsInTreatmentPlan(treatmentPlan.treatmentPlanId, orderedUpdatedVisits);
            }
            console.log("Updated visit order being sent to parent:", updatedVisitOrder);
            const updatedAllRows = { ...allRows };
            Object.keys(updatedAllRows).forEach(tempVisitId => {
                const actualVisitId = visitIdMap[tempVisitId];

                if (actualVisitId) {
                    // Replace the tempVisitId key with actualVisitId key in allRows
                    updatedAllRows[actualVisitId] = updatedAllRows[tempVisitId];
                    delete updatedAllRows[tempVisitId];
                }
            });

            setVisitOrder(updatedVisitOrder);
            setAllRows(updatedAllRows);

            // Now we update the treatment plan
            const updateDto = mapToDto(treatmentPlan, updatedAllRows, updatedVisitOrder, deletedRowIds, deletedVisitIds);
            console.log('Update DTO:', updateDto);
            const updatedTreatmentPlan = await updateTreatmentPlan(treatmentPlan.treatmentPlanId, updateDto);
            console.log('Updated Treatment Plan:', updatedTreatmentPlan);
        } catch (error) {
            console.error('Error updating treatment plan:', error);
        }
    };

    return (
        <>
            {treatmentPlan && (
                <DragDropContext onDragEnd={(result) => result.type === "table" ? onTableDragEnd(result) : onDragEnd(result)}>
                    <Droppable droppableId="visits-droppable" type="table" direction="vertical">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="table-container">
                                {visitOrder.map((visitId, index) => {
                                    // Convert visitId to string for safe comparison
                                    const visitIdStr = String(visitId);
                                    const isTempVisit = visitIdStr.startsWith('temp-');

                                    const visit = isTempVisit ?
                                        { visitId: visitIdStr, visit_number: index + 1 } :
                                        treatmentPlan.visits.find(v => String(v.visitId) === visitIdStr);

                                    const draggableKey = isTempVisit ? `temp-visit-${index}` : `visit-${visit.visitId}`;

                                    const visitRows = allRows[visitIdStr] || [];

                                    let headers = [
                                        'Tooth #',
                                        'CDT Code',
                                        'Description'
                                    ];

                                    let tableRows = visitRows.map(row => {
                                        const rowData = {
                                            id: row.id,
                                            data: row.id.startsWith('static-') ? [
                                                row.extraRowInput[0], // Tooth number
                                                row.extraRowInput[1], // CDT code
                                                row.extraRowInput[2]  // Description
                                            ] : [
                                                '',
                                                <DropdownSearch
                                                    key={row.id}
                                                    cdtCodes={cdtCodes}
                                                    selectedCode={row.selectedCdtCode}
                                                    onSelect={(selectedCode) => handleSelect(selectedCode, visit.visitId, row.id)}
                                                />,
                                                row.description
                                            ]
                                        };

                                        return rowData;
                                    });

                                    if (tableRows.length > 0) {
                                        const lastRowIndex = tableRows.length - 1;
                                        const lastRow = tableRows[lastRowIndex];
                                        const updatedLastCell = (
                                            <div className="dynamic-table-bottom-row">
                                                {lastRow.data[2] || <span></span>}
                                                <button onClick={() => handleAddProcedure(visit.visitId)}>Add Procedure</button>
                                            </div>
                                        );
                                        tableRows[lastRowIndex] = { ...lastRow, data: [lastRow.data[0], lastRow.data[1], updatedLastCell] };
                                    }

                                    return (
                                        <Draggable key={draggableKey} draggableId={`visit-${visit.visitId}`} index={index} type="table">
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} className={`visit-section ${index > 0 ? 'visit-separator' : ''}`}>
                                                    <div {...provided.dragHandleProps} className="visit-header">
                                                        Visit {index + 1} 
                                                    </div>
                                                    <Table
                                                        headers={headers}
                                                        rows={tableRows}
                                                        onDragEnd={onDragEnd}
                                                        tableId={`table-${visit.visitId}`}
                                                        enableDragDrop={true}
                                                        deleteImageIconSrc={deleteIcon}
                                                        deleteImageIconSrcHeader={deleteIcon}
                                                        dragImageIconSrc={dragIcon}
                                                        onDeleteRow={(rowId) => handleDeleteRow(visit.visitId, rowId)}
                                                        onDeleteVisit={() => handleDeleteVisit(visit.visitId)}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
            <div className="bottom-tx-plan-buttons">
                <div className="add-visit-btn-container" onClick={handleAddVisit}>
                    + Add Visit
                </div>
                <span onClick={handleUpdateTreatmentPlan} className="save-treatment-plan-text-btn" >
                    Save
                </span>
            </div>
        </>
    );
};


TreatmentPlanConfiguration.propTypes = {
    treatmentPlan: PropTypes.shape({
        description: PropTypes.string,
        toothNumber: PropTypes.number,
        visits: PropTypes.arrayOf(PropTypes.shape({
            visitId: PropTypes.number.isRequired,
            description: PropTypes.string,
            cdtCodes: PropTypes.arrayOf(PropTypes.shape({
                code: PropTypes.string.isRequired,
                longDescription: PropTypes.string
            })).isRequired
        })).isRequired
    }),
    includeExtraRow: PropTypes.bool,
    cdtCodes: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string.isRequired,
        longDescription: PropTypes.string
    })).isRequired,
    imageIconSrc: PropTypes.string,
    hideToothNumber: PropTypes.bool
};

TreatmentPlanConfiguration.defaultProps = {
    includeExtraRow: false,
    imageIconSrc: false,
};

export default TreatmentPlanConfiguration;