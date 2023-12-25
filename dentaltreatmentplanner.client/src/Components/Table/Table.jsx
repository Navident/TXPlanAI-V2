import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Table = ({ headers, rows, tableId, enableDragDrop, deleteImageIconSrc, deleteImageIconSrcHeader, dragImageIconSrc, onDeleteRow, onDeleteVisit }) => {
    const renderDraggableRow = (rowData, rowIndex) => {
        const rowId = rowData.id;
        console.log("Rendering row with ID:", rowId);
        console.log("Rendering row with ID:", rowId);
        return (
            <Draggable key={`row-${tableId}-${rowIndex}`} draggableId={`row-${tableId}-${rowIndex}`} index={rowIndex} type="row">
                {(provided) => (
                    <tr ref={provided.innerRef} {...provided.draggableProps}>
                        {rowData.data.map((cell, cellIndex) => (
                            <td key={`cell-${tableId}-${rowIndex}-${cellIndex}`}>
                                {cellIndex === 0 && (
                                    <img src={dragImageIconSrc} className="drag-icon" alt="Drag Icon" {...provided.dragHandleProps} />
                                )}
                                {cell}
                                {cellIndex === rowData.data.length - 1 && rowIndex !== rows.length - 1 && (
                                    <img src={deleteImageIconSrc} className="delete-icon" alt="Delete Icon" onClick={() => onDeleteRow(rowId)} />
                                )}
                            </td>
                        ))}
                    </tr>
                )}
            </Draggable>
        );
    };


    const renderRow = (rowData, rowIndex) => {
        const rowId = rowData.id; 
        return (
            <tr key={`row-${tableId}-${rowIndex}`}>
                {rowData.data.map((cell, cellIndex) => ( 
                    <td key={`cell-${tableId}-${rowIndex}-${cellIndex}`}>
                        {cellIndex === 0 && (
                            <img src={dragImageIconSrc} className="drag-icon" alt="Drag Icon" />
                        )}
                        {cell}
                        {cellIndex === rowData.data.length - 1 && rowIndex !== rows.length - 1 && (
                            <img src={deleteImageIconSrc} className="delete-icon" alt="Delete Icon" onClick={() => onDeleteRow(rowId)} />
                        )}
                    </td>
                ))}
            </tr>
        );
    };



    const renderBody = (provided) => (
        <tbody ref={provided ? provided.innerRef : null} {...(provided ? provided.droppableProps : {})}>
            {rows.map(enableDragDrop ? renderDraggableRow : renderRow)}
            {provided && provided.placeholder}
        </tbody>
    );

    return (
        <div className="table-container">
            <table className="tx-table">
                <thead>
                    <tr className="table-inner-header">
                        {headers.map((header, index) => (
                            <th key={`header-${index}`}>
                                {header}
                                {index === headers.length - 1 && (
                                    <img src={deleteImageIconSrcHeader} className="delete-icon" alt="Delete Icon" onClick={onDeleteVisit} />
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                {enableDragDrop ? (
                    <Droppable droppableId={`droppable-${tableId}`} type="row">
                        {renderBody}
                    </Droppable>
                ) : (
                    renderBody()
                )}
            </table>
        </div>
    );
};

Table.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)).isRequired,
    tableId: PropTypes.string.isRequired,
    enableDragDrop: PropTypes.bool,
    deleteImageIconSrc: PropTypes.string,
    dragImageIconSrc: PropTypes.string,
    onDeleteRow: PropTypes.func 
};

Table.defaultProps = {
    enableDragDrop: false,
    deleteImageIconSrc: '', 
    dragImageIconSrc: '',
};

export default Table;