import PropTypes from 'prop-types';
import './TreatmentPlanOutput.css';
import Table from "../Table/Table";
import { useState, useEffect } from 'react';
import DropdownSearch from "../DropdownSearch/DropdownSearch";
// Function to sort visits based on the order
//const sortedVisits = (visits) => {
//return visits.sort((a, b) => a.Order - b.Order); // Use the Order property directly from visit
//};

const TreatmentPlanOutput = ({ treatmentPlan, cdtCodes, useImageIconColumn, imageIconSrc, hideToothNumber }) => {
    const [additionalRows, setAdditionalRows] = useState({});

    // Initialize additionalRows for each visit with one initial row
    useEffect(() => {
        if (treatmentPlan && treatmentPlan.visits) {
            const initialRows = {};
            treatmentPlan.visits.forEach(visit => {
                const initialRowId = `initial-${visit.visitId}`;
                initialRows[visit.visitId] = [{
                    id: initialRowId,
                    description: '',
                    extraRowInput: (
                        <DropdownSearch
                            key={initialRowId}
                            cdtCodes={cdtCodes}
                            onSelect={(description) => handleSelect(description, visit.visitId, initialRowId)}
                        />
                    )
                }];
            });
            setAdditionalRows(initialRows);
        }
    }, [treatmentPlan, cdtCodes]);

    // This function updates the description for a specific additional row
    const handleSelect = (description, visitId, rowId) => {
        // Update the state for additional rows
        setAdditionalRows(prevRows => ({
            ...prevRows,
            [visitId]: prevRows[visitId].map(row =>
                row.id === rowId ? { ...row, description } : row
            )
        }));
    };

    // This function handles adding a new row to a specific visit
    const handleAddProcedure = (visitId) => {
        setAdditionalRows(prevRows => {
            const newRowId = Date.now(); // Unique identifier
            return {
                ...prevRows,
                [visitId]: [
                    ...(prevRows[visitId] || []),
                    {
                        id: newRowId,
                        description: '',
                        extraRowInput: (
                            <DropdownSearch
                                key={newRowId}
                                cdtCodes={cdtCodes}
                                onSelect={(description) => handleSelect(description, visitId, newRowId)}
                            />
                        )
                    }
                ]
            };
        });
    };
    const reorder = (list, startIndex, endIndex) => {
        console.log(`Reordering from ${startIndex} to ${endIndex}`);
        const result = Array.from(list);
        console.log("Initial array:", result);

        // Debugging: Logging the item expected to be removed
        console.log("Item to be removed:", result[startIndex]);

        const [removed] = result.splice(startIndex, 1);
        console.log("After removal:", result, "Removed item:", removed);

        result.splice(endIndex, 0, removed);
        console.log("After reinsertion:", result);

        return result;
    };



    const onDragEnd = (result, visitId) => {
        if (!result.destination) {
            return;
        }

        console.log("Source index:", result.source.index, "Destination index:", result.destination.index);

        console.log("Drag result:", result); // Logging the drag result
        console.log("Additional Rows before reorder:", additionalRows[visitId]); // Logging the state before reorder

        const newRows = reorder(
            additionalRows[visitId],
            result.source.index,
            result.destination.index
        );

        console.log("New Rows after reorder:", newRows); // Logging the state after reorder

        setAdditionalRows(prevRows => ({
            ...prevRows,
            [visitId]: newRows
        }));
    };


    return (
        <>
            {treatmentPlan && (
                <div className="table-container">
                    {treatmentPlan.visits.map((visit, visitIndex) => {
                        // Define the header for the first column based on the prop
                        const firstColumnHeader = useImageIconColumn ? <img src={imageIconSrc} className="drag-row-icon" alt="Icon" /> : (hideToothNumber ? '' : 'Tooth #');
                        let headers = [firstColumnHeader, 'CDT Code', 'Description'];

                        // Create row data, including the first column data based on the prop
                        let visitRows = [
                            ...visit.cdtCodes.map(cdtCode => ([
                                useImageIconColumn ? <img src={imageIconSrc} className="drag-row-icon" alt="Icon" /> : (hideToothNumber ? '' : treatmentPlan.toothNumber),
                                cdtCode.code,
                                cdtCode.longDescription
                            ])),
                            ...(additionalRows[visit.visitId] || []).map(row => ([
                                hideToothNumber ? '' : treatmentPlan.toothNumber,
                                row.extraRowInput,
                                row.description ? <span key={`desc-${row.id}`}>{row.description}</span> : ''
                            ]))
                        ];

                        // Modify the last cell of the last row to include the button
                        if (visitRows.length > 0) {
                            const lastRowIndex = visitRows.length - 1;
                            const lastRow = visitRows[lastRowIndex];
                            const updatedLastCell = (
                                <div className="dynamic-table-bottom-row">
                                    {lastRow[2] || <span></span>} {/* placeholder for element */}
                                    <button onClick={() => handleAddProcedure(visit.visitId)}>Add Procedure</button>
                                </div>
                            );
                            visitRows[lastRowIndex] = [
                                lastRow[0],
                                lastRow[1],
                                updatedLastCell
                            ];
                        }

                        return (
                            <div key={visit.visitId} className={`visit-section ${visitIndex > 0 ? 'visit-separator' : ''}`}>
                                <div className="visit-number">Visit {visit.visitNumber}</div>
                                <Table
                                    headers={headers}
                                    rows={visitRows}
                                    onDragEnd={(result) => onDragEnd(result, visit.visitId)}
                                    tableId={`table-${visit.visitId}`} 
                                />
                            </div>
                        );
                    })}
                </div>
            )}
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
    useImageIconColumn: PropTypes.bool,
    imageIconSrc: PropTypes.string,
    hideToothNumber: PropTypes.bool
};

TreatmentPlanOutput.defaultProps = {
    includeExtraRow: false,
    imageIconSrc: false,
};

export default TreatmentPlanOutput;