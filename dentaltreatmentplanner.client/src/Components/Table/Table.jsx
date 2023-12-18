import React from 'react';
import PropTypes from 'prop-types';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Table = ({ headers, rows, onDragEnd, tableId }) => { //add prop later for tableId
    const renderRow = (row, rowIndex) => (
        <Draggable key={`row-${tableId}-${rowIndex}`} draggableId={`row-${tableId}-${rowIndex}`} index={rowIndex}>
            {(provided) => (
                <tr
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {row.map((cell, cellIndex) => (
                        <td key={`cell-${tableId}-${rowIndex}-${cellIndex}`}>{cell}</td>
                    ))}
                </tr>
            )}
        </Draggable>
    );

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="table-container">
                <table className="tx-table">
                    <thead>
                        <tr className="table-inner-header">
                            {headers.map((header, index) => (
                                <th key={`header-${index}`}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <tbody ref={provided.innerRef} {...provided.droppableProps}>
                                {rows.map(renderRow)}
                                {provided.placeholder}
                            </tbody>
                        )}
                    </Droppable>
                </table>
            </div>
        </DragDropContext>
    );
};



Table.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)).isRequired,
    includeExtraRow: PropTypes.bool,
    extraRowInput: PropTypes.node,
    addProcedureElement: PropTypes.node,
    initialExtraRowDescription: PropTypes.string,
    onDragEnd: PropTypes.func.isRequired
};

Table.defaultProps = {
    includeExtraRow: false,
    extraRowInput: null,
    addProcedureElement: null,
    initialExtraRowDescription: ''
};

export default Table;