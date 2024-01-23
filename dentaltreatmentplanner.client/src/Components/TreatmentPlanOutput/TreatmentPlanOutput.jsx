import PropTypes from 'prop-types';
import './TreatmentPlanOutput.css';
import Table from "../Table/Table";
import { useState, useEffect, useRef } from 'react';
import DropdownSearch from "../Common/DropdownSearch/DropdownSearch";
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import { updateTreatmentPlan, createVisit, createNewProcedures, handleCreateNewTreatmentPlanFromDefault, handleCreateNewCombinedTreatmentPlanForPatient } from '../../ClientServices/apiService';
import { mapToUpdateTreatmentPlanDto, mapToCreateVisitDto } from '../../Utils/mappingUtils';
import {sortTreatmentPlanWithPhases } from '../../Utils/helpers';
import deleteIcon from '../../assets/delete-x.svg';
import dragIcon from '../../assets/drag-icon.svg';
import Alert from '../Common/Alert/Alert';
import { useBusiness } from '../../Contexts/BusinessContext/useBusiness';
import { useContext } from 'react';
import TreatmentPlanContext from '../../Contexts/TreatmentPlanContext/TreatmentPlanContext';

const TreatmentPlanOutput = ({ treatmentPlan, treatmentPlans, onAddVisit, onUpdateVisitsInTreatmentPlan, onDeleteVisit, showToothNumber, isInGenerateTreatmentPlanContext }) => {
    const [allRows, setAllRows] = useState({});
    const [visitOrder, setVisitOrder] = useState([]);
    const [deletedRowIds, setDeletedRowIds] = useState([]);
    const [deletedVisitIds, setDeletedVisitIds] = useState([]);
    const isInitialLoad = useRef(true);
    const [localUpdatedVisits, setLocalUpdatedVisits] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ open: false, type: '', message: '' });
    const [combinedVisits, setCombinedVisits] = useState([]);
    const { cdtCodes } = useContext(TreatmentPlanContext);

    const { selectedPatient } = useBusiness();
    const {
        treatmentPhases,
    } = useBusiness();

    const handleCloseAlert = () => {
        setAlertInfo({ ...alertInfo, open: false });
    };

    useEffect(() => {
        let visits = [];
        // Extract visits from all phases
        Object.values(treatmentPlan.phases).forEach(phaseVisits => {
            visits = visits.concat(phaseVisits);
        });

        console.log('Extracted visits:', visits);
        setCombinedVisits(visits);

    }, [treatmentPlan]); 

    useEffect(() => {
        if (isInitialLoad.current) {
            console.log('Initial treatmentPlan:', treatmentPlan);

            const { sortedVisits, sortedCdtCodes } = sortTreatmentPlanWithPhases(treatmentPlan);
            sortedVisits.forEach(visit => {
                console.log(`Tooth numbers in sorted visit ${visit.uniqueId}:`, visit.cdtCodes.map(c => c.toothNumber));
            });
            console.log("sortedCdtCodes", sortedCdtCodes);
            const newAllRows = Object.keys(sortedCdtCodes).reduce((acc, uniqueId) => {
                console.log('Processing uniqueId in sortedCdtCodes:', uniqueId);

                const staticRows = sortedCdtCodes[uniqueId].map(createStaticRows);
                console.log(`Static rows for uniqueId ${uniqueId}:`, staticRows);

                const initialRowId = `initial-${uniqueId}`;
                acc[uniqueId] = [...staticRows, createDynamicRow(uniqueId, initialRowId)];
                console.log(`Accumulated rows for uniqueId ${uniqueId}:`, acc[uniqueId]);

                return acc;
            }, {});

            console.log('New allRows:', newAllRows);

            setAllRows(newAllRows);
            setVisitOrder(sortedVisits.map(visit => visit.uniqueId));
            console.log('Visit order:', sortedVisits.map(visit => visit.uniqueId));

            isInitialLoad.current = false;
        }
    }, [treatmentPlan, cdtCodes]);





    useEffect(() => {
        setLocalUpdatedVisits(treatmentPlan.visits);
    }, [treatmentPlan.visits]);


    const createStaticRows = (visitCdtCodeMap, index) => {
        console.log(`Creating static row for uniqueId ${visitCdtCodeMap.uniqueId}:`, visitCdtCodeMap);

        const extraRowInput = showToothNumber
            ? [visitCdtCodeMap.toothNumber, visitCdtCodeMap.code, visitCdtCodeMap.longDescription]
            : [visitCdtCodeMap.code, visitCdtCodeMap.longDescription];

        return {
            id: `static-${visitCdtCodeMap.uniqueId}-${index}`,  // Using uniqueId here
            visitCdtCodeMapId: visitCdtCodeMap.visitCdtCodeMapId,
            description: visitCdtCodeMap.longDescription,
            selectedCdtCode: visitCdtCodeMap,
            selectedTreatmentPhase: {
                label: visitCdtCodeMap.treatmentPhaseLabel || "No Treatment Phase",
                id: visitCdtCodeMap.treatmentPhaseId
            },
            extraRowInput
        };
    };




    const createTreatmentPhaseDropdown = (visitId, rowId, treatmentPhases) => {
        return (
            <DropdownSearch
                key={`${rowId}-treatment-phase`}
                items={treatmentPhases}
                selectedItem={''}
                onSelect={(selectedPhase) => handleSelect(selectedPhase, visitId, rowId)}
                itemLabelFormatter={(phase) => phase.label}
            />
        );
    };

    const createCDTCodeDropdown = (rowId, visitId, cdtCodes, handleSelect, selectedCdtCode) => {
        const cdtCodeOptions = cdtCodes.map(code => ({
            id: code.code,
            ...code
        }));

        return (
            <DropdownSearch
                key={rowId}
                items={cdtCodeOptions}
                selectedItem={selectedCdtCode}
                onSelect={(selectedCode) => handleSelect(selectedCode, visitId, rowId)}
                itemLabelFormatter={(cdtCode) => `${cdtCode.code} - ${cdtCode.longDescription}`}
            />
        );
    };


    const createDynamicRow = (visitId, initialRowId) => {
        const dropdownSearchElement = createCDTCodeDropdown(initialRowId, visitId, cdtCodes, handleSelect);

        let treatmentPhaseDropdown = null;
        if (!isInGenerateTreatmentPlanContext) {
            treatmentPhaseDropdown = createTreatmentPhaseDropdown(visitId, initialRowId, treatmentPhases);
        }

        const extraRowInput = showToothNumber
            ? [treatmentPlan.toothNumber, dropdownSearchElement, treatmentPhaseDropdown]
            : [dropdownSearchElement, treatmentPhaseDropdown];

        return {
            id: initialRowId,
            description: '',
            selectedCdtCode: null,
            extraRowInput
        };
    };

    const convertToStaticRow = (currentRow, visitId, selectedTreatmentPhase, selectedCdtCode) => {
        const description = selectedCdtCode ? selectedCdtCode.longDescription : currentRow.description;

        return {
            ...currentRow,
            id: `static-${visitId}-${Date.now()}`,
            visitCdtCodeMapId: null,
            selectedCdtCode: selectedCdtCode || currentRow.selectedCdtCode,
            selectedTreatmentPhase: selectedTreatmentPhase || currentRow.selectedTreatmentPhase,
            extraRowInput: showToothNumber
                ? [
                    treatmentPlan.toothNumber,
                    selectedCdtCode ? selectedCdtCode.code : currentRow.selectedCdtCode?.code,
                    description,
                    selectedTreatmentPhase ? selectedTreatmentPhase.label : currentRow.selectedTreatmentPhase?.label
                ]
                : [
                    selectedCdtCode ? selectedCdtCode.code : currentRow.selectedCdtCode?.code,
                    description,
                    selectedTreatmentPhase ? selectedTreatmentPhase.label : currentRow.selectedTreatmentPhase?.label
                ]
        };
    };



    const handleTreatmentPhaseSelect = (selectedPhase, visitId, rowId) => {
        const treatmentPhaseObj = treatmentPhases.find(phase => phase.id === selectedPhase.value);

        setAllRows(prevRows => {
            let rows = [...prevRows[visitId]];
            let rowIndex = rows.findIndex(row => row.id === rowId);

            if (rowIndex !== -1) {
                const currentRow = rows[rowIndex];

                // Update the row with the selected treatment phase
                rows[rowIndex] = {
                    ...currentRow,
                    selectedTreatmentPhase: treatmentPhaseObj,
                };

                // Check if both CDT code and treatment phase are selected then convert to static row
                if (currentRow.selectedCdtCode && rowIndex === rows.length - 1) {
                    rows[rowIndex] = convertToStaticRow(currentRow, visitId, treatmentPhaseObj, null);

                    // Add a new dynamic row at the end
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


    const handleSelect = (selectedCode, visitId, rowId) => {
        const cdtCodeObj = cdtCodes.find(cdtCode => cdtCode.code === selectedCode.value);

        setAllRows(prevRows => {
            let rows = [...prevRows[visitId]];
            let rowIndex = rows.findIndex(row => row.id === rowId);

            if (rowIndex !== -1) {
                const currentRow = rows[rowIndex];

                // Update the current dynamic row with the selected CDT code
                rows[rowIndex] = {
                    ...currentRow,
                    selectedCdtCode: cdtCodeObj,
                    description: cdtCodeObj.longDescription
                };

                // Check if both CDT code and treatment phase are selected, then convert to static row
                if (!isInGenerateTreatmentPlanContext && currentRow.selectedTreatmentPhase && rowIndex === rows.length - 1) {
                    rows[rowIndex] = convertToStaticRow(currentRow, visitId, null, cdtCodeObj);

                    // Add a new dynamic row at the end
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


    const handleAddVisit = () => {
        const tempVisitId = `temp-${Date.now()}`;
        const initialRowId = `initial-${tempVisitId}`;

        const newVisit = {
            visitId: tempVisitId,
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

    const createNewTreatmentPlanFromDefault = async (treatmentPlan, allRows, visitOrder) => {
        try {
            const newTreatmentPlan = await handleCreateNewTreatmentPlanFromDefault(treatmentPlan, allRows, visitOrder);
            // Show success alert
            setAlertInfo({ open: true, type: 'success', message: 'Your changes have been saved successfully!' });
            return newTreatmentPlan;
        } catch (error) {
            console.error('Error in creating new treatment plan:', error);
        }
    };

    const createNewCombinedTreatmentPlanForPatient = async (treatmentPlan, allRows, visitOrder) => {
        try {
            const newTreatmentPlan = await handleCreateNewCombinedTreatmentPlanForPatient(treatmentPlan, allRows, visitOrder, selectedPatient.patientId);
            // Show success alert
            setAlertInfo({ open: true, type: 'success', message: 'Your changes have been saved successfully!' });
            return newTreatmentPlan;
        } catch (error) {
            console.error('Error in creating new treatment plan:', error);
        }
    };


    const handleUpdateTreatmentPlan = async () => {
        try {

            const newCombinedTreatmentPlan = await createNewCombinedTreatmentPlanForPatient(treatmentPlan, allRows, visitOrder);

            const tempVisitIds = visitOrder.filter(visitId => String(visitId).startsWith('temp-'));
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
                            visitId: visitId,
                            CdtCodeId: row.selectedCdtCode.cdtCodeId,
                            Order: 0
                        });
                    }
                });
            });

            // Send new procedures to backend and process the response
            const newProcedureResponse = await createNewProcedures(newProcedures);
            newProcedureResponse.forEach(proc => {
                const { visitId, visitCdtCodeMapId, cdtCodeId } = proc;
                const rows = deepCopyAllRows[visitId];
                if (!rows) {
                    return;
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

            // Update allRows and visitOrder in state
            setVisitOrder(updatedVisitOrder);
            setAllRows(deepCopyAllRows);

            // update the treatment plan
            const updateDto = mapToUpdateTreatmentPlanDto(treatmentPlan, deepCopyAllRows, updatedVisitOrder, deletedRowIds, deletedVisitIds);
            const updatedTreatmentPlan = await updateTreatmentPlan(treatmentPlan.treatmentPlanId, updateDto);

            onUpdateVisitsInTreatmentPlan(treatmentPlan.treatmentPlanId, updatedVisits);
            console.log('Updated Treatment Plan:', updatedTreatmentPlan);

            setAlertInfo({ open: true, type: 'success', message: 'Your changes have been saved successfully!' });

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

    const createHeaders = () => {
        let headers = showToothNumber
            ? ['Tooth #', 'CDT Code', 'Description']
            : ['', 'CDT Code', 'Description'];

        return headers;
    };

    const constructStaticRowData = (row) => {
        let treatmentPhaseDisplay = row.selectedTreatmentPhase ? row.selectedTreatmentPhase.label : 'No Treatment Phase';

        if (showToothNumber) {
            if (!isInGenerateTreatmentPlanContext) {
                return [row.extraRowInput[0], row.extraRowInput[1], row.extraRowInput[2], treatmentPhaseDisplay];
            }
            return [row.extraRowInput[0], row.extraRowInput[1], row.extraRowInput[2]]; // Tooth number, CDT code, Description
        } else {
            if (!isInGenerateTreatmentPlanContext) {
                return ['', row.extraRowInput[0], row.extraRowInput[1], treatmentPhaseDisplay];
            }
            return ['', row.extraRowInput[0], row.extraRowInput[1]]; // Placeholder for Tooth number, CDT code, Description shifted
        }
    };

    const constructDynamicRowData = (row, visitId) => {
        const dropdownKey = `dropdown-${row.id}`;
        const cdtDropdown = <DropdownSearch
            key={dropdownKey}
            items={cdtCodes}
            selectedItem={row.selectedCdtCode}
            onSelect={(selectedCode) => handleSelect(selectedCode, visitId, row.id)}
            itemLabelFormatter={(cdtCode) => `${cdtCode.code} - ${cdtCode.longDescription}`}
            valueKey="code"
            labelKey="longDescription"
        />;

        return showToothNumber
            ? ['', cdtDropdown, row.description]
            : ['', cdtDropdown, row.description];
    };

    const createDeleteIconCell = (row, visitId, index, visitRows) => {
        // Check if the row is static and not the last row
        const isStaticRow = row.id.startsWith('static-');
        const isNotLastRow = index !== visitRows.length - 1;

        return isStaticRow && isNotLastRow ? (
            <img
                src={deleteIcon}
                className="delete-icon"
                alt="Delete Icon"
                onClick={() => handleDeleteRow(visitId, row.id)}
            />
        ) : null;
    };



    const createTableRow = (row, visitId, headers, index, visitRows) => {
        let baseRowData = row.id.startsWith('static-')
            ? constructStaticRowData(row)
            : constructDynamicRowData(row, visitId);

        // Ensure number of data cells matches the number of headers
        while (baseRowData.length < headers.length) {
            baseRowData.push(''); // Add empty strings for missing cells
        }

        const deleteIconCell = createDeleteIconCell(row, visitId, index, visitRows);

        return {
            id: row.id,
            data: baseRowData,
            deleteIconCell
        };
    };

    const renderVisit = (visit, index) => {
        console.log(`Rendering visit with uniqueId ${visit.uniqueId}:`, visit);

        if (!visit) {
            console.log("No visit data available");
            return null;
        }

        const uniqueIdStr = visit.uniqueId;
        const draggableKey = `visit-${uniqueIdStr}`;
        const headers = createHeaders();

        if (!allRows[uniqueIdStr]) {
            console.log(`No rows found for uniqueId ${uniqueIdStr}`);
            return null;
        }

        const tableRows = allRows[uniqueIdStr].map((row, rowIndex) => {
            return createTableRow(row, uniqueIdStr, headers, rowIndex, allRows[uniqueIdStr]);
        });

        return (
            <Draggable key={draggableKey} draggableId={`visit-${uniqueIdStr}`} index={index} type="table">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className={`visit-section ${index > 0 ? 'visit-separator' : ''}`}>
                        <div {...provided.dragHandleProps} className="visit-header">
                            Visit {visit.visitNumber} 
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
    };

    return (
        <>
            {console.log("Treatment Plan in TreatmentPlanConfiguration:", treatmentPlan)}
            {alertInfo.type && (
                <Alert
                    open={alertInfo.open}
                    handleClose={handleCloseAlert}
                    type={alertInfo.type}
                    message={alertInfo.message}
                />
            )}
            {treatmentPlan && (
                <DragDropContext
                    onDragEnd={(result) => result.type === "table" ? onTableDragEnd(result) : onDragEnd(result)}
                    onBeforeDragStart={lockDimensions}
                >
                    <Droppable droppableId="visits-droppable" type="table" direction="vertical">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="table-container">
                                {Object.entries(treatmentPlan.phases).map(([phaseLabel, visits], phaseIndex) => {
                                    console.log(`Rendering phase: ${phaseLabel} with visits`, visits);
                                    return (
                                        <div key={`phase-${phaseIndex}`} className="treatment-plan-phase-section">
                                            <div className="phase-label">{phaseLabel}</div>
                                            {visits.map((visit, visitIndex) => renderVisit(visit, visitIndex))}
                                        </div>
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


TreatmentPlanOutput.propTypes = {
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

TreatmentPlanOutput.defaultProps = {
    includeExtraRow: false,
    imageIconSrc: false,
};

export default TreatmentPlanOutput;