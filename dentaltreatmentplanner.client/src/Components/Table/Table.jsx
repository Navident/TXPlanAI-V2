import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Table = ({ headers, rows, tableId, enableDragDrop, deleteImageIconSrc, deleteImageIconSrcHeader, dragImageIconSrc, onDeleteRow, onDeleteVisit }) => {
    const renderDraggableRow = (rowData, rowIndex) => {
        const isLastRow = rowIndex === rows.length - 1;
        return (
            <Draggable key={`row-${tableId}-${rowIndex}`} draggableId={`row-${tableId}-${rowIndex}`} index={rowIndex} type="row">
                {(provided, snapshot) => (
                    <tr ref={provided.innerRef} {...provided.draggableProps} style={{ ...provided.draggableProps.style, borderBottom: snapshot.isDragging ? '1px solid #7777a1' : '' }}>
                        <td>
                            {!isLastRow && <img src={dragImageIconSrc} className="drag-icon" alt="Drag Icon" {...provided.dragHandleProps} />}
                        </td>
                        {rowData.data.map((cell, cellIndex) => (
                            <td key={`cell-${tableId}-${rowIndex}-${cellIndex}`}>{cell}</td>
                        ))}
                        <td>
                            {!isLastRow && (rowData.deleteIconCell || <span></span>)}
                        </td>
                    </tr>
                )}
            </Draggable>
        );
    };

    const renderRow = (rowData, rowIndex) => {
        const isLastRow = rowIndex === rows.length - 1;
        return (
            <tr key={`row-${tableId}-${rowIndex}`}>
                <td>
                    {!isLastRow && <img src={dragImageIconSrc} className="drag-icon" alt="Drag Icon" />}
                </td>
                {rowData.data.map((cell, cellIndex) => (
                    <td key={`cell-${tableId}-${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
                <td>
                    {!isLastRow && (rowData.deleteIconCell || <span></span>)}
                </td>
            </tr>
        );
    };


    const renderBody = (provided) => (
        <tbody ref={provided ? provided.innerRef : null} {...(provided ? provided.droppableProps : {})}>
            {rows.map((row, index) => (enableDragDrop ? renderDraggableRow(row, index) : renderRow(row, index)))}
            {provided && provided.placeholder}
        </tbody>
    );

    return (
        <div className="table-container">
            <table className="tx-table">
                <thead>
                    <tr className="table-inner-header">
                        <th>
                        </th>
                        {headers.map((header, index) => (
                            <th key={`header-${index}`}>{header}</th>
                        ))}
                        <th>
                            <img src={deleteImageIconSrcHeader} className="delete-icon" alt="Delete Icon" onClick={onDeleteVisit} />
                        </th>
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