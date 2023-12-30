import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Table = ({ headers, rows, tableId, enableDragDrop, deleteImageIconSrc, deleteImageIconSrcHeader, dragImageIconSrc, onDeleteRow, onDeleteVisit }) => {
    
    const renderDraggableRow = (rowData, rowIndex) => {
        return (
            <Draggable key={`row-${tableId}-${rowIndex}`} draggableId={`row-${tableId}-${rowIndex}`} index={rowIndex} type="row">
                {(provided, snapshot) => (
                    <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                            ...provided.draggableProps.style,
                            borderBottom: snapshot.isDragging ? '1px solid #7777a1' : '',
                        }}
                    >
                        <td>
                            <img src={dragImageIconSrc} className="drag-icon" alt="Drag Icon" {...provided.dragHandleProps} />
                        </td>
                        {rowData.data.map((cell, cellIndex) => (
                            <td key={`cell-${tableId}-${rowIndex}-${cellIndex}`}>{cell}</td>
                        ))}
                        <td>
                            {rowData.deleteIconCell || <span></span>} {/* Render empty span if no delete icon */}
                        </td>
                    </tr>
                )}
            </Draggable>
        );
    };

    const renderRow = (rowData, rowIndex) => {
        return (
            <tr key={`row-${tableId}-${rowIndex}`}>
                <td>
                    <img src={dragImageIconSrc} className="drag-icon" alt="Drag Icon" />
                </td>
                {rowData.data.map((cell, cellIndex) => (
                    <td key={`cell-${tableId}-${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
                <td>
                    {rowData.deleteIconCell || <span></span>} {/* Render empty span if no delete icon */}
                </td>
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
                        {/* th for drag icon */}
                        <th>
                            <img src={dragImageIconSrc} className="drag-icon" alt="Drag Icon" />
                        </th>
                        {/* Map through headers */}
                        {headers.map((header, index) => (
                            <th key={`header-${index}`}>{header}</th>
                        ))}
                        {/* Separate th for delete icon in header */}
                        <th>
                            <img src={deleteImageIconSrcHeader} className="delete-icon" alt="Delete Icon" onClick={onDeleteVisit} />
                        </th>
                    </tr>
                </thead>
                {/* Table body */}
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