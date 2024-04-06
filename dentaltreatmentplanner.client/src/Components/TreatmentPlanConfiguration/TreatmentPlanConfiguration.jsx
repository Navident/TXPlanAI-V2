import PropTypes from "prop-types";
import "./TreatmentPlanConfiguration.css";
import Table from "../Table/Table";
import { useState, useEffect, useRef } from "react";
import DropdownSearch from "../Common/DropdownSearch/DropdownSearch";
import StandardTextfield from "../Common/StandardTextfield/StandardTextfield";
import RoundedButton from "../../Components/Common/RoundedButton/RoundedButton";
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
import Alert from "../Common/Alert/Alert";
import {
	StyledRoundedBoxContainer,
	StyledAddButtonCellContainer,
	StyledClickableText,
	StyledEditIcon,
	StyledDeleteIcon,
	StyledEditDeleteIconsContainer,
	StyledSaveTextBtn,
	StyledLightGreyText,
	StyledRoundedBoxContainerInner,
	StyledSemiboldBlackTitle,
} from "../../GlobalStyledComponents";
import { UI_COLORS } from "../../Theme";
import pencilEditIcon from "../../assets/pencil-edit-icon.svg";
import { handleAddCdtCode, updateSubcategoryTreatmentPlan, setVisitOrder, setTreatmentPlans, selectVisitOrder, } from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import { selectIsSuperAdmin } from '../../Redux/ReduxSlices/User/userSlice';
import { useSelector, useDispatch } from "react-redux";
import { useCreateNewTreatmentPlanFromDefaultMutation, useUpdateTreatmentPlanMutation } from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansApiSlice';
import { useCombinedCdtCodes } from '../../Utils/Hooks/useCombinedCdtCodes';

const TreatmentPlanConfiguration = ({
	treatmentPlan,
	treatmentPlans,
	onAddVisit,
	onUpdateVisitsInTreatmentPlan,
	onDeleteVisit,
	showToothNumber,
	isInGenerateTreatmentPlanContext,
}) => {
	const dispatch = useDispatch();
	const visitOrder = useSelector(selectVisitOrder);
	const [allRows, setAllRows] = useState({});
	const [alternativeRows, setAlternativeRows] = useState({});
	const [deletedRowIds, setDeletedRowIds] = useState([]);
	const [deletedVisitIds, setDeletedVisitIds] = useState([]);
	const isInitialLoad = useRef(true);
	const [localUpdatedVisits, setLocalUpdatedVisits] = useState([]);
	const [alertInfo, setAlertInfo] = useState({
		open: false,
		type: "",
		message: "",
	});
	const { combinedCdtCodes, isLoading: combinedCodesLoading, error: combinedCodesError } = useCombinedCdtCodes();

	const [editingRowId, setEditingRowId] = useState(null);
	const [originalRowData, setOriginalRowData] = useState(null);
	const [editedRows, setEditedRows] = useState([]);
	const columnWidths = ["5%", "5%", "20%", "55%", "15%"];
	const isSuperAdmin = useSelector(selectIsSuperAdmin);
	const [dynamicRowValues, setDynamicRowValues] = useState({});
	const [expandedRows, setExpandedRows] = useState(new Set());
	const [createNewTreatmentPlanFromDefaultMutation, { isLoading: createPlanLoading, isSuccess, isError, error: createPlanError }] = useCreateNewTreatmentPlanFromDefaultMutation();
	const [updateTreatmentPlan, { isLoading: updatePlanLoading, isSuccess: updatePlanSuccess, isError: updatePlanIsError, error: updatePlanError }] = useUpdateTreatmentPlanMutation();


	const handleCloseAlert = () => {
		setAlertInfo({ ...alertInfo, open: false });
	};

	useEffect(() => {
		console.log("current treatmentPlan:", treatmentPlan);
	}, [treatmentPlan]);


	useEffect(() => {
		console.log("allRows:", allRows);
	}, [allRows]);


	useEffect(() => {
		console.log("dynamicRowValues state:", dynamicRowValues);
	}, [dynamicRowValues]);

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

					(visit.procedures || []).forEach((procedureMap, procIndex) => {
						(procedureMap.procedureToCdtMaps || []).forEach((cdtMap, cdtIndex) => {
							const row = createStaticRows(cdtMap, visitId, `${procIndex}-${cdtIndex}`, procedureMap);

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
	}, [treatmentPlan]);



	useEffect(() => {
		console.log("alternativeRows:", alternativeRows);
	}, [alternativeRows]);

	useEffect(() => {
		return () => {
			dispatch(setTreatmentPlans([]));
			// Reset treatmentPlans when component unmounts
		
		};
	}, [dispatch]);

	useEffect(() => {
		setLocalUpdatedVisits(treatmentPlan.visits);
	}, [treatmentPlan.visits]);

	const createStaticRows = (cdtMap, visitId, index, procedureMap) => {
		const extraRowInput = showToothNumber
			? [procedureMap.toothNumber, cdtMap.code, cdtMap.longDescription]
			: [cdtMap.code, cdtMap.longDescription];

		return {
			id: `static-${visitId}-${index}`,
			visitToProcedureMapId: procedureMap.visitToProcedureMapId,
			description: cdtMap.longDescription,
			default: cdtMap.default,
			selectedCdtCode: cdtMap,
			isStatic: true,
			extraRowInput
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

		const extraRowInput = showToothNumber
			? [treatmentPlan.toothNumber, dropdownSearchElement]
			: [dropdownSearchElement];

		return {
			id: initialRowId,
			description: "",
			selectedCdtCode: null,
			extraRowInput,
		};
	};

	//
	const convertToStaticRow = (
		currentRow,
		visitId,
		selectedCdtCode,
		originalDescription,
		isNewRow = false 
	) => {
		// Prioritize using the originalDescription if provided
		const description =
			originalDescription ||
			(selectedCdtCode
				? selectedCdtCode.longDescription
				: currentRow.description);

		return {
			...currentRow,
			id: `static-${visitId}-${Date.now()}`,
			isStatic: true,
			procedureToCdtMapId: isNewRow ? null : currentRow.selectedCdtCode.procedureToCdtMapId,
			selectedCdtCode: selectedCdtCode || currentRow.selectedCdtCode,
			description, 
			default: true,
			extraRowInput: showToothNumber
				? [
						treatmentPlan.toothNumber,
						selectedCdtCode
							? selectedCdtCode.code
							: currentRow.selectedCdtCode?.code,
						description,
				  ]
				: [
						selectedCdtCode
							? selectedCdtCode.code
							: currentRow.selectedCdtCode?.code,
						description,
				  ],
		};
	};

	const convertToDynamicRow = (currentRow, visitId) => {
		const dropdownSearchElement = createCDTCodeDropdown(
			currentRow.id,
			visitId,
			combinedCdtCodes,
			handleSelect,
			currentRow.selectedCdtCode
		);

		const extraRowInput = showToothNumber
			? [
					currentRow.selectedCdtCode
						? currentRow.selectedCdtCode.toothNumber
						: "",
					dropdownSearchElement,
			  ]
			: [dropdownSearchElement];

		return {
			...currentRow,
			id: `dynamic-${visitId}-${Date.now()}`,
			extraRowInput,
			isStatic: false,
			isEditing: true, // Indicate this row is being edited
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

				// Check if the currentRow already has a selectedCdtCode with a ProcedureToCdtMapId
				const procedureToCdtMapId = currentRow.selectedCdtCode?.procedureToCdtMapId;

				const updatedCdtCodeObj = {
					...cdtCodeObj,
					procedureToCdtMapId: procedureToCdtMapId, 
				};

				// Update the current dynamic row with the modified selected CDT code
				rows[rowIndex] = {
					...currentRow,
					selectedCdtCode: updatedCdtCodeObj, // Use the updated CDT code object
					description: cdtCodeObj.longDescription,
					default: currentRow.default,
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
			default: true,
			extraRowInput: showToothNumber
				? [treatmentPlan.toothNumber, "", ""]
				: ["", ""],
		};
	};

	function addNewRow(visitId, rowId) {
		setAllRows((prevAllRows) => {
			const rowsForVisit = prevAllRows[visitId] || [];
			const rowIndexToConvert = rowsForVisit.findIndex(row => row.id === rowId);
			if (rowIndexToConvert === -1) return prevAllRows; // Row not found, return early
			const newRows = [...rowsForVisit];
			const rowToConvert = rowsForVisit[rowIndexToConvert];

			let staticRow;
			if (rowToConvert.default === false) {
				staticRow = convertToStaticRowForAltCode(
					rowToConvert.selectedCdtCode,
					visitId,
					rowId,
					rowsForVisit,
					dynamicRowValues
				);
			} else {
				staticRow = convertToStaticRow(
					rowToConvert,
					visitId,
					rowToConvert.selectedCdtCode,
					undefined,
					true
				);
			}

			// Decide which dynamic row to use based on whether the row to convert is a default procedure or not
			const finalDynamicRow = rowToConvert.default === false
				? createDynamicRowForAltCode(visitId, rowToConvert) // If false
				: createDynamicRowUponAddClick(visitId); // If true or undefined


			// Replace the row to be converted with the static row
			newRows[rowIndexToConvert] = staticRow;

			// Add the appropriate dynamic row right after the static row
			newRows.splice(rowIndexToConvert + 1, 0, finalDynamicRow);

			// Reconstruct the state with the updated rows for this visit
			const updatedAllRows = { ...prevAllRows, [visitId]: newRows };

			synchronizeAlternativeRows(visitId, updatedAllRows);

			return updatedAllRows;
		});
	}










	function createAddButtonCell(visitId, rowId, hasAltInId = false) {
		// If hasAltInId is true, use grey; otherwise, use purple.
		const backgroundColor = hasAltInId ? UI_COLORS.light_grey2 : UI_COLORS.purple;
		return (
			<StyledAddButtonCellContainer>
				<RoundedButton
					text="Add"
					backgroundColor={backgroundColor}
					textColor="white"
					border={false}
					borderRadius="4px"
					height="39px"
					width="150px"
					onClick={() => addNewRow(visitId, rowId)}
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
		if (!result.destination) {
			return;
		}

		if (result.type === "row") {
			const tableId = result.source.droppableId.replace("droppable-table-", "");
			const rows = allRows[tableId];

			if (!rows) {
				return;
			}

			const reorderedRows = reorder(
				rows,
				result.source.index,
				result.destination.index
			);

			setAllRows((prevRows) => ({
				...prevRows,
				[tableId]: reorderedRows,
			}));
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

	const handleDeleteVisit = (visitId) => {
		// Update the visitOrder to remove the visit
		setVisitOrder((prevOrder) => prevOrder.filter((id) => id !== visitId));
		// Update allRows to remove the rows associated with the visit
		setAllRows((prevRows) => {
			const updatedRows = { ...prevRows };
			delete updatedRows[visitId];
			return updatedRows;
		});
		setDeletedVisitIds((prevIds) => {
			const newDeletedVisitIds = [...prevIds, visitId];
			console.log(
				"Deleted visit added, new deletedVisitIds:",
				newDeletedVisitIds
			);
			return newDeletedVisitIds;
		});
		onDeleteVisit(treatmentPlan.treatmentPlanId, visitId);
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
		const updatedVisits = treatmentPlan.visits.map((visit) => {
			const newOrderIndex = newOrder.indexOf(visit.visitId);
			return { ...visit, visitNumber: newOrderIndex + 1 };
		});

		onUpdateVisitsInTreatmentPlan(treatmentPlan.treatmentPlanId, updatedVisits);

		reorderAllRows(newOrder);
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




	const createNewTreatmentPlanFromDefault = async (
		treatmentPlan,
		allRows,
		visitOrder
	) => {
		try {
			const newTreatmentPlan = await createNewTreatmentPlanFromDefaultMutation({ treatmentPlan, allRows, visitOrder }).unwrap();
			// Show success alert
			setAlertInfo({
				open: true,
				type: "success",
				message: "Your changes have been saved successfully!",
			});
			return newTreatmentPlan;
		} catch (error) {
			console.error("Error in creating new treatment plan:", error);
		}
	};



	const handleUpdateTreatmentPlan = async () => {
		console.log("Treatment Plan before updating:", treatmentPlan);
		try {
			let newTreatmentPlanCreated = false;

			if (treatmentPlan.facilityId === null && !isSuperAdmin) {
				await createNewTreatmentPlanFromDefault(treatmentPlan, allRows, visitOrder);
				newTreatmentPlanCreated = true;
			}

			const tempVisitIds = visitOrder.filter(visitId => String(visitId).startsWith("temp-"));
			const createVisitPromises = tempVisitIds.map(tempVisitId => {
				const visitData = mapToCreateVisitDto(treatmentPlan, allRows, tempVisitId);
				return createVisit(visitData, tempVisitId);
			});

			const createdVisits = await Promise.all(createVisitPromises);
			const visitIdMap = createdVisits.reduce((acc, visitResponse) => {
				acc[visitResponse.tempVisitId] = visitResponse.visit.visitId;
				return acc;
			}, {});

			const deepCopyAllRows = JSON.parse(JSON.stringify(allRows));
			Object.keys(deepCopyAllRows).forEach(visitId => {
				if (visitIdMap[visitId]) {
					deepCopyAllRows[visitIdMap[visitId]] = deepCopyAllRows[visitId];
					delete deepCopyAllRows[visitId];
				}
			});

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

			setLocalUpdatedVisits(updatedVisits);
			setVisitOrder(updatedVisitOrder);
			setAllRows(deepCopyAllRows);

			const updateDto = mapToUpdateTreatmentPlanDto(treatmentPlan, deepCopyAllRows, alternativeRows, updatedVisitOrder, deletedRowIds, deletedVisitIds, editedRows);
			const updatedTreatmentPlan = await updateTreatmentPlan({ id: treatmentPlan.treatmentPlanId, updatedData: updateDto }).unwrap();

			dispatch(updateSubcategoryTreatmentPlan(updatedTreatmentPlan));
			onUpdateVisitsInTreatmentPlan(treatmentPlan.treatmentPlanId, updatedVisits);

			console.log("Updated Treatment Plan:", updatedTreatmentPlan);

			setAlertInfo({
				open: true,
				type: "success",
				message: "Your changes have been saved successfully!",
			});
		} catch (error) {
			console.error("Error updating treatment plan:", error);
		}
	};


	const getCdtCodeDetailsByCdtCodeId = (cdtCodeId) => {
		return combinedCdtCodes.find(c => c.cdtCodeId === cdtCodeId);
	};

	//const transformVisitCdtCodeMapsToCdtCodes = (visit) => {
	//	return visit.visitCdtCodeMaps.map(cdtCodeMap => {
	//		const cdtCodeDetails = getCdtCodeDetailsByCdtCodeId(cdtCodeMap.cdtCodeId);
	//		return {
	//			cdtCodeId: cdtCodeMap.cdtCodeId,
	//			code: cdtCodeDetails?.code,
	//			longDescription: cdtCodeDetails?.longDescription,a
	//			createdAt: cdtCodeMap.createdAt,
	//			modifiedAt: cdtCodeMap.modifiedAt,
	//			order: cdtCodeMap.order,
	//			procedureTypeId: cdtCodeMap.procedureTypeId,
	//			toothNumber: cdtCodeMap.toothNumber,
	//			visitCdtCodeMapId: cdtCodeMap.visitCdtCodeMapId,
	//			visitId: cdtCodeMap.visitId,
	//		};
	//	});
	//};

	//const adjustUpdatedTreatmentPlanStructure = (updatedTreatmentPlan, originalTreatmentPlan) => {
	//	// Reinsert the category names from the original treatment plan
	//	updatedTreatmentPlan.procedureCategoryName = originalTreatmentPlan.procedureCategoryName;
	//	updatedTreatmentPlan.procedureSubCategoryName = originalTreatmentPlan.procedureSubCategoryName;

	//	updatedTreatmentPlan.visits.forEach(visit => {
	//		visit.cdtCodes = transformVisitCdtCodeMapsToCdtCodes(visit);
	//		delete visit.visitCdtCodeMaps;
	//	});
	//};


	const lockDimensions = () => {
		const tables = document.querySelectorAll(".tx-table");
		tables.forEach((table) => {
			const rows = table.querySelectorAll("tr");
			rows.forEach((row) => {
				const cells = row.querySelectorAll("td, th");
				cells.forEach((cell) => {
					const computedStyle = window.getComputedStyle(cell);
					cell.style.width = `${computedStyle.width}`;
					cell.style.minWidth = `${computedStyle.width}`;
				});
			});
		});
	};

	const createHeaders = () => {
		let headers = showToothNumber
			? ["Tooth #", "CDT Code", "Description"]
			: ["", "CDT Code", "Description"];
		return headers;
	};

	const constructStaticRowData = (row) => {
		if (showToothNumber) {
			if (!isInGenerateTreatmentPlanContext) {
				return [
					row.extraRowInput[0],
					row.extraRowInput[1],
					row.extraRowInput[2],
				];
			}
			return [row.extraRowInput[0], row.extraRowInput[1], row.extraRowInput[2]]; // Tooth number, CDT code, Description
		} else {
			if (!isInGenerateTreatmentPlanContext) {
				return ["", row.extraRowInput[0], row.extraRowInput[1]];
			}
			return ["", row.extraRowInput[0], row.extraRowInput[1]]; // Placeholder for Tooth number, CDT code, Description shifted
		}
	};

	const constructDynamicRowData = (row, visitId) => {
		const dropdownKey = `dropdown-${row.id}`;
		const cdtDropdown = (
			<DropdownSearch
				key={dropdownKey}
				items={combinedCdtCodes}
				selectedItem={row.selectedCdtCode}
				onSelect={(selectedCode) => handleSelect(selectedCode, visitId, row.id)}
				itemLabelFormatter={(cdtCode) =>
					`${cdtCode.code} - ${cdtCode.longDescription}`
				}
				valueKey="code"
				labelKey="longDescription"
			/>
		);

		// Check if the row has textFieldProps indicating it's a dynamic row requiring a TextField
		if (row.textFieldProps) {
			// Retrieve the current text field value from dynamicRowValues
			// This ensures the text field displays the most up-to-date value
			const textFieldValue = dynamicRowValues[row.id] || "";

			const textField = (
				<StandardTextfield
					key={`textfield-${row.id}`}
					label={row.textFieldProps.label}
					value={textFieldValue}  // Use the dynamically updated value
					onChange={(e) => handleDescriptionChange(e, visitId, row.id)}
					borderColor={row.textFieldProps.borderColor}
					width={row.textFieldProps.width}
				/>
			);

			// Return the array including the TextField for rendering 
			return showToothNumber ? ["", cdtDropdown, textField] : ["", cdtDropdown, textField];
		}

		// For non-dynamic rows
		return showToothNumber ? ["", cdtDropdown, row.description] : ["", cdtDropdown, row.description];
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

	const synchronizeAlternativeRows = (visitId, updatedAllRows) => {
		setAlternativeRows(prevAlternativeRows => {
			// Retrieve existing alternative rows for the visit
			const existingAlternativeRows = prevAlternativeRows[visitId] || [];

			// Identify new or updated non-default rows from updatedAllRows
			const newOrUpdateAlternativeRows = updatedAllRows[visitId].filter(row =>
				!row.default && row.selectedCdtCode != null
			);

			// Create a merged list of unique alternative rows
			const mergedAlternativeRowsMap = new Map(existingAlternativeRows.map(row => [row.procedureToCdtMapId, row]));

			// Update or add new alternative rows into the map to ensure uniqueness
			newOrUpdateAlternativeRows.forEach(row => {
				mergedAlternativeRowsMap.set(row.procedureToCdtMapId, row);
			});

			return {
				...prevAlternativeRows,
				[visitId]: Array.from(mergedAlternativeRowsMap.values()), // Convert back to array
			};
		});
	};




	const handleDoneEdit = (rowId, visitId) => {
		setEditingRowId(null);

		let updatedRowForAlt = null; // This will hold the updated row if it's an alternative row

		// First, update allRows
		setAllRows((prevAllRows) => {
			const rows = [...prevAllRows[visitId]];

			const updatedRows = rows.map((row) => {
				if (row.id === rowId) {
					const updatedRow = row.default ?
						convertToStaticRow(row, visitId, row.selectedCdtCode, row.description, false) :
						convertToStaticRowForAltCode(row.selectedCdtCode, visitId, rowId, rows, dynamicRowValues);

					if (!row.default) {
						updatedRowForAlt = updatedRow; // Store the updated alternative row
					}
					return updatedRow;
				}
				return row;
			});

			// Here's the updated return statement with a callback to ensure we have the updated state
			const updatedAllRows = {
				...prevAllRows,
				[visitId]: updatedRows,
			};

			// Synchronize alternativeRows right after updating allRows
			synchronizeAlternativeRows(visitId, updatedAllRows); // Call to synchronize alternativeRows

			return updatedAllRows;
		});

		setOriginalRowData(null);
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
		const isNotLastRow = index !== allRows.length - 1;
		if (row.isStatic && isNotLastRow) {
			return (
				<StyledEditDeleteIconsContainer>
					<StyledEditIcon
						src={pencilEditIcon}
						alt="Edit Icon"
						onClick={() => row.default ? handleEditRow(row.id, visitId) : handleEditAlternativeRow(row.id, visitId)}
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
		const isStaticRow = row.isStatic;
		const alternatives = alternativeRows[visitId] || [];
		const isDefaultRow = row.selectedCdtCode && 'default' in row.selectedCdtCode ? row.selectedCdtCode.default :
			'default' in row ? row.default : null;
		const hasAltChildren = alternatives.some(alt => alt.visitToProcedureMapId === row.visitToProcedureMapId);

		const hasAltInId = row.id.includes('alt');
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
				lastCellContent = createAddButtonCell(visitId, row.id, hasAltInId); // For other dynamic rows
			}
		}

		rowData.push(lastCellContent);

		return {
			id: row.id,
			data: rowData,
			backgroundColor: null,
			parentId: row.parentId,
			default: isDefaultRow,
			hasAltChildren, 
		};
	};

	const handleEditRow = (rowId, visitId) => {
		// Directly access the rows for the specific visitId
		const rows = allRows[visitId];
		const rowIndex = rows.findIndex((row) => row.id === rowId);

		if (rowIndex !== -1) {
			const currentRow = rows[rowIndex];

			// Before converting the row, update dynamicRowValues with the current description
			const initialDescription = currentRow.description || "";
			setDynamicRowValues(prevValues => ({
				...prevValues,
				[currentRow.id]: initialDescription,
			}));

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

	const handleEditAlternativeRow = (rowId, visitId) => {
		// Directly access the rows for the specific visitId
		const rows = allRows[visitId];
		const rowIndex = rows.findIndex((row) => row.id === rowId);

		if (rowIndex !== -1) {
			const currentRow = rows[rowIndex];

			// Before converting the row, update dynamicRowValues with the current description
			const initialDescription = currentRow.description || "";
			setDynamicRowValues(prevValues => ({
				...prevValues,
				[currentRow.id]: initialDescription,
			}));

			// Set originalRowData with the current state of the row before making it dynamic for editing
			setOriginalRowData({ ...currentRow });

			// Convert the current row to a dynamic row for editing
			const dynamicRow = convertToDynamicRowForAltCode(currentRow, visitId);

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

	const handleAddVisit = (customVisitId = null, groupedRows = [], updatedAllRows = null) => {
		const visitId = `temp-${Date.now()}`;
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
	};




	const collapseRows = (rows, rowIndex) => {
		// Remove all related alternative procedure rows
		const rowsToRemove = rows.slice(rowIndex + 1).findIndex(row =>
			!row.id.startsWith("dynamic-alt-code") && !row.id.startsWith("static-alt-code")
		);
		const removeCount = rowsToRemove === -1 ? rows.length - rowIndex - 1 : rowsToRemove;
		rows.splice(rowIndex + 1, removeCount);
	};


	const expandRows = (rows, rowIndex, visitId, currentRow, alternativeRows) => {
		let newRows = []; // Temporarily hold new rows to be added

		// Check if there are alternative rows for the current visitId
		const alternatives = alternativeRows[visitId];
		if (alternatives && alternatives.length > 0) {
			// Filter alternative rows that match the current default row's visitToProcedureMapId
			const matchingAlternatives = alternatives.filter(alt => alt.visitToProcedureMapId === currentRow.visitToProcedureMapId);
			// Create a static row for each matching alternative
			matchingAlternatives.forEach((altRow, index) => {
				const altRowId = `alt-${rowIndex}-${index}`;
				newRows.push(createStaticRowForAltCode(altRow, visitId, altRowId, currentRow.id));
			});
		}

		// Create a new dynamic row for alternative CDT code selection
		const dynamicAltRow = createDynamicRowForAltCode(visitId, currentRow);
		newRows.push(dynamicAltRow);

		// Insert new rows into the correct position
		rows.splice(rowIndex + 1, 0, ...newRows); // Use spread operator to add all new rows at once
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
		const description = procedureToCdtMapDto.selectedCdtCode.userDescription || 'Description not provided';
		const cdtCode = procedureToCdtMapDto.selectedCdtCode.code; 

		const extraRowInput = [
			cdtCode,
			description
		];

		return {
			id: `static-alt-code-${visitId}-${baseRowId}`,
			procedureToCdtMapId: procedureToCdtMapDto.selectedCdtCode.procedureToCdtMapId,
			visitToProcedureMapId: procedureToCdtMapDto.visitToProcedureMapId,
			description: description,
			default: procedureToCdtMapDto.default,
			selectedCdtCode: procedureToCdtMapDto.selectedCdtCode,
			isStatic: true,
			extraRowInput,
			parentId
		};
	};


	const handleInputChange = (visitId, rowId, field, value) => {
		setDynamicRowValues(prevValues => ({
			...prevValues,
			[rowId]: value, // Directly update the value for the dynamic row
		}));
	};

	const handleDescriptionChange = (e, visitId, rowId) => {
		const newDescription = e.target.value;
		handleInputChange(visitId, rowId, 'description', newDescription);
	};

	const convertToDynamicRowForAltCode = (currentRow, visitId, dynamicRowValues) => {
		dynamicRowValues = dynamicRowValues || {}; 
		const textFieldValue = dynamicRowValues[currentRow.id] || currentRow.description || "not found";

		const dropdownSearchElement = createCDTCodeDropdown(
			currentRow.id,
			visitId,
			combinedCdtCodes,
			handleSelect,
			currentRow.selectedCdtCode
		);

		const textFieldProps = {
			label: "",
			borderColor: UI_COLORS.purple,
			width: "auto",
		};

		const extraRowInput = showToothNumber
			? [
				currentRow.selectedCdtCode
					? currentRow.selectedCdtCode.toothNumber
					: "",
				dropdownSearchElement,
			]
			: [dropdownSearchElement];

		return {
			...currentRow,
			id: currentRow.id,
			tempId: currentRow.tempId,
			extraRowInput,
			isStatic: false,
			isEditing: true, // Indicate this row is being edited
			textFieldProps: {
				...textFieldProps,
				value: textFieldValue,
			},
		};
	};

	const createDynamicRowForAltCode = (visitId, currentRow, activeParentRowId) => {
		const dynamicRowId = `dynamic-alt-code-${visitId}-${currentRow.id}-${Date.now()}`;
		const tempId = `temp-${Date.now()}`;
		return {
			id: dynamicRowId,
			tempId,
			default: false,
			parentRowId: activeParentRowId,
			visitToProcedureMapId: currentRow.visitToProcedureMapId,
			textFieldProps: {
				label: "",
				borderColor: UI_COLORS.purple,
				width: "auto"
			},
			selectedCdtCode: null,
		};
	};


const convertToStaticRowForAltCode = (selectedCdtCode, visitId, rowId, rowsForVisit, dynamicRowValues) => {
    const rowGettingUpdated = rowsForVisit.find(row => row.id === rowId);
    const userDescription = dynamicRowValues[rowId] || 'Description not provided';

    // Determine if we're creating a new row or updating an existing one
    const isNewRow = !rowGettingUpdated || rowGettingUpdated.tempId;

    const newStaticProcedureCdtRow = {
        id: isNewRow ? `static-alt-code-${Date.now()}` : rowId,
        tempId: isNewRow ? `temp-${Date.now()}` : undefined,
        isStatic: true,
        visitToProcedureMapId: rowGettingUpdated?.visitToProcedureMapId,
		description: userDescription,
		default: false,
		selectedCdtCode: {
			procedureToCdtMapId: isNewRow ? null : rowGettingUpdated?.selectedCdtCode.procedureToCdtMapId, // Conditional assignment based on isNewRow
            cdtCodeId: selectedCdtCode.cdtCodeId,
            code: selectedCdtCode.code,
            //longDescription: selectedCdtCode.longDescription,
            default: false,
            userDescription: userDescription 
        },
        extraRowInput: [
            ...(rowGettingUpdated?.toothNumber ? [rowGettingUpdated.toothNumber] : []),
            selectedCdtCode.code,
            userDescription
        ],
    };

    return newStaticProcedureCdtRow;
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

		return (
			<Draggable
				key={draggableKey}
				draggableId={`visit-${visit.visitId}`}
				index={index}
				type="table"
			>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						className={`visit-section ${index > 0 ? "visit-separator" : ""}`}
					>
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
							columnWidths={columnWidths}
							displayCheckmark={false}
							onRedDropdownIconClick={handleRedDropdownIconClick}
							expandedRows={expandedRows}
							insideTxConfig={true}
						/>
					</div>
				)}
			</Draggable>
		);
	};

	return (
		<>
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
					onDragEnd={(result) =>
						result.type === "table" ? onTableDragEnd(result) : onDragEnd(result)
					}
					onBeforeDragStart={lockDimensions}
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
				<span
					onClick={handleUpdateTreatmentPlan}
					className="save-treatment-plan-text-btn"
				>
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

TreatmentPlanConfiguration.defaultProps = {
	includeExtraRow: false,
	imageIconSrc: false,
};

export default TreatmentPlanConfiguration;
