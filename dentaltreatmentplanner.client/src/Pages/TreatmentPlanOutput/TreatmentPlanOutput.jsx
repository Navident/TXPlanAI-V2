import PropTypes from "prop-types";
import "./TreatmentPlanOutput.css";
import Table from "../../Components/Table/Table";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import DropdownSearch from "../../Components/Common/DropdownSearch/DropdownSearch";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import {
	createVisit,
	createNewProcedures,
} from "../../ClientServices/apiService";
import {
	mapToUpdateTreatmentPlanDto,
	mapToCreateVisitDto,
} from "../../Utils/mappingUtils";
import deleteIcon from "../../assets/delete-x.svg";
import dragIcon from "../../assets/drag-icon.svg";
import {
	StyledContainerWithTableInner,
	StyledAddButtonCellContainer,
	StyledClickableText,
	StyledEditIcon,
	StyledDeleteIcon,
	StyledEditDeleteIconsContainer,
	StyledSaveTextBtn,
	StyledLightGreyText,
	StyledRoundedBoxContainerInner,
	StyledSemiboldBlackTitle,
	TableHeader
} from "../../GlobalStyledComponents";
import { UI_COLORS } from "../../Theme";
import pencilEditIcon from "../../assets/pencil-edit-icon.svg";
import RoundedButton from "../../Components/Common/RoundedButton/RoundedButton";
import {
	selectCheckedRows,
	selectIsGroupActive,
	toggleGroupActive,
	clearCheckedRows,
	selectSelectedCategories,
	updateCheckedRows,
	selectUpdateRequested, clearUpdateRequest
} from "../../Redux/ReduxSlices/TableViewControls/tableViewControlSlice";
import { useSelector, useDispatch } from "react-redux";
import { showAlert } from '../../Redux/ReduxSlices/Alerts/alertSlice';
//import { selectPayersForFacility, selectSelectedPayer, setGrandUcrTotal, setGrandCoPayTotal, setGrandTotalsReady } from '../../Redux/ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice';

import { onDeleteTemporaryVisit, onUpdateVisitDescription, setTreatmentPlanId, addTreatmentPlan, setVisitOrder, selectVisitOrder, handleAddCdtCode, onDeleteProcedure } from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import categoryColorMapping from '../../Utils/categoryColorMapping';
import StandardTextfield from '../../Components/Common/StandardTextfield/StandardTextfield';
import { selectSelectedPatient } from '../../Redux/ReduxSlices/Patients/patientsSlice';
import InputAdornment from '@mui/material/InputAdornment';
import { useCreateNewTreatmentPlanForPatientMutation, useUpdateTreatmentPlanMutation } from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansApiSlice';
import { useCombinedCdtCodes } from '../../Utils/Hooks/useCombinedCdtCodes';

const TreatmentPlanOutput = ({
	treatmentPlan,
	treatmentPlans,
	onAddVisit,
	onUpdateVisitsInTreatmentPlan,
	onDeleteVisit,
	showToothNumber,
	isInGenerateTreatmentPlanContext,
	onAllRowsUpdate
}) => {
	const dispatch = useDispatch();
	const [allRows, setAllRows] = useState({});
	const [deletedRowIds, setDeletedRowIds] = useState([]);
	const [deletedVisitIds, setDeletedVisitIds] = useState([]);
	const isInitialLoad = useRef(true);
	const [localUpdatedVisits, setLocalUpdatedVisits] = useState([]);

	const [combinedVisits, setCombinedVisits] = useState([]);
	

	const [editingRowId, setEditingRowId] = useState(null);
	const [originalRowData, setOriginalRowData] = useState(null);
	const [editedRows, setEditedRows] = useState([]);

	const [hasEdits, setHasEdits] = useState(false);
	const columnWidths = ["5%", "10%", "10%", "30%", "10%", "10%", "10%", "5%", "5%", "5%"];

	const checkedRows = useSelector(selectCheckedRows);
	const isGroupActive = useSelector(selectIsGroupActive);
	const selectedCategories = useSelector(selectSelectedCategories); 
	const visitOrder = useSelector(selectVisitOrder);
	const [editTableNameMode, setEditTableNameMode] = useState(null); 
	const [editTableNameValue, setEditTableNameValue] = useState(''); 
	const updateRequested = useSelector(selectUpdateRequested);
/*	const payers = useSelector(selectPayersForFacility);
	const selectedPayer = useSelector(selectSelectedPayer);*/
	const selectedPatient = useSelector(selectSelectedPatient);
	const [expandedRows, setExpandedRows] = useState(new Set());

	const { combinedCdtCodes, isLoading: combinedCodesLoading, error: combinedCodesError } = useCombinedCdtCodes();
	const [createNewTreatmentPlanForPatient, { isLoading: isLoadingCreate, isError: isErrorCreate, error: errorCreate }] = useCreateNewTreatmentPlanForPatientMutation();
	const [updateTreatmentPlan, { isLoading: isLoadingUpdate, isError: isErrorUpdate, error: errorUpdate }] = useUpdateTreatmentPlanMutation();



	useEffect(() => {
		const newCheckedRows = [];
		Object.values(allRows).forEach(visitRows => {
			visitRows.forEach(row => {
				if (row.selectedCdtCode && Array.from(selectedCategories).includes(row.selectedCdtCode.originalVisitCategory)) {
					newCheckedRows.push(row.id); 
				}
			});
		});
		dispatch(updateCheckedRows(newCheckedRows)); 
	}, [selectedCategories, allRows, dispatch]);

	useEffect(() => {
		if (updateRequested ) {
			handleUpdateTreatmentPlan(); 
			dispatch(clearUpdateRequest()); 
		}
	}, [updateRequested, treatmentPlan, dispatch]);

	useEffect(() => {
		if (isGroupActive) {
			handleGroupRows();
			dispatch(toggleGroupActive());
		}
	}, [isGroupActive, checkedRows]); 

	useEffect(() => {
		console.log("current treatmentPlan:", treatmentPlan);
	}, [treatmentPlan]);

	useEffect(() => {
		console.log("allRows:", allRows);
	}, [allRows]);

	useEffect(() => {
		console.log("alternativeRows:", alternativeRows);
	}, [allRows]);

	useEffect(() => {
		if (isInGenerateTreatmentPlanContext) {
			setCombinedVisits(treatmentPlan.visits);
		}
	}, [treatmentPlan, isInGenerateTreatmentPlanContext]);


	const [alternativeRows, setAlternativeRows] = useState({});

	useEffect(() => {
		if (isInitialLoad.current) {
			console.log("we went in the initial load conditional");
			const visits = treatmentPlan.visits || [];
			const newAllRows = {}; // Default procedures
			const newAlternativeRows = {}; // Non-default procedures for later access

			visits.forEach(visit => {
				const visitId = visit.visitId;
				newAllRows[visitId] = [];
				newAlternativeRows[visitId] = [];

				(visit.visitToProcedureMaps || []).forEach((procedureMap, procIndex) => {
					(procedureMap.procedureToCdtMaps || []).forEach((cdtMap, cdtIndex) => {
						const row = createInitialStaticRows(cdtMap, visitId, `${procIndex}-${cdtIndex}`, procedureMap);

						if (cdtMap.default) {
							newAllRows[visitId].push(row);
						} else {
							newAlternativeRows[visitId].push(row);
						}
					});
				});

				// Include a dynamic row at the end of each visit in allRows
				const initialRowId = `initial-${visitId}`;
				newAllRows[visitId].push(createDynamicRowv1(visitId, initialRowId));
			});

			setAllRows(newAllRows);
			setAlternativeRows(newAlternativeRows);
			dispatch(setVisitOrder(visits.map(visit => visit.visitId)));

			isInitialLoad.current = false;
		}
	}, [treatmentPlans]);

	useEffect(() => {
		if (typeof onAllRowsUpdate === 'function') {
			onAllRowsUpdate(allRows); 
		}
	}, [allRows, onAllRowsUpdate]);


	useEffect(() => {
		if (isInGenerateTreatmentPlanContext) {
			setLocalUpdatedVisits(treatmentPlan.visits);
		}
	}, [treatmentPlan.visits]);

	const handleGroupRows = useCallback(() => {
		if (checkedRows.length === 0) {
			dispatch(showAlert({ type: 'warning', message: 'Please select rows before you press the group button' }));
			console.log('No rows are checked. Exiting without creating a new visit.');
			return;
		}
		// Generate a new visit ID for the grouped rows
		const newGroupVisitId = `temp-grouped-${Date.now()}`;

		let newAllRows = { ...allRows }; // Make a shallow copy of allRows to modify
		let groupedRows = [];

		// Log checked rows
		console.log('Checked rows:', checkedRows);

		// Iterate over all visits to filter out the checked rows and accumulate them for the new group
		Object.entries(allRows).forEach(([visitId, rows]) => {
			const remainingRows = rows.filter(row => !checkedRows.includes(row.id));
			groupedRows = groupedRows.concat(rows.filter(row => checkedRows.includes(row.id)));

			// Update newAllRows with the remaining rows for the current visit
			if (remainingRows.length > 1) {
				newAllRows[visitId] = remainingRows;
			} else {
				delete newAllRows[visitId];
			}
		});

		// Log grouped rows and newAllRows state before calling handleAddVisit
		console.log('Grouped rows:', groupedRows);
		console.log('newAllRows before adding new visit:', newAllRows);

		// Use handleAddVisit to add the new visit with grouped rows
		handleAddVisit(newGroupVisitId, groupedRows, newAllRows);

		// Clear checked rows after grouping
		dispatch(clearCheckedRows());
	}, [allRows, checkedRows, dispatch]);





	const handleAddVisit = (customVisitId = null, groupedRows = [], updatedAllRows = null) => {
		const visitId = customVisitId || `temp-${Date.now()}`;
		const initialRowId = `initial-${visitId}`;

		const newVisit = {
			visitId: visitId,
			treatment_plan_id: treatmentPlan.treatmentPlanId,
			visitNumber: treatmentPlan.visits.length + 1,
			description: "Table " + (treatmentPlan.visits.length + 1),
		};

	
		onAddVisit(newVisit);

		const dynamicRow = createDynamicRowv1(visitId, initialRowId);
		const newRows = [...groupedRows, dynamicRow];


		const newVisitOrder = [...visitOrder, visitId];
		dispatch(setVisitOrder(newVisitOrder));

		// Handling updatedAllRows
		const finalAllRows = updatedAllRows ? { ...updatedAllRows, [visitId]: newRows } : null;
		if (finalAllRows) {
			setAllRows(finalAllRows);
		} else {
			setAllRows(prevRows => ({
				...prevRows,
				[visitId]: newRows,
			}));
		}

		// Log final allRows state after update
		console.log('All rows after adding new visit:', finalAllRows ? finalAllRows : 'Updated within setAllRows');
	};



	const createInitialStaticRows = (item, visitId, index, procedureMap = null) => {


		const cdtMap = procedureMap ? item : (item || {});

		const surface = cdtMap.surface || procedureMap?.surface || "";
		const arch = cdtMap.arch || procedureMap?.arch || "";

		// Adjusting the row inputs to accommodate potential differences in data structure
		const toothNumber = cdtMap.toothNumber || procedureMap?.toothNumber || "";
		const code = cdtMap.code || procedureMap?.procedureCode || ""; // Assuming `procedureCode` could be an alternative key
		const longDescription = cdtMap.longDescription || procedureMap?.description || ""; 

		const extraRowInput = [
			toothNumber, 
			code,
			longDescription,

			surface,
			arch
		];

		return {
			id: `static-${visitId}-${index}`,
			visitToProcedureMapId: procedureMap?.visitToProcedureMapId || cdtMap.visitToProcedureMapId, // Adjust based on the presence of a procedure map
			description: longDescription,
			selectedCdtCode: cdtMap,
			toothNumber,
			isStatic: true,
			extraRowInput,
		};
	};



	const createCDTCodeDropdown = (
		rowId,
		visitId,
		combinedCdtCodes,
		handleSelect,
		selectedCdtCode
	) => {
		const cdtCodeOptions = combinedCdtCodes.map((code) => ({
			id: code.code,
			...code,
		}));

		return (
			<DropdownSearch
				key={rowId}
				items={cdtCodeOptions}
				selectedItem={selectedCdtCode}
				onSelect={(selectedCode) => handleSelect(selectedCode, visitId, rowId)}
				itemLabelFormatter={(cdtCode) =>
					`${cdtCode.code} - ${cdtCode.longDescription}`
				}
			/>
		);
	};

	const createDynamicRowv1 = (visitId, initialRowId) => {
		const dropdownSearchElement = createCDTCodeDropdown(
			initialRowId,
			visitId,
			combinedCdtCodes,
			handleSelect
		);
		const extraRowInput = [treatmentPlan.toothNumber, dropdownSearchElement];

		return {
			id: initialRowId,
			description: "",
			selectedCdtCode: null,
			extraRowInput,
		};
	};


	const createNewCdtCodeObject = (selectedCdtCode, visitId) => {
		return {
			cdtCodeId: selectedCdtCode.cdtCodeId, 
			code: selectedCdtCode.code, 
			longDescription: selectedCdtCode.longDescription, 
			toothNumber: selectedCdtCode.toothNumber,
			visitId: visitId, 
			orderWithinVisit: 0, 
		};
	};

	const convertToStaticRow = (
		currentRow,
		visitId,
		selectedCdtCode,
		originalDescription
	) => {
		// Find the payer details based on the context
/*		let selectedPayerDetails;
		if (!isInGenerateTreatmentPlanContext && treatmentPlan.payerId) {
			const savedTxPayerId = treatmentPlan.payerId;
			selectedPayerDetails = payers.find(payer => payer.payerId === savedTxPayerId);
		} else if (isInGenerateTreatmentPlanContext && selectedPayer && selectedPayer.payerId) {
			selectedPayerDetails = payers.find(payer => payer.payerId === selectedPayer.payerId);
		}*/
		const toothNumber = currentRow.selectedCdtCode?.toothNumber || "";


		const description = originalDescription || (selectedCdtCode ? selectedCdtCode.longDescription : currentRow.description);

		const surface = selectedCdtCode.surface || "";
		const arch = selectedCdtCode.arch || "";

		let updatedSelectedCdtCode = {
			...(selectedCdtCode || currentRow.selectedCdtCode),
			toothNumber: toothNumber, // Make sure to preserve the tooth number
		};

		//attempting to add cdt code - START
		const newCdtCode = createNewCdtCodeObject(selectedCdtCode, visitId);
		console.log('Created new CDT code object', newCdtCode);

		console.log('Dispatching action to add CDT code', { treatmentPlanId: treatmentPlan.treatmentPlanId, visitId, newCdtCode });
		dispatch(handleAddCdtCode({ treatmentPlanId: treatmentPlan.treatmentPlanId, visitId, newCdtCode }));
		//attempting to add cdt code - END

		return {
			...currentRow,
			id: `static-${visitId}-${Date.now()}`,
			isStatic: true,
			visitCdtCodeMapId: null,
			selectedCdtCode: updatedSelectedCdtCode,
			description,
			extraRowInput: [
				toothNumber, // Ensure the tooth number is set here
				updatedSelectedCdtCode.code,
				description,
				surface,
				arch
			],
		};
	};

	//this function is executed when the user clicks edit to make the row dynamic
	const convertToDynamicRow = (currentRow, visitId) => {
		const dropdownSearchElement = createCDTCodeDropdown(
			currentRow.id,
			visitId,
			combinedCdtCodes,
			handleSelect,
			currentRow.selectedCdtCode
		);
		const toothNumber =
			currentRow.toothNumber ||
			(currentRow.selectedCdtCode && currentRow.selectedCdtCode.toothNumber) ||
			"";

		const surf = currentRow.extraRowInput[3];
		const arch = currentRow.extraRowInput[4];

		const extraRowInput = [
			toothNumber,
			dropdownSearchElement,

			surf,
			arch
		];

		return {
			...currentRow,
			id: `dynamic-${visitId}-${Date.now()}`,
			extraRowInput,
			isStatic: false,
			isEditing: true,
		};
	};

	const handleSelect = (selectedCode, visitId, rowId) => {
		const cdtCodeObj = combinedCdtCodes.find(
			(cdtCode) => cdtCode.code === selectedCode.value
		);

		setAllRows((prevRows) => {
			let rows = [...prevRows[visitId]];
			let rowIndex = rows.findIndex((row) => row.id === rowId);

			if (rowIndex !== -1) {
				const currentRow = rows[rowIndex];
				// Preserve existing selectedCdtCode properties (like toothNumber) and merge with new cdtCodeObj
				const updatedSelectedCdtCode = {
					...currentRow.selectedCdtCode,
					...cdtCodeObj,
				};

				// Update the current dynamic row with the merged CDT code object
				rows[rowIndex] = {
					...currentRow,
					selectedCdtCode: updatedSelectedCdtCode,
					description: cdtCodeObj.longDescription,
				};
			}

			return {
				...prevRows,
				[visitId]: rows,
			};
		});
	};


	const createDynamicRowUponAddClick = (visitId) => {
		return {
			id: `dynamic-${visitId}-${Date.now()}`,
			description: "",
			selectedCdtCode: null,
			extraRowInput: [treatmentPlan.toothNumber, "", ""],
		};
	};

	function addNewRow(visitId) {
		setAllRows((prevAllRows) => {
			const rowsForVisit = prevAllRows[visitId] || [];
			const lastRow = rowsForVisit.length > 0 ? rowsForVisit[rowsForVisit.length - 1] : null;

			if (lastRow) {
				// First, ensure selectedCdtCode is not null
				const hasSelectedCdtCode = lastRow.selectedCdtCode !== null;
				const hasCode = hasSelectedCdtCode && 'code' in lastRow.selectedCdtCode;
				const hasToothNumber = hasSelectedCdtCode && lastRow.selectedCdtCode.toothNumber;

				// Ensure a CDT code is selected and a tooth number is present
				if (hasCode && hasToothNumber) {
					// Use convertToStaticRow to convert the last row to static
					const staticRow = convertToStaticRow(lastRow, visitId, lastRow.selectedCdtCode);

					// Use createDynamicRow to add a new dynamic row
					const newDynamicRow = createDynamicRowUponAddClick(visitId);

					return {
						...prevAllRows,
						[visitId]: [...rowsForVisit.slice(0, -1), staticRow, newDynamicRow],
					};
				} else {
					// Alert the user that a tooth number and CDT code must be selected
					dispatch(showAlert({ type: 'error', message: 'Please input a tooth number and select a CDT code for the last row before adding a new one.' }));
				}
			}

			return prevAllRows;
		});
	}



	function createAddButtonCell(visitId) {
		return (
			<StyledAddButtonCellContainer>
				<RoundedButton
					text="Add"
					backgroundColor={UI_COLORS.purple}
					textColor="white"
					border={false}
					borderRadius="4px"
					height="39px"
					width="150px"
					onClick={() => addNewRow(visitId)}
				/>
			</StyledAddButtonCellContainer>
		);
	}

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	const onDragEnd = (result) => {
		const { source, destination } = result;

		// Do nothing if dropped outside the list
		if (!destination) {
			return;
		}

		if (result.type === "row") {
			const sourceId = source.droppableId.replace("droppable-table-", "");
			const destinationId = destination.droppableId.replace("droppable-table-", "");

			// Dropping in the same table
			if (source.droppableId === destination.droppableId) {
				const newRows = reorder(allRows[sourceId], source.index, destination.index);
				setAllRows((prevRows) => ({
					...prevRows,
					[sourceId]: newRows,
				}));
			} else {
				// Moving from one table to another
				const sourceRows = Array.from(allRows[sourceId]);
				const destRows = Array.from(allRows[destinationId]);
				const [removed] = sourceRows.splice(source.index, 1);
				destRows.splice(destination.index, 0, removed);

				setAllRows((prevRows) => ({
					...prevRows,
					[sourceId]: sourceRows,
					[destinationId]: destRows,
				}));
			}
		}
	};


	const reorderAllRows = (newVisitOrder) => {
		const reorderedRows = {};
		newVisitOrder.forEach((visitId) => {
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
		dispatch(setVisitOrder(newOrder));
		console.log("New order set, re-rendering with:", newOrder);
		reorderAllRows(newOrder);
		// Update visitNumber for each visit
		const updatedVisits = treatmentPlan.visits.map((visit) => {
			const newOrderIndex = newOrder.indexOf(visit.visitId);
			return { ...visit, visitNumber: newOrderIndex + 1 };
		});

		console.log("Updated visits before dispatch:", updatedVisits);
		onUpdateVisitsInTreatmentPlan(treatmentPlan.treatmentPlanId, updatedVisits);

		
	};

	const handleDeleteRow = (visitId, rowId) => {
		// Proceed to remove the row visually from the UI
		setAllRows((prevRows) => {
			const updatedRows = prevRows[visitId].filter((r) => r.id !== rowId);

			// After filtering out the deleted row, synchronize alternativeRows
			synchronizeAlternativeRows(visitId, { ...prevRows, [visitId]: updatedRows });

			return { ...prevRows, [visitId]: updatedRows };
		});

		setDeletedRowIds((prevIds) => [...prevIds, rowId]);
	};


	const handleDeleteVisit = (visitId) => {
		// Check if the visitId starts with "temp-" to identify temporary visits
		const visitIdStr = `${visitId}`;
		const isTemporaryVisit = visitIdStr.startsWith("temp-");

		// Update the visitOrder to remove the visit
		const newVisitOrder = visitOrder.filter(id => id !== visitIdStr);
		dispatch(setVisitOrder(newVisitOrder));

		// Update allRows to remove the rows associated with the visit
		setAllRows(prevRows => {
			const updatedRows = { ...prevRows };
			delete updatedRows[visitIdStr];
			return updatedRows;
		});

		// If the visit is not temporary
		if (!isTemporaryVisit) {
			setDeletedVisitIds(prevIds => {
				const newDeletedVisitIds = [...prevIds, visitId];
				console.log("Deleted visit added, new deletedVisitIds:", newDeletedVisitIds);
				return newDeletedVisitIds;
			});

				onDeleteVisit(treatmentPlan.treatmentPlanId, visitId);

		} else {
			// If the visit is temporary
			dispatch(onDeleteTemporaryVisit({ deletedVisitId: visitIdStr }));
		}
	};



	const createNewCombinedTreatmentPlanForPatient = async (
		treatmentPlan,
		allRows,
		visitOrder
	) => {
		console.log("Attempting to create a new combined treatment plan...");
		try {
			//const payerId = selectedPayer ? selectedPayer.payerId : null;

			const patientId = selectedPatient && selectedPatient.patientId ? selectedPatient.patientId : null;

			const newTreatmentPlan = await createNewTreatmentPlanForPatient({
				treatmentPlan,
				allRows,
				alternativeRows,
				visitOrder,
				selectedPatientId: patientId,
				//payerId,
			}).unwrap(); 

			console.log("New treatment plan created successfully:", newTreatmentPlan);
			return newTreatmentPlan;
		} catch (error) {
			console.error("Error in creating new treatment plan:", error);
		}
	}


	const handleUpdateTreatmentPlan = async () => {
		try {
			// if in generate treatment plan page and no tx ID exists yet then we only do a create
			if (isInGenerateTreatmentPlanContext && treatmentPlan.treatmentPlanId === null) {
				// Logic for creating a new treatment plan
				const newTreatmentPlanResponse = await createNewCombinedTreatmentPlanForPatient(
					treatmentPlan,
					allRows,
					visitOrder
				);
				console.log("New treatment plan created successfully:", newTreatmentPlanResponse);

				if (newTreatmentPlanResponse && newTreatmentPlanResponse.treatmentPlanId) {
					//adjustUpdatedTreatmentPlanStructure(newTreatmentPlanResponse, treatmentPlan);

					dispatch(setTreatmentPlanId(newTreatmentPlanResponse.treatmentPlanId));
					dispatch(addTreatmentPlan(newTreatmentPlanResponse));
				}

				dispatch(showAlert({ type: 'success', message: 'New treatment plan created successfully' }));

			
			// if BOTH of the top if conditions are not true then we only do an update to an existing tx plan
			} else { 
				console.log("Proceeding with the update logic.");
				const tempVisitIds = visitOrder.filter((visitId) =>
					String(visitId).startsWith("temp-")
				);
				const createVisitPromises = tempVisitIds.map((tempVisitId) => {
					const visitData = mapToCreateVisitDto(
						treatmentPlan,
						allRows,
						tempVisitId
					);
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
				Object.keys(deepCopyAllRows).forEach((visitId) => {
					if (visitIdMap[visitId]) {
						deepCopyAllRows[visitIdMap[visitId]] = deepCopyAllRows[visitId];
						delete deepCopyAllRows[visitId];
					}
				});

				// Update the state
				setAllRows(deepCopyAllRows);

				const newProcedures = [];
				Object.keys(deepCopyAllRows).forEach(visitId => {
					deepCopyAllRows[visitId].forEach(row => {
						if (!row.procedureToCdtMapId && row.selectedCdtCode && typeof row.selectedCdtCode.cdtCodeId !== 'undefined') {
							newProcedures.push({
								visitId: visitId,
								cdtCodeId: row.selectedCdtCode.cdtCodeId,
								order: 0,
							});
						}
					});
				});

				console.log("newProcedures: ", newProcedures);
				const newProcedureResponse = await createNewProcedures(newProcedures);
				newProcedureResponse.forEach(proc => {
					const { visitId, procedureToCdtMapId, cdtCodeId } = proc;
					const rows = deepCopyAllRows[visitId];
					if (!rows) {
						return;
					}
					const rowIndex = rows.findIndex(row => row.selectedCdtCode && row.selectedCdtCode.cdtCodeId === cdtCodeId);
					if (rowIndex > -1) {
						rows[rowIndex].procedureToCdtMapId = procedureToCdtMapId;
					}
				});

				const updatedVisitOrder = visitOrder.map(visitId => visitIdMap[visitId] || visitId);

				const updatedVisits = treatmentPlan.visits.map(visit => {
					const actualVisitId = visitIdMap[visit.visitId] || visit.visitId;
					const updatedProcedures = deepCopyAllRows[actualVisitId]
						? deepCopyAllRows[actualVisitId]
							.filter(row => row.selectedCdtCode !== null)
							.map(row => ({
								procedureToCdtMapId: row.procedureToCdtMapId,
								cdtCodeId: row.selectedCdtCode.cdtCodeId,
								description: row.description,
							}))
						: visit.procedures;

					return {
						...visit,
						visitId: actualVisitId,
						procedures: updatedProcedures,
					};
				});

				// Update local state for immediate reflection in the UI
				setLocalUpdatedVisits(updatedVisits);

				// Update allRows and visitOrder in state
				dispatch(setVisitOrder(updatedVisitOrder));

				setAllRows(deepCopyAllRows);

				// update the treatment plan
				const updateDto = mapToUpdateTreatmentPlanDto(
					treatmentPlan,
					deepCopyAllRows,
					updatedVisitOrder,
					deletedRowIds,
					deletedVisitIds,
					editedRows
				);
				const updatedTreatmentPlan = await updateTreatmentPlan({
					id: treatmentPlan.treatmentPlanId,
					updatedData: updateDto
				}).unwrap();

				onUpdateVisitsInTreatmentPlan(
					treatmentPlan.treatmentPlanId,
					updatedVisits
				);
				console.log("Updated Treatment Plan:", updatedTreatmentPlan);

				dispatch(showAlert({ type: 'success', message: 'Treatment plan updated successfully' }));
			}
		} catch (error) {
			console.error("Error updating treatment plan:", error);
		}
	};



/*	const transformVisitCdtCodeMapsToCdtCodes = (visit) => {
		return visit.visitCdtCodeMaps.map(cdtCodeMap => {
			const cdtCodeDetails = getCdtCodeDetailsByCdtCodeId(cdtCodeMap.cdtCodeId);
			return {
				cdtCodeId: cdtCodeMap.cdtCodeId,
				code: cdtCodeDetails?.code,
				longDescription: cdtCodeDetails?.longDescription,
				createdAt: cdtCodeMap.createdAt,
				modifiedAt: cdtCodeMap.modifiedAt,
				order: cdtCodeMap.order,
				procedureTypeId: cdtCodeMap.procedureTypeId,
				toothNumber: cdtCodeMap.toothNumber,
				visitCdtCodeMapId: cdtCodeMap.visitCdtCodeMapId,
				visitId: cdtCodeMap.visitId,
			};
		});
	};

	const adjustUpdatedTreatmentPlanStructure = (updatedTreatmentPlan, originalTreatmentPlan) => {
		// Reinsert the category names from the original treatment plan
		updatedTreatmentPlan.procedureCategoryName = originalTreatmentPlan.procedureCategoryName;
		updatedTreatmentPlan.procedureSubCategoryName = originalTreatmentPlan.procedureSubCategoryName;

		updatedTreatmentPlan.visits.forEach(visit => {
			visit.cdtCodes = transformVisitCdtCodeMapsToCdtCodes(visit);
			delete visit.visitCdtCodeMaps;
		});
	};*/


	const createHeaders = () => {
		let headers = [
			"Tooth #",
			"CDT Code",
			"Description",

			"Surf",
			"Arch"
		];
		return headers;
	};

	const constructStaticRowData = (row) => {
		return row.extraRowInput.map((input, index, array) => {
			if (index >= array.length - 3) {
				return input != null ? input.toString() : "Not configured";
			}
			return input;
		});
	};

	const handleInputChange = (visitId, rowId, field, value) => {
		setAllRows(prevAllRows => {
			// Make a shallow copy of the allRows object
			const updatedAllRows = { ...prevAllRows };

			// Find the specific visit's array of rows
			const rowsForVisit = updatedAllRows[visitId];

			// Map over the rows to find the correct one and update it
			const updatedRows = rowsForVisit.map(row => {
				if (row.id === rowId) {
					// For dynamic rows, update the selectedCdtCode object with the new value
					const updatedRow = { ...row };
					if (!updatedRow.selectedCdtCode) {
						updatedRow.selectedCdtCode = {}; // Initialize if necessary
					}
					updatedRow.selectedCdtCode = {
						...updatedRow.selectedCdtCode,
						[field]: value, 
					};
					return updatedRow;
				}
				return row; // Return the row unchanged if it's not the one we're updating
			});

			// Update the visit's rows in the allRows object
			updatedAllRows[visitId] = updatedRows;
			return updatedAllRows;
		});
	};


	const handleToothNumberChange = (e, visitId, rowId) => {
		const newToothNumber = e.target.value;
		handleInputChange(visitId, rowId, 'toothNumber', newToothNumber);
	};



	const constructDynamicRowData = (row, visitId) => {
		// Extracting other properties as before
		const surf = row.extraRowInput[3];
		const arch = row.extraRowInput[4];

		const dropdownKey = `dropdown-${row.id}`;
		const cdtDropdown = (
			<DropdownSearch
				key={dropdownKey}
				items={combinedCdtCodes}
				selectedItem={row.selectedCdtCode}
				onSelect={(selectedCode) => handleSelect(selectedCode, visitId, row.id)}
				itemLabelFormatter={(cdtCode) => `${cdtCode.code} - ${cdtCode.longDescription}`}
				valueKey="code"
				labelKey="longDescription"
			/>
		);

		// Checking for toothNumber in both row and row.selectedCdtCode, prioritizing row's toothNumber
		const toothNumber = row.toothNumber ? row.toothNumber.toString() :
			row.selectedCdtCode?.toothNumber?.toString() || "";

		const toothNumberInput = (
			<StandardTextfield
				key={`toothNumber-${row.id}`}
				label=""
				value={toothNumber}
				onChange={(e) => handleToothNumberChange(e, visitId, row.id)}
				borderColor={UI_COLORS.purple}
				width="75px"
				adornment={<InputAdornment position="start">#</InputAdornment>}
			/>
		);

		return [toothNumberInput, cdtDropdown, row.description, surf, arch];
	};


	const handleCancelEdit = (rowId, visitId) => {
		setEditingRowId(null);
		setAllRows((prevAllRows) => {
			const rows = prevAllRows[visitId];
			const updatedRows = rows.map((row) => {
				if (row.id === rowId) {
					return originalRowData || row; // Revert to originalRowData if available, otherwise keep the current row
				}
				return row;
			});
			// Only update the rows for the specific visitId
			return {
				...prevAllRows,
				[visitId]: updatedRows,
			};
		});
		setOriginalRowData(null);
	};

	const handleDoneEdit = (rowId, visitId) => {
		setEditingRowId(null);
		setAllRows((prevAllRows) => {
			const rows = prevAllRows[visitId];
			const updatedRows = rows.map((row) => {
				if (row.id === rowId) {
					const editedRow = convertToStaticRow(
						row,
						visitId,
						row.selectedCdtCode,
						row.description
					);
					setEditedRows((prev) => [...prev, { ...editedRow, visitId }]); // Storing full row data and visitId

					return editedRow;
				}
				return row;
			});

			// Update only the rows for the specific visitId
			return {
				...prevAllRows,
				[visitId]: updatedRows,
			};
		});
		// After successfully saving the edits, clear the originalRowData
		setOriginalRowData(null);
		setHasEdits(true); // we may need to add one of these when creating a new row also
	};

	function renderDoneCancelText(rowId, visitId) {
		return (
			<StyledEditDeleteIconsContainer>
				<StyledClickableText onClick={() => handleDoneEdit(rowId, visitId)}>
					Done
				</StyledClickableText>
				<StyledClickableText onClick={() => handleCancelEdit(rowId, visitId)}>
					Cancel
				</StyledClickableText>
			</StyledEditDeleteIconsContainer>
		);
	}

	function createDeleteIconCell(row, index, visitId) {
		console.log("Creating delete icon cell for row:", row.id);
		const isAltRow = row.id.startsWith('dynamic-alt-code') || row.id.startsWith('static-alt-code');
		const isNotLastRow = index !== allRows.length - 1;
		if (row.isStatic && isNotLastRow && !isAltRow) {
			return (
				<StyledEditDeleteIconsContainer>
					<StyledEditIcon
						src={pencilEditIcon}
						alt="Edit Icon"
						onClick={() => handleEditRow(row.id, visitId)}
					/>
					<StyledDeleteIcon
						src={deleteIcon}
						alt="Delete Icon"
						onClick={() => handleDeleteRow(visitId, row.id, row)}
					/>
				</StyledEditDeleteIconsContainer>
			);
		}
		return null;
	}

	const padRowData = (rowData, headers) => {
		while (rowData.length < headers.length - 1) {
			rowData.push(""); // Add empty strings for missing cells
		}
		return rowData;
	};

	const createTableRow = (row, visitId, headers, index) => {
		// Determine if there are matching alternative rows for this default row
		const alternatives = alternativeRows[visitId] || [];
		const hasAltChildren = alternatives.some(alt => alt.visitToProcedureMapId === row.visitToProcedureMapId);
		const isDefaultRow = row.selectedCdtCode ? row.selectedCdtCode.default : (row.hasOwnProperty('default') ? row.default : null);
		const isStaticRow = row.isStatic;
		let rowData = isStaticRow
			? constructStaticRowData(row)
			: constructDynamicRowData(row, visitId);

		rowData = padRowData(rowData, headers);
		let lastCellContent;

		if (isStaticRow) {
			lastCellContent = createDeleteIconCell(row, index, visitId);
		} else {
			// For dynamic rows, check if it is being edited
			if (row.isEditing) {
				lastCellContent = renderDoneCancelText(row.id, visitId); // For rows being edited
			} else {
				lastCellContent = createAddButtonCell(visitId); // For other dynamic rows
			}
		}
		rowData.push(lastCellContent);

		// Determine if the row is checked
		const isRowChecked = checkedRows.includes(row.id);

		// Determine the category and corresponding background color
		const category = row.selectedCdtCode?.originalVisitCategory;

		let backgroundColor;
		if (isRowChecked) {
			if (category && selectedCategories.has(category)) {
				backgroundColor = categoryColorMapping[category];
			} else {
				backgroundColor = "transparent";
			}
		} else {
			backgroundColor = null;
		}

		return {
			id: row.id,
			data: rowData,
			backgroundColor,
			parentId: row.parentId,
			hasAltChildren, 
			default: isDefaultRow,
			category
		};
	};


	const handleEditRow = (rowId, visitId) => {
		// Directly access the rows for the specific visitId
		const rows = allRows[visitId];
		const rowIndex = rows.findIndex((row) => row.id === rowId);

		if (rowIndex !== -1) {
			const currentRow = rows[rowIndex];

			// Set originalRowData with the current state of the row before making it dynamic for editing
			setOriginalRowData({ ...currentRow });

			// Convert the current row to a dynamic row for editing
			const dynamicRow = convertToDynamicRow(currentRow, visitId);

			// Update the rows array with the newly converted dynamic row
			const updatedRows = [
				...rows.slice(0, rowIndex),
				dynamicRow,
				...rows.slice(rowIndex + 1),
			];
			// Update the state to reflect the changes
			setAllRows((prevAllRows) => ({
				...prevAllRows,
				[visitId]: updatedRows, // Only update the rows for the specific visit
			}));
		} else {
			console.error("Row not found with rowId:", rowId, "in visitId:", visitId);
		}
	};




	const synchronizeAlternativeRows = (visitId, updatedAllRows) => {
		// Filter for non-default rows that are static, do not have a temporary ID, and have a non-null selectedCdtCode
		const updatedAlternativeRows = updatedAllRows[visitId].filter(row =>
			!row.default && // Not default
			row.selectedCdtCode != null // Exclude rows with null selectedCdtCode
		);

		setAlternativeRows(prevAlternativeRows => ({
			...prevAlternativeRows,
			[visitId]: updatedAlternativeRows,
		}));
	};

	const synchronizeAlternativeRows2 = (visitId, updatedRows) => {
		const updatedAlternativeRows = updatedRows.filter(row =>
			row.selectedCdtCode != null &&
			row.selectedCdtCode.default === false // Not default
		);

		setAlternativeRows(prevAlternativeRows => {
			// Merge existing alternative rows with the new alternative rows
			const existingAlternativeRows = prevAlternativeRows[visitId] || [];
			const mergedAlternativeRows = [...existingAlternativeRows.filter(row =>
				!updatedAlternativeRows.some(updatedRow => updatedRow.id === row.id)
			), ...updatedAlternativeRows];

			return {
				...prevAlternativeRows,
				[visitId]: mergedAlternativeRows,
			};
		});
	};




	const handleSwapAltRow = (defaultProcedureId, alternativeProcedureId) => {
		let visitIdForSwap, defaultRowIndex, alternativeRowIndex;

		for (const [visitId, rows] of Object.entries(allRows)) {
			defaultRowIndex = rows.findIndex(row => row.id === defaultProcedureId);
			alternativeRowIndex = rows.findIndex(row => row.id === alternativeProcedureId);

			if (defaultRowIndex !== -1 && alternativeRowIndex !== -1) {
				visitIdForSwap = visitId;
				break;
			}
		}

		if (!visitIdForSwap) {
			console.error('Could not find rows for swapping.');
			return;
		}

		// Swap the rows 
		setAllRows(prevAllRows => {
			const updatedRows = [...prevAllRows[visitIdForSwap]];

			// Extract copies of the rows to be swapped
			let defaultRowCopy = { ...updatedRows[defaultRowIndex] };
			let alternativeRowCopy = { ...updatedRows[alternativeRowIndex] };

			// Swap specified indexes of the extraRowInput array if applicable
			if (defaultRowCopy.extraRowInput && alternativeRowCopy.extraRowInput) {
				[0, 3, 4].forEach(index => {
					[defaultRowCopy.extraRowInput[index], alternativeRowCopy.extraRowInput[index]] =
						[alternativeRowCopy.extraRowInput[index], defaultRowCopy.extraRowInput[index]];
				});
			}

			// Swap the IDs to reflect the change in role
			const tempId = defaultRowCopy.id;
			defaultRowCopy.id = alternativeRowCopy.id;
			alternativeRowCopy.id = tempId;

			// Update the parentId for the swapped rows
			// The new default (former alternative) should have null as parentId
			alternativeRowCopy.parentId = null;

			// The new alternative (former default) should have its parentId set to the new default's ID
			defaultRowCopy.parentId = alternativeRowCopy.id; // corrected to reference the correct ID

			// Apply the updated objects back to their new positions
			updatedRows[defaultRowIndex] = {
				...alternativeRowCopy, // This is now the default
				selectedCdtCode: { ...alternativeRowCopy.selectedCdtCode, default: true }
			};

			updatedRows[alternativeRowIndex] = {
				...defaultRowCopy, // This is now the alternative
				selectedCdtCode: { ...defaultRowCopy.selectedCdtCode, default: false }
			};

			// Immediately synchronize alternativeRows after updating allRows
			synchronizeAlternativeRows2(visitIdForSwap, updatedRows);

			return { ...prevAllRows, [visitIdForSwap]: updatedRows };
		});
	};











	const handleEditClick = (visitId, currentDescription) => {
		setEditTableNameMode(visitId);
		setEditTableNameValue(currentDescription);
	};

	const handleEditChange = (e) => {
		setEditTableNameValue(e.target.value);
	};

	const handleEditBlur = (visitId) => {
		return () => {
			dispatch(onUpdateVisitDescription({
				visitId: visitId,
				newDescription: editTableNameValue
			}));
			// After saving, exit edit mode
			setEditTableNameMode(null);
		};
	};


	const collapseRows = (rows, rowIndex) => {
		// and its ID is used as parentId for its alternatives.

		const currentRow = rows[rowIndex];
		let nextIndex = rowIndex + 1;

		while (nextIndex < rows.length) {
			const row = rows[nextIndex];
			if (row.parentId === currentRow.id) {
				// This row is an alternative to the current default row, remove it.
				rows.splice(nextIndex, 1); // Remove the row and keep the index on the next row
			} else {
				// No longer finding alternative rows, break the loop.
				break;
			}
		}
	};


	const expandRows = (rows, rowIndex, visitId, currentRow, alternativeRows) => {
		let newRows = []; // Temporarily hold new rows to be added
		let addedCdtMapIds = new Set(); // To track which procedureToCdtMapIds have been added

		// Pre-populate the set with the current row's procedureToCdtMapId to avoid adding it as a duplicate
		addedCdtMapIds.add(currentRow.selectedCdtCode.procedureToCdtMapId);

		console.log(`debug-Expanding row at index: ${rowIndex} with visitId: ${visitId} and currentRow.id: ${currentRow.id}`);

		// Check if there are alternative rows for the current visitId
		const alternatives = alternativeRows[visitId];
		if (alternatives && alternatives.length > 0) {
			console.log(`debug-${alternatives.length} alternative(s) found for visitId: ${visitId}`);

			// Filter alternatives to include only those matching the currentRow's visitToProcedureMapId
			const matchingAlternatives = alternatives.filter(alt => alt.visitToProcedureMapId === currentRow.visitToProcedureMapId);

			// Loop through each matching alternative to check and add if not already processed
			matchingAlternatives.forEach((alt, altIndex) => {
				// Ensure that selectedCdtCode exists and the procedureToCdtMapId hasn't been added already
				if (alt.selectedCdtCode && !addedCdtMapIds.has(alt.selectedCdtCode.procedureToCdtMapId)) {
					// This alternative's procedureToCdtMapId is unique, proceed to add
					const altRowId = `alt-${rowIndex}-${altIndex}`; // Ensure unique ID for each alternative row
					console.log(`debug-Adding alternative row: ${altRowId} with procedureToCdtMapId: ${alt.selectedCdtCode.procedureToCdtMapId}`);
					newRows.push(createStaticRowForAltCode(alt, visitId, altRowId, currentRow.id));
					// Mark this procedureToCdtMapId as added to prevent future duplicates
					addedCdtMapIds.add(alt.selectedCdtCode.procedureToCdtMapId);
				}
			});
		}

		// Find the correct position to insert newRows
		let insertPosition = rowIndex + 1;
		while (insertPosition < rows.length && rows[insertPosition].parentId === currentRow.id) {
			console.log(`debug-Checking insert position: ${insertPosition} (parentId matches)`);
			insertPosition++;
		}

		console.log(`debug-Inserting new rows at position: ${insertPosition}`);
		rows.splice(insertPosition, 0, ...newRows);
	};


	const handleRedDropdownIconClick = (rowId) => {
		setAllRows((prevAllRows) => {
			const updatedAllRows = { ...prevAllRows };
			Object.entries(updatedAllRows).forEach(([visitId, rows]) => {
				const rowIndex = rows.findIndex(row => row.id === rowId);
				if (rowIndex === -1) return; // Skip if the row doesn't exist in this visit.

				// Toggle expansion without affecting other rows
				if (expandedRows.has(rowId)) {
					collapseRows(rows, rowIndex);
					setExpandedRows(prev => {
						const newExpanded = new Set(prev);
						newExpanded.delete(rowId);
						return newExpanded;
					});
				} else {
					expandRows(rows, rowIndex, visitId, rows[rowIndex], alternativeRows);
					setExpandedRows(prev => new Set(prev).add(rowId));
				}
			});
			return updatedAllRows;
		});
	};




	const createStaticRowForAltCode = (procedureToCdtMapDto, visitId, baseRowId, parentId) => {
		// Fallback to longDescription if userDescription is not present, and then to a default text
		const description = procedureToCdtMapDto.selectedCdtCode.userDescription ||
			procedureToCdtMapDto.selectedCdtCode.longDescription ||
			'Description not provided';
		const cdtCode = procedureToCdtMapDto.selectedCdtCode.code;
		const rowId = procedureToCdtMapDto.selectedCdtCode.procedureToCdtMapId;

		return {
			id: `static-alt-code-${visitId}-${rowId}`,
			procedureToCdtMapId: procedureToCdtMapDto.selectedCdtCode.procedureToCdtMapId,
			visitToProcedureMapId: procedureToCdtMapDto.visitToProcedureMapId,
			description: description,
			default: procedureToCdtMapDto.default,
			selectedCdtCode: procedureToCdtMapDto.selectedCdtCode,
			isStatic: true,
			extraRowInput: ["", cdtCode, description, "", ""],
			parentId
		};
	};


	const renderVisit = (visitId, index) => {
		console.log("Visit order when we get in renderVisit", visitOrder);
		const visitIdStr = String(visitId);

		const safeTreatmentPlanVisits = Array.isArray(treatmentPlan.visits) ? treatmentPlan.visits : [];

		const visit = safeTreatmentPlanVisits.find(v => String(v.visitId) === visitIdStr);

		if (!visit) {
			console.log("Visit not found:", visitId);
			return null;
		}

		// Use the existing description from the visit object
		const visitDescription = visit.description;

		const draggableKey = `visit-${visit.visitId}`;
		const headers = createHeaders();

		if (!allRows[visitIdStr]) {
			return null;
		}

		const tableRows = allRows[visitIdStr].map((row, rowIndex) => {
			return createTableRow(
				row,
				visit.visitId,
				headers,
				rowIndex,
				allRows[visitIdStr]
			);
		});
/*		const { ucrTotal, coPayTotal } = calculateTotalsForVisit(allRows[visitIdStr]);
		const { grandUcrTotal, grandCoPayTotal } = calculateGrandTotals(allRows);
		// Dispatch actions to update the totals in the store
		dispatch(setGrandUcrTotal(grandUcrTotal));
		dispatch(setGrandCoPayTotal(grandCoPayTotal));
		dispatch(setGrandTotalsReady(true));*/
		console.log("Visit before return", visit);
		return (
			<Draggable key={draggableKey} draggableId={`visit-${visit.visitId}`} index={index} type="table">
				{(provided) => (
					<div ref={provided.innerRef} {...provided.draggableProps} className={`visit-section ${index > 0 ? 'visit-separator' : ''}`}>
						<TableHeader {...provided.dragHandleProps}>
							{editTableNameMode === visit.visitId ? (
								<StandardTextfield
									value={editTableNameValue}
									onChange={handleEditChange}
									inputProps={{
										onBlur: handleEditBlur(visit.visitId),
									}}
									borderColor={UI_COLORS.purple}
									width="300px"
									autoFocus 
								/>
							) : (
								<>
									{visitDescription}
									<StyledEditIcon
										src={pencilEditIcon}
										alt="Edit Icon"
										onClick={() => handleEditClick(visit.visitId, visitDescription)}
									/>
								</>
							)}
						</TableHeader>
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
							onRedDropdownIconClick={handleRedDropdownIconClick}
							expandedRows={expandedRows}
							onSwapAltRow={handleSwapAltRow}
						/>
						{/*<PaymentTotals ucrTotal={ucrTotal} coPayTotal={coPayTotal} justifyContent="center" />*/}
					</div>

				)}
			</Draggable>
		);
	};

	return (
		<>
			{treatmentPlan && (
				<DragDropContext
					onDragEnd={(result) =>
						result.type === "table" ? onTableDragEnd(result) : onDragEnd(result)
					}

				>
					<Droppable
						droppableId="visits-droppable"
						type="table"
						direction="vertical"
					>
						{(provided) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								className="table-container"
							>
								{visitOrder.map((visitId, index) =>
									renderVisit(visitId, index)
								)}

								{provided.placeholder}

							</div>

						)}
					</Droppable>
				</DragDropContext>

			)}
			<div className="bottom-tx-plan-buttons">
				<div className="add-visit-btn-container" onClick={handleAddVisit}>
					+ Add Treatment Table
				</div>
			</div>
		</>
	);
};

TreatmentPlanOutput.propTypes = {
	treatmentPlan: PropTypes.shape({
		description: PropTypes.string,
		toothNumber: PropTypes.number,
		visits: PropTypes.arrayOf(
			PropTypes.shape({
				visitId: PropTypes.number.isRequired,
				description: PropTypes.string,
				cdtCodes: PropTypes.arrayOf(
					PropTypes.shape({
						code: PropTypes.string.isRequired,
						longDescription: PropTypes.string,
					})
				).isRequired,
			})
		).isRequired,
	}),
	includeExtraRow: PropTypes.bool,
	cdtCodes: PropTypes.arrayOf(
		PropTypes.shape({
			code: PropTypes.string.isRequired,
			longDescription: PropTypes.string,
		})
	).isRequired,
	imageIconSrc: PropTypes.string,
	hideToothNumber: PropTypes.bool,
};

TreatmentPlanOutput.defaultProps = {
	includeExtraRow: false,
	imageIconSrc: false,
};

export default TreatmentPlanOutput;
