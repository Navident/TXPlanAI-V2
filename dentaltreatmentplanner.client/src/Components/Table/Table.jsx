import React from "react";
import PropTypes from "prop-types";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { StyledDeleteIcon, StyledRedCircleWithArrowDropdownContainer, StyledDragCircleContainer } from "../../GlobalStyledComponents";
import CustomCheckbox from "../../Components/Common/Checkbox/index";
import { StyledDragCheckmarkIconsContainer } from "./index.style";
import {
	toggleRowChecked,
	selectCheckedRows,
	selectIsGroupActive,
} from "../../Redux/ReduxSlices/TableViewControls/tableViewControlSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { UI_COLORS } from '../../Theme';
import redDropdownCircle from "../../assets/red-dropdown-circle.svg";
import { useState } from 'react';

const Table = ({
	headers,
	rows,
	tableId,
	enableDragDrop,
	deleteImageIconSrc,
	deleteImageIconSrcHeader,
	dragImageIconSrc,
	onDeleteRow,
	onDeleteVisit,
	columnWidths = [],
	displayCheckmark = true,
	onRedDropdownIconClick,
	activeParentRow
}) => {
	const dispatch = useDispatch();
	const checkedRows = useSelector(selectCheckedRows);
	const isRowChecked = (rowId) => checkedRows.includes(rowId);

	

	const handleCheckboxChange = (rowId) => {
		dispatch(toggleRowChecked(rowId));
		console.log(`Toggled check state for row: ${rowId}`);
	};

	useEffect(() => {
		console.log("Current checked rows:", Array.from(checkedRows));
	}, [checkedRows]);

	const renderDraggableRow = (rowData, rowIndex) => {
		const isAltCodeRow = rowData.id.startsWith('dynamic-alt-code') || rowData.id.startsWith('static-alt-code');

		const isRowActive = rowData.id === activeParentRow;

		const isLastRow = rowIndex === rows.length - 1;
		const rowBackgroundColor = isAltCodeRow ? "#E8E7E7" : (rowData.backgroundColor || "transparent");
		console.log("rowBackgroundColor", rowBackgroundColor);

		return (
			<Draggable
				key={`row-${tableId}-${rowIndex}`}
				draggableId={`row-${tableId}-${rowIndex}`}
				index={rowIndex}
				type="row"
			>
				{(provided, snapshot) => (
					<tr
						ref={provided.innerRef}
						{...provided.draggableProps}
						style={{
							...provided.draggableProps.style,
							borderBottom: snapshot.isDragging ? "1px solid #7777a1" : "",
							backgroundColor: rowBackgroundColor,
						}}
					>
						<td style={columnWidths[0] ? { width: columnWidths[0] } : {}}>
							<StyledDragCheckmarkIconsContainer>
								{!isLastRow && !isAltCodeRow && (
									<StyledDragCircleContainer>
										<img
											src={dragImageIconSrc}
											className="drag-icon"
											alt="Drag Icon"
											{...provided.dragHandleProps}
										/>
										<StyledRedCircleWithArrowDropdownContainer
											src={redDropdownCircle}
											isExpanded={isRowActive}
											onClick={(e) => toggleDropdown(rowData.id, e.currentTarget)}
										/>
										{displayCheckmark && (
											<CustomCheckbox
												label=""
												checked={isRowChecked(rowData.id)}
												onChange={() => handleCheckboxChange(rowData.id)}
												color= {UI_COLORS.purple}
											/>
										)}
									</StyledDragCircleContainer>
								)}
							</StyledDragCheckmarkIconsContainer>
						</td>
						{rowData.data && rowData.data.map((cell, cellIndex) => (
							<td
								key={`cell-${tableId}-${rowIndex}-${cellIndex}`}
								style={
									columnWidths[cellIndex + 1]
										? { width: columnWidths[cellIndex + 1] }
										: {}
								}
							>
								{cell}
							</td>
						))}
					</tr>
				)}
			</Draggable>
		);
	};

	const toggleDropdown = (id, target) => {
		// Your existing logic when red dropdown is clicked
		onRedDropdownIconClick(id, target);
	};


	const renderRow = (rowData, rowIndex) => {
		console.log("Row data for row", rowIndex, ":", rowData);

		const isLastRow = rowIndex === rows.length - 1;
		return (
			<tr key={`row-${tableId}-${rowIndex}`}>
				<td style={columnWidths[0] ? { width: columnWidths[0] } : {}}>
					{!isLastRow && (
						<StyledDragCheckmarkIconsContainer>
							<img
								src={dragImageIconSrc}
								className="drag-icon"
								alt="Drag Icon"
							/>
							<img
								src={redDropdownCircle}
								className="drag-icon"
								alt="Drag Icon"
								onClick={(e) => onRedDropdownIconClick(rowData.id, e.currentTarget)}
							/>
							{displayCheckmark && (
								<CustomCheckbox
									label=""
									checked={isRowChecked(rowData.id)}
									onChange={() => handleCheckboxChange(rowData.id)}
								/>
							)}
						</StyledDragCheckmarkIconsContainer>
					)}
				</td>
				{rowData.data && rowData.data.map((cell, cellIndex) => (
					<td
						key={`cell-${tableId}-${rowIndex}-${cellIndex}`}
						style={
							columnWidths[cellIndex + 1]
								? { width: columnWidths[cellIndex + 1] }
								: {}
						}
					>
						{cell}
					</td>
				))}
			</tr>
		);
	};

	const renderBody = (provided) => (
		<tbody
			ref={provided ? provided.innerRef : null}
			{...(provided ? provided.droppableProps : {})}
		>
			{rows.map((row, index) =>
				enableDragDrop ? renderDraggableRow(row, index) : renderRow(row, index)
			)}
			{provided && provided.placeholder}
		</tbody>
	);

	return (
		<div className="table-container">
			<table className="tx-table">
				<thead>
					<tr className="table-inner-header">
						<th style={columnWidths[0] ? { width: columnWidths[0] } : {}}></th>
						{headers.map((header, index) => (
							<th
								key={`header-${index}`}
								style={
									columnWidths[index + 1]
										? { width: columnWidths[index + 1] }
										: {}
								}
							>
								{header}
							</th>
						))}
						<th
							style={
								columnWidths[headers.length + 1]
									? { width: columnWidths[headers.length + 1] }
									: {}
							}
						>
							<StyledDeleteIcon
								src={deleteImageIconSrcHeader}
								className="delete-icon"
								alt="Delete Icon"
								onClick={onDeleteVisit}
							/>
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
	onDeleteRow: PropTypes.func,
};

Table.defaultProps = {
	enableDragDrop: false,
	deleteImageIconSrc: "",
	dragImageIconSrc: "",
};

export default Table;
