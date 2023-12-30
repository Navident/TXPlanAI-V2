import PropTypes from 'prop-types';
import './TreatmentPlanConfiguration.css';
import Table from "../Table/Table";
import { useState, useEffect, useRef } from 'react';
import DropdownSearch from "../DropdownSearch/DropdownSearch";
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import { updateTreatmentPlan, createVisit, createNewProcedures } from '../../ClientServices/apiService';
import { mapToDto, mapToCreateVisitDto } from '../../Utils/mappingUtils';
import { sortTreatmentPlan } from '../../Utils/helpers';
import deleteIcon from '../../assets/delete-x.svg';
import dragIcon from '../../assets/drag-icon.svg';

// Function to sort visits based on the order
//const sortedVisits = (visits) => {
//return visits.sort((a, b) => a.Order - b.Order); // Use the Order property directly from visit
//};


const TreatmentPlanConfiguration = ({ treatmentPlan, cdtCodes, onAddVisit, onUpdateVisitsInTreatmentPlan, onDeleteVisit, showToothNumber }) => {
    const [allRows, setAllRows] = useState({});
    const [visitOrder, setVisitOrder] = useState([]);
    const [deletedRowIds, setDeletedRowIds] = useState([]);
    const [deletedVisitIds, setDeletedVisitIds] = useState([]);
    const isInitialLoad = useRef(true);
    const [localUpdatedVisits, setLocalUpdatedVisits] = useState([]);

    const createStaticRows = (visit, index) => {
        const extraRowInput = showToothNumber
            ? [treatmentPlan.toothNumber, visit.code, visit.longDescription]
            : [visit.code, visit.longDescription];

        return {
            id: `static-${visit.visitId}-${index}`,
            visitCdtCodeMapId: visit.visitCdtCodeMapId,
            description: visit.longDescription,
            selectedCdtCode: visit,
            extraRowInput
        };
    };

    const createDynamicRow = (visitId, initialRowId) => {
        const extraRowInput = showToothNumber
            ? [
                treatmentPlan.toothNumber,
                <DropdownSearch
                    key={initialRowId}
                    cdtCodes={cdtCodes}
                    selectedCode={''}
                    onSelect={(selectedCode) => handleSelect(selectedCode, visitId, initialRowId)}
                />
            ]
            : [
                <DropdownSearch
                    key={initialRowId}
                    cdtCodes={cdtCodes}
                    selectedCode={''}
                    onSelect={(selectedCode) => handleSelect(selectedCode, visitId, initialRowId)}
                />
            ];

        return {
            id: initialRowId,
            description: '',
            selectedCdtCode: null,
            extraRowInput
        };
    };

    useEffect(() => {
        if (isInitialLoad.current) {
            console.log('Initial treatmentPlan:', treatmentPlan);
            const { sortedVisits, sortedCdtCodes } = sortTreatmentPlan(treatmentPlan);

            const newAllRows = Object.keys(sortedCdtCodes).reduce((acc, visitId) => {
                const staticRows = sortedCdtCodes[visitId].map(createStaticRows);
                const initialRowId = `initial-${visitId}`;
                acc[visitId] = [...staticRows, createDynamicRow(visitId, initialRowId)];
                return acc;
            }, {});

            setAllRows(newAllRows);
            setVisitOrder(sortedVisits.map(visit => visit.visitId));
            isInitialLoad.current = false; // Set the flag to false after initial setup
        }
    }, [treatmentPlan, cdtCodes]);

    useEffect(() => {
        setLocalUpdatedVisits(treatmentPlan.visits);
    }, [treatmentPlan.visits]);


    const handleSelect = (selectedCode, visitId, rowId) => {
        const cdtCodeObj = cdtCodes.find(cdtCode => cdtCode.code === selectedCode.value);

        setAllRows(prevRows => {
            let rows = [...prevRows[visitId]];
            let rowIndex = rows.findIndex(row => row.id === rowId);

            if (rowIndex !== -1) {
                // Convert the current dynamic row to a static row
                rows[rowIndex] = {
                    ...rows[rowIndex],
                    id: `static-${visitId}-${Date.now()}`,
                    visitCdtCodeMapId: null, // i may need to change this later
                    description: selectedCode.longDescription,
                    selectedCdtCode: cdtCodeObj,
                    extraRowInput: showToothNumber
                        ? [treatmentPlan.toothNumber, cdtCodeObj.code, cdtCodeObj.longDescription]
                        : [cdtCodeObj.code, cdtCodeObj.longDescription]
                };

                // Add a new dynamic row at the end if the selected row was the last dynamic row
                if (rowIndex === rows.length - 1) {
                    const newRowId = `dynamic-${visitId}-${Date.now()}`;
                    const newRow = createDynamicRow(visitId, newRowId);
                    rows.push(newRow);
                }
            }

            return {
                ...prevRows,
                [visitId]: rows
            };
        });
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
            const rows = allRows[tableId]; 

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

    const reorderAllRows = (newVisitOrder) => {
        const reorderedRows = {};
        newVisitOrder.forEach(visitId => {
            if (allRows[visitId]) {
                reorderedRows[visitId] = allRows[visitId];
            }
        });
        setAllRows(reorderedRows);
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

        // Update visit order
        setVisitOrder(newOrder);

        // Update visitNumber for each visit
        const updatedVisits = treatmentPlan.visits.map(visit => {
            const newOrderIndex = newOrder.indexOf(visit.visitId);
            return { ...visit, visitNumber: newOrderIndex + 1 }; 
        });

        // Update parent component's state
        onUpdateVisitsInTreatmentPlan(treatmentPlan.treatmentPlanId, updatedVisits);

        reorderAllRows(newOrder);
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
        console.log(`Adding new procedure to visitId: ${visitId}`);
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
            console.log("New row being added:", newRow);
            const newRows = {
                ...prevRows,
                [visitId]: [...(prevRows[visitId] || []), newRow]
            };
            console.log("All rows after adding new procedure:", newRows);
            return newRows;
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
        setDeletedVisitIds(prevIds => {
            const newDeletedVisitIds = [...prevIds, visitId];
            console.log("Deleted visit added, new deletedVisitIds:", newDeletedVisitIds);
            return newDeletedVisitIds;
        });
        onDeleteVisit(treatmentPlan.treatmentPlanId, visitId);
    };

    const handleUpdateTreatmentPlan = async () => {
        console.log("Updating treatment plan with current state of allRows:", allRows);
        console.log("Current visit order:", visitOrder);
        try {
            // Identify new visits
            const tempVisitIds = visitOrder.filter(visitId => String(visitId).startsWith('temp-'));

            // Create new visits and store the responses
            const createVisitPromises = tempVisitIds.map(tempVisitId => {
                const visitData = mapToCreateVisitDto(treatmentPlan, allRows, tempVisitId);
                return createVisit(visitData, tempVisitId);
            });

            const createdVisits = await Promise.all(createVisitPromises);
            const visitIdMap = createdVisits.reduce((acc, visitResponse) => {
                acc[visitResponse.tempVisitId] = visitResponse.visit.visitId;
                return acc;
            }, {});

            // Deep copy 
            const deepCopyAllRows = JSON.parse(JSON.stringify(allRows));
            // Update allRows with actualVisitIds
            Object.keys(deepCopyAllRows).forEach(visitId => {
                if (visitIdMap[visitId]) {
                    deepCopyAllRows[visitIdMap[visitId]] = deepCopyAllRows[visitId];
                    delete deepCopyAllRows[visitId];
                }
            });

            // Update the state
            setAllRows(deepCopyAllRows);

            // Identify new procedures and associate them with actualVisitIds
            const newProcedures = [];
            Object.keys(deepCopyAllRows).forEach(visitId => {
                deepCopyAllRows[visitId].forEach(row => {
                    if (!row.visitCdtCodeMapId && row.selectedCdtCode) {
                        newProcedures.push({
                            visitId: visitId, // Now using the actual visit ID
                            CdtCodeId: row.selectedCdtCode.cdtCodeId,
                            Order: 0
                        });
                    }
                });
            });

            // Send new procedures to backend and process the response
            const newProcedureResponse = await createNewProcedures(newProcedures);
            console.log("newProcedureResponse: ", newProcedureResponse);
            newProcedureResponse.forEach(proc => {
                const { visitId, visitCdtCodeMapId, cdtCodeId } = proc;
                console.log("Current visitId:", visitId);
                console.log("allRows keys:", Object.keys(deepCopyAllRows));
                const rows = deepCopyAllRows[visitId]; 
                if (!rows) {
                    console.error(`No rows found for visitId: ${visitId}`);
                    return; // Skip further processing for this visitId
                }
                const rowIndex = rows.findIndex(row => row.selectedCdtCode && row.selectedCdtCode.cdtCodeId === cdtCodeId);
                if (rowIndex > -1) {
                    rows[rowIndex].visitCdtCodeMapId = visitCdtCodeMapId;
                }
            });

            // Update the visit order with actualVisitIds
            const updatedVisitOrder = visitOrder.map(visitId => visitIdMap[visitId] || visitId);

            // Update the treatment plan visits
            const updatedVisits = treatmentPlan.visits.map(visit => {
                const actualVisitId = visitIdMap[visit.visitId] || visit.visitId;
                const updatedProcedures = deepCopyAllRows[actualVisitId]
                    ? deepCopyAllRows[actualVisitId]
                        .filter(row => row.selectedCdtCode !== null)
                        .map(row => {
                            return {
                                visitCdtCodeMapId: row.visitCdtCodeMapId,
                                cdtCodeId: row.selectedCdtCode.cdtCodeId,
                                description: row.description,
                                // ...additional properties possibly later
                            };
                        })
                    : visit.procedures;

                return { ...visit, visitId: actualVisitId, procedures: updatedProcedures };
            });

            // Update local state for immediate reflection in the UI
            setLocalUpdatedVisits(updatedVisits);
            console.log("Updated visits being sent to parent:", updatedVisits);

            // Update allRows and visitOrder in state
            setVisitOrder(updatedVisitOrder);
            setAllRows(deepCopyAllRows);

            // update the treatment plan
            const updateDto = mapToDto(treatmentPlan, deepCopyAllRows, updatedVisitOrder, deletedRowIds, deletedVisitIds);
            const updatedTreatmentPlan = await updateTreatmentPlan(treatmentPlan.treatmentPlanId, updateDto);

            // Call parent's callback with the updated treatment plan data
            onUpdateVisitsInTreatmentPlan(treatmentPlan.treatmentPlanId, updatedVisits);
            console.log('Updated Treatment Plan:', updatedTreatmentPlan);

        } catch (error) {
            console.error('Error updating treatment plan:', error);
        }
    };


    const lockDimensions = () => {
        
        const tables = document.querySelectorAll('.tx-table');
        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td, th');
                cells.forEach(cell => {
                    const computedStyle = window.getComputedStyle(cell);
                    cell.style.width = `${computedStyle.width}`;
                    cell.style.minWidth = `${computedStyle.width}`;
                });
            });
        });
    };

    return (
        <>
            {treatmentPlan && (
                <DragDropContext
                    onDragEnd={(result) => result.type === "table" ? onTableDragEnd(result) : onDragEnd(result)}
                    onBeforeDragStart={lockDimensions}
                >
                    <Droppable droppableId="visits-droppable" type="table" direction="vertical">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="table-container">
                                {console.log("Current visitOrder:", visitOrder)}
                                {console.log("Current treatmentPlan.visits:", treatmentPlan.visits)}
                                {visitOrder.map((visitId, index) => {

                                    const visitIdStr = String(visitId);
                                    const isTempVisit = visitIdStr.startsWith('temp-');

                                    // Use localUpdatedVisits here
                                    const visit = isTempVisit ?
                                        { visitId: visitIdStr, visit_number: index + 1 } :
                                        localUpdatedVisits.find(v => String(v.visitId) === visitIdStr);

                                    if (!visit) {
                                        console.error("Visit not found for ID:", visitIdStr);
                                        return null; 
                                    }

                                    const draggableKey = isTempVisit ? `temp-visit-${index}` : `visit-${visit.visitId}`;

                                    const visitRows = allRows[visitIdStr] || [];

                                    let headers = showToothNumber
                                        ? ['Tooth #', 'CDT Code', 'Description']
                                        : ['', 'CDT Code', 'Description'];

                                    let tableRows = visitRows.map(row => {
                                        let baseRowData;

                                        if (row.id.startsWith('static-')) {
                                            if (showToothNumber) {
                                                // For static rows with Tooth number
                                                baseRowData = [
                                                    row.extraRowInput[0], // Tooth number
                                                    row.extraRowInput[1], // CDT code
                                                    row.extraRowInput[2]  // Description
                                                ];
                                            } else {
                                                // For static rows without Tooth number, add placeholder
                                                baseRowData = [
                                                    '', // Placeholder for Tooth number
                                                    row.extraRowInput[0], // CDT code (shifted left)
                                                    row.extraRowInput[1]  // Description (shifted left)
                                                ];
                                            }
                                        } else {
                                            if (showToothNumber) {
                                                baseRowData = [
                                                    '', // Placeholder for the "Tooth #" column
                                                    <DropdownSearch
                                                        key={row.id}
                                                        cdtCodes={cdtCodes}
                                                        selectedCode={row.selectedCdtCode}
                                                        onSelect={(selectedCode) => handleSelect(selectedCode, visit.visitId, row.id)}
                                                    />,
                                                    row.description
                                                ];
                                            } else {
                                                const dropdownKey = `dropdown-${row.id}`;
                                                baseRowData = [
                                                    '', // Placeholder for Tooth number
                                                    <DropdownSearch
                                                        key={dropdownKey}
                                                        cdtCodes={cdtCodes}
                                                        selectedCode={row.selectedCdtCode}
                                                        onSelect={(selectedCode) => handleSelect(selectedCode, visit.visitId, row.id)}
                                                    />,
                                                    row.description
                                                ];
                                            }
                                        }

                                        // Ensure number of data cells matches the number of headers
                                        if (baseRowData.length < headers.length - 1) { // -1 to exclude the delete icon column
                                            baseRowData.push(''); // Add an extra cell if needed
                                        }

                                        const isDynamicRow = !row.id.startsWith('static-'); // dynamic rows do not start with 'static-'

                                        const deleteIconCell = (index !== visitRows.length - 1) ? (
                                            <img src={deleteIcon} className="delete-icon" alt="Delete Icon" onClick={() => handleDeleteRow(visit.visitId, row.id)} />
                                        ) : null;

                                        return {
                                            id: row.id,
                                            data: baseRowData,
                                            deleteIconCell,
                                            isDynamic: isDynamicRow // Add this line
                                        };
                                    });


                                    if (tableRows.length > 0) {
                                        const lastRowIndex = tableRows.length - 1;
                                        const lastRow = tableRows[lastRowIndex];

                                        const updatedLastCell = lastRow.data[2] || <span></span>;
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