import PropTypes from "prop-types";
import "./TreatmentPlanConfiguration.css";
import Table from "../Table/Table";
import { useState, useEffect, useRef } from "react";
import DropdownSearch from "../Common/DropdownSearch/DropdownSearch";
import StandardTextfield from "../Common/StandardTextfield/StandardTextfield";
import RoundedButton from "../../Components/Common/RoundedButton/RoundedButton";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import {
	updateTreatmentPlan,
	createVisit,
	createNewProcedures,
	handleCreateNewTreatmentPlanFromDefault,
	handleCreateNewTreatmentPlanForPatient,
} from "../../ClientServices/apiService";
import {
	mapToUpdateTreatmentPlanDto,
	mapToCreateVisitDto,
} from "../../Utils/mappingUtils";
import { sortTreatmentPlan } from "../../Utils/helpers";
import deleteIcon from "../../assets/delete-x.svg";
import dragIcon from "../../assets/drag-icon.svg";
import Alert from "../Common/Alert/Alert";
import { useBusiness } from "../../Contexts/BusinessContext/useBusiness";
import { useMemo } from "react";
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
import { useSelector, useDispatch, useStore } from "react-redux";
import { selectCombinedCdtCodes, selectAlternativeProcedures, addAlternativeProcedure, deleteAlternativeProcedure, updateAlternativeProcedure, updateAlternativeProcedureVisitCdtCodeMapIds } from '../../Redux/ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice';

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
	const [deletedRowIds, setDeletedRowIds] = useState([]);
	const [deletedVisitIds, setDeletedVisitIds] = useState([]);
	const isInitialLoad = useRef(true);
	const [localUpdatedVisits, setLocalUpdatedVisits] = useState([]);
	const [alertInfo, setAlertInfo] = useState({
		open: false,
		type: "",
		message: "",
	});
	const { facilityCdtCodes, defaultCdtCodes } = useBusiness();
	const combinedCdtCodes = useMemo(
		() => [...defaultCdtCodes, ...facilityCdtCodes],
		[defaultCdtCodes, facilityCdtCodes]
	);
	const [editingRowId, setEditingRowId] = useState(null);
	const [originalRowData, setOriginalRowData] = useState(null);
	const [editedRows, setEditedRows] = useState([]);
	const columnWidths = ["5%", "5%", "20%", "55%", "15%"];
	const isSuperAdmin = useSelector(selectIsSuperAdmin);
	const combinedFacilityDefaultCdtCodes = useSelector(selectCombinedCdtCodes);
	const alternativeProcedures = useSelector(selectAlternativeProcedures);
	const [dynamicRowValues, setDynamicRowValues] = useState({});
	const [activeParentRow, setActiveParentRow] = useState(null);
	const store = useStore();
	const handleCloseAlert = () => {
		setAlertInfo({ ...alertInfo, open: false });
	};

	useEffect(() => {
		console.log("current treatmentPlan:", treatmentPlan);
	}, [treatmentPlan]);

	useEffect(() => {
		console.log("activeParentRow:", activeParentRow);
	}, [activeParentRow]);

	useEffect(() => {
		console.log("alternativeProcedures: ", alternativeProcedures);
	}, [alternativeProcedures]);

	useEffect(() => {
		console.log("allRows:", allRows);
	}, [allRows]);

	useEffect(() => {
		console.log("isSuperAdmin state:", isSuperAdmin);
	}, [combinedCdtCodes]);

	useEffect(() => {
		console.log("dynamicRowValues state:", dynamicRowValues);
	}, [dynamicRowValues]);

	useEffect(() => {
		console.log("we went in the initial load conditional");
		const visits = treatmentPlan.visits || [];
		const newAllRows = visits.reduce((acc, visit, index) => {
			const visitId = visit.visitId;
			const cdtCodes = Array.isArray(visit.cdtCodes) ? visit.cdtCodes : [];
			const staticRows = cdtCodes.map((visitCdtCodeMap, cdtIndex) =>
				createStaticRows(visitCdtCodeMap, visitId, cdtIndex)
			);
			const initialRowId = `initial-${visitId}`;
			acc[visitId] = [
				...staticRows,
				createDynamicRowv1(visitId, initialRowId),
			];
			return acc;
		}, {});

		setAllRows(newAllRows);
		dispatch(setVisitOrder(visits.map((visit) => visit.visitId)));

		// Check and expand rows based on activeParentRow after initial setup
		if (activeParentRow) {
			setAllRows((prevAllRows) => {
				const updatedAllRows = { ...prevAllRows };
				Object.entries(updatedAllRows).forEach(([visitId, rows]) => {
					const rowIndex = rows.findIndex(row => row.id === activeParentRow);
					if (rowIndex !== -1) {
						expandRows(rows, rowIndex, visitId, rows[rowIndex], alternativeProcedures);
					}
				});
				return updatedAllRows;
			});
		}


		isInitialLoad.current = false;
	}, [treatmentPlan, facilityCdtCodes, defaultCdtCodes, activeParentRow, alternativeProcedures]);



	useEffect(() => {
		return () => {
			dispatch(setTreatmentPlans([]));
			// Reset treatmentPlans when component unmounts
		
		};
	}, [dispatch]);

	useEffect(() => {
		setLocalUpdatedVisits(treatmentPlan.visits);
	}, [treatmentPlan.visits]);

	const createStaticRows = (cdtCode, visitId, index) => {
		const extraRowInput = showToothNumber
			? [cdtCode.toothNumber, cdtCode.code, cdtCode.longDescription]
			: [cdtCode.code, cdtCode.longDescription];

		return {
			id: `static-${visitId}-${index}`,
			visitCdtCodeMapId: cdtCode.visitCdtCodeMapId,
			description: cdtCode.longDescription,
			selectedCdtCode: cdtCode,
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

	const createNewCdtCodeObject = (selectedCdtCode, visitId) => {
		return {
			cdtCodeId: selectedCdtCode.cdtCodeId,
			code: selectedCdtCode.code,
			longDescription: selectedCdtCode.longDescription,
			order: 0,
			orderWithinVisit: 0,
			originLineIndex: 0,
			procedureTypeId: null,
			toothNumber: null,
			visitId: visitId,
		};
	};

	const convertToStaticRow = (
		currentRow,
		visitId,
		selectedCdtCode,
		originalDescription
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
			visitCdtCodeMapId: null,
			selectedCdtCode: selectedCdtCode || currentRow.selectedCdtCode,
			description, 
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

				// Update the current dynamic row with the selected CDT code
				rows[rowIndex] = {
					...currentRow,
					selectedCdtCode: cdtCodeObj,
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

			const rowToConvert = rowsForVisit[rowIndexToConvert];

			const tempId = rowToConvert.tempId;
			// Determine if it's an alt row based on the rowId pattern
			const isAltRow = rowId.startsWith("dynamic-alt-code");

			// Convert the targeted dynamic row to a static row
			const staticRow = isAltRow
				? convertToStaticRowForAltCode(
					rowToConvert.selectedCdtCode, 
					visitId,
					rowToConvert.id,
					rowsForVisit,
					dynamicRowValues,
					tempId,
					"create"
				)
				: convertToStaticRow(
					rowToConvert,
					visitId,
					rowToConvert.selectedCdtCode
				);

			// Conditionally create a new dynamic row based on the type
			const newDynamicRow = isAltRow
				? createDynamicRowForAltCode(visitId, rowToConvert)
				: createDynamicRowUponAddClick(visitId);

			// Construct the new array of rows
			let newRows = [...rowsForVisit];
			newRows.splice(rowIndexToConvert, 1, staticRow, newDynamicRow); // Replace and add new

			return {
				...prevAllRows,
				[visitId]: newRows,
			};
		});
	}



	function createAddButtonCell(visitId, rowId, isAltRow = false) {
		const backgroundColor = isAltRow ? UI_COLORS.altPurple : UI_COLORS.purple;
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

	const handleDeleteRow = (visitId, rowId, row) => {
		const isAltCodeRow = row.id.startsWith('dynamic-alt-code') || row.id.startsWith('static-alt-code');

		if (isAltCodeRow) {
			// Check if the row represents a newly created or an existing alternative procedure
			const tempId = row.tempId;
			const alternativeProcedureId = row.alternativeProcedureId;

			// Dispatch the delete action using either tempId or alternativeProcedureId
			if (tempId || alternativeProcedureId) {
				dispatch(deleteAlternativeProcedure({ tempId, alternativeProcedureId }));
			}
		}

		setAllRows((prevRows) => {
			const updatedRows = prevRows[visitId].filter((row) => row.id !== rowId);
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
			const newTreatmentPlan = await handleCreateNewTreatmentPlanFromDefault(
				treatmentPlan,
				allRows,
				visitOrder
			);
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

	function buildNewVisitCdtCodeMapIdMapping(oldTreatmentPlan, newTreatmentPlan) {
		const newVisitCdtCodeMapIdMapping = new Map();
		console.log("old treatment plan: ", oldTreatmentPlan);
		console.log("new treatment plan: ", newTreatmentPlan);

		// Ensure the new treatment plan has visits defined
		if (!newTreatmentPlan.visits) {
			console.error("New treatment plan does not contain any visits.");
			return newVisitCdtCodeMapIdMapping;
		}

		// Create a composite key of cdtCodeId and visit index for the new treatment plan for easy lookup
		const newCodesMap = new Map();
		newTreatmentPlan.visits.forEach((visit, visitIndex) => {
			if (visit.visitCdtCodeMaps) { // Adjusted to visitCdtCodeMaps
				visit.visitCdtCodeMaps.forEach(cdtCodeMap => {
					const key = `${cdtCodeMap.cdtCodeId}-${visitIndex}`;
					newCodesMap.set(key, cdtCodeMap.visitCdtCodeMapId);
				});
			}
		});

		// Ensure the old treatment plan has visits defined
		if (!oldTreatmentPlan.visits) {
			console.error("Old treatment plan does not contain any visits.");
			return newVisitCdtCodeMapIdMapping;
		}

		// Iterate over the old treatment plan to find matches in the new treatment plan using the composite key
		oldTreatmentPlan.visits.forEach((visit, visitIndex) => {
			if (visit.cdtCodes) {
				visit.cdtCodes.forEach(oldCdtCode => {
					const key = `${oldCdtCode.cdtCodeId}-${visitIndex}`;
					if (newCodesMap.has(key)) {
						newVisitCdtCodeMapIdMapping.set(oldCdtCode.visitCdtCodeMapId, newCodesMap.get(key));
					}
				});
			}
		});

		return newVisitCdtCodeMapIdMapping;
	}


	const handleUpdateTreatmentPlan = async () => {
		console.log("Treatment Plan before updating:", treatmentPlan);
		let updatedAlternativeProcedures = alternativeProcedures;
		try {
			let newTreatmentPlanCreated = false;

			// Check if the treatment plan is a default/global plan (no facility id indicates it is), we instead
			//create a tx plan if its a default, otherwise we already have one an existing facility tx plan.
			//if its a superadmin we just proceed to update the treatment plan globally.
			if (treatmentPlan.facilityId === null && !isSuperAdmin) {
				const newTreatmentPlan = await createNewTreatmentPlanFromDefault(treatmentPlan, allRows, visitOrder);
				newTreatmentPlanCreated = true;
				const newVisitCdtCodeMapIdMapping = buildNewVisitCdtCodeMapIdMapping(treatmentPlan, newTreatmentPlan);
				dispatch(updateAlternativeProcedureVisitCdtCodeMapIds({ newVisitCdtCodeMapIdMapping }));
				updatedAlternativeProcedures = selectAlternativeProcedures(store.getState());
				console.log("alternativeProcedures after dispatch: ", updatedAlternativeProcedures);
				console.log("Current State after dispatch:", updatedAlternativeProcedures);

			}

			// Determine if there are new alternative procedures that need to be processed
			const hasNewAlternativeProcedures = alternativeProcedures.some(ap => ap.alternativeProcedureId === null);

			// If the treatment plan was newly created but there are no new alternative procedures, return early
			if (newTreatmentPlanCreated && !hasNewAlternativeProcedures) {
				return;
			}

			// Identify new visits
			const tempVisitIds = visitOrder.filter((visitId) =>
				String(visitId).startsWith("temp-")
			);

			// Create new visits and store the responses
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
			
			// Identify new procedures and associate them with actualVisitIds
			const newProcedures = [];
			Object.keys(deepCopyAllRows).forEach((visitId) => {
				deepCopyAllRows[visitId].forEach((row) => {
					if (!row.visitCdtCodeMapId && row.selectedCdtCode) {
						newProcedures.push({
							visitId: visitId,
							CdtCodeId: row.selectedCdtCode.cdtCodeId,
							Order: 0,
						});
					}
				});
			});

			// Send new procedures to backend and process the response
			const newProcedureResponse = await createNewProcedures(newProcedures);
			newProcedureResponse.forEach((proc) => {
				const { visitId, visitCdtCodeMapId, cdtCodeId } = proc;
				const rows = deepCopyAllRows[visitId];
				if (!rows) {
					return;
				}
				const rowIndex = rows.findIndex(
					(row) =>
						row.selectedCdtCode && row.selectedCdtCode.cdtCodeId === cdtCodeId
				);
				if (rowIndex > -1) {
					rows[rowIndex].visitCdtCodeMapId = visitCdtCodeMapId;
				}
			});

			// Update the visit order with actualVisitIds
			const updatedVisitOrder = visitOrder.map(
				(visitId) => visitIdMap[visitId] || visitId
			);

			// Update the treatment plan visits
			const updatedVisits = treatmentPlan.visits.map((visit) => {
				const actualVisitId = visitIdMap[visit.visitId] || visit.visitId;
				const updatedProcedures = deepCopyAllRows[actualVisitId]
					? deepCopyAllRows[actualVisitId]
							.filter((row) => row.selectedCdtCode !== null)
							.map((row) => {
								return {
									visitCdtCodeMapId: row.visitCdtCodeMapId,
									cdtCodeId: row.selectedCdtCode.cdtCodeId,
									description: row.description,
								};
							})
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
			setVisitOrder(updatedVisitOrder);
			setAllRows(deepCopyAllRows);

			// update the treatment plan
			const updateDto = mapToUpdateTreatmentPlanDto(
				treatmentPlan,
				deepCopyAllRows,
				updatedVisitOrder,
				deletedRowIds,
				deletedVisitIds,
				editedRows,
				updatedAlternativeProcedures
			);
			const updatedTreatmentPlan = await updateTreatmentPlan(
				treatmentPlan.treatmentPlanId,
				updateDto
			);

			adjustUpdatedTreatmentPlanStructure(updatedTreatmentPlan, treatmentPlan);

			dispatch(updateSubcategoryTreatmentPlan(updatedTreatmentPlan));

			onUpdateVisitsInTreatmentPlan(
				treatmentPlan.treatmentPlanId,
				updatedVisits
			);
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

	const transformVisitCdtCodeMapsToCdtCodes = (visit) => {
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
	};


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
		// Keep your dropdown logic as it is
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

			// Return the array including the TextField for rendering in your table
			return showToothNumber ? ["", cdtDropdown, textField] : ["", cdtDropdown, textField];
		}

		// For non-dynamic rows, return your usual structure
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

	const handleDoneEdit = (rowId, visitId) => {
		const isAltRow = rowId.startsWith('dynamic-alt-code') || rowId.startsWith('static-alt-code');
		setEditingRowId(null);

		setAllRows((prevAllRows) => {
			const rows = prevAllRows[visitId];
			const updatedRows = rows.map((row) => {
				if (row.id === rowId) {
					// Determine which conversion function to use based on row type
					const editedRow = isAltRow
						? convertToStaticRowForAltCode(row.selectedCdtCode, visitId, rowId, rows, dynamicRowValues, row.tempId, "update")
						: convertToStaticRow(row, visitId, row.selectedCdtCode, row.description);

					// Optionally handle storing the edited row's data
					setEditedRows((prev) => [...prev, { ...editedRow, visitId }]);

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
				lastCellContent = createAddButtonCell(visitId, row.id); // For other dynamic rows
			}
		}
		rowData.push(lastCellContent);

		return {
			id: row.id,
			data: rowData,
		};
	};

	const handleEditRow = (rowId, visitId) => {
		// Directly access the rows for the specific visitId
		const rows = allRows[visitId];
		const rowIndex = rows.findIndex((row) => row.id === rowId);

		if (rowIndex !== -1) {
			const currentRow = rows[rowIndex];

			const isAltRow = currentRow.id.startsWith('dynamic-alt-code') || currentRow.id.startsWith('static-alt-code');

			// Before converting the row, update dynamicRowValues with the current description
			const initialDescription = currentRow.description || "";
			setDynamicRowValues(prevValues => ({
				...prevValues,
				[currentRow.id]: initialDescription,
			}));

			// Set originalRowData with the current state of the row before making it dynamic for editing
			setOriginalRowData({ ...currentRow });

			// Convert the current row to a dynamic row for editing based on its type
			const dynamicRow = isAltRow
				? convertToDynamicRowForAltCode(currentRow, visitId, dynamicRowValues) // Use the alt row conversion for alt rows
				: convertToDynamicRow(currentRow, visitId); // Use the regular row conversion for normal rows

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


	const expandRows = (rows, rowIndex, visitId, currentRow, alternativeProcedures) => {
		// Find matching alternative procedures
		const visitCdtCodeMapId = currentRow.visitCdtCodeMapId;
		const matchingAlternativeProcedures = alternativeProcedures.filter(ap =>
			ap.visitCdtCodeMapId === visitCdtCodeMapId
		);

		// Optionally include logic to fetch and insert any newly created static alt rows
		const newlyCreatedAltRows = rows.filter(row =>
			row.id.startsWith("static-alt-code") &&
			row.visitCdtCodeMapId === visitCdtCodeMapId
		);

		// Combine and sort both sets of rows before inserting
		const combinedAltRows = [...matchingAlternativeProcedures, ...newlyCreatedAltRows];

		// Insert new static rows for each matching alternative procedure
		combinedAltRows.forEach((ap, index) => {
			const staticRowForAltCode = createStaticRowForAltCode(ap, visitId, `alt-${index}`);
			rows.splice(rowIndex + 1 + index, 0, staticRowForAltCode); // Insert right after the current row
		});

		// Insert a new dynamic row for alternative CDT code selection
		const dynamicRowForAltCode = createDynamicRowForAltCode(visitId, currentRow);
		rows.splice(rowIndex + 1 + combinedAltRows.length, 0, dynamicRowForAltCode);
	};


	const handleRedDropdownIconClick = (rowId) => {
		setAllRows((prevAllRows) => {
			const updatedAllRows = { ...prevAllRows };
			Object.entries(updatedAllRows).forEach(([visitId, rows]) => {
				const rowIndex = rows.findIndex(row => row.id === rowId);
				if (rowIndex === -1) return; // Skip if the row doesn't exist in this visit.

				const currentRow = rows[rowIndex];

				// Check if the row is currently expanded
				const isExpanded = activeParentRow === rowId;

				if (isExpanded) {
					collapseRows(rows, rowIndex);
					setActiveParentRow(null); // Reset active parent row since we are collapsing
				} else {
					// If another row was previously expanded, first collapse it
					if (activeParentRow) {
						const prevRowIndex = rows.findIndex(row => row.id === activeParentRow);
						if (prevRowIndex !== -1) {
							collapseRows(rows, prevRowIndex);
						}
					}
					expandRows(rows, rowIndex, visitId, currentRow, alternativeProcedures);
					setActiveParentRow(rowId); // Set new active parent row
				}
			});
			return updatedAllRows;
		});
	};


	const createStaticRowForAltCode = (alternativeProcedure, visitId, baseRowId) => {
		const description = alternativeProcedure.userDescription || 'Description not provided';
		const cdtCode = alternativeProcedure.code;
		const alternativeProcedureId = alternativeProcedure.alternativeProcedureId || null;

		const extraRowInput = [
			cdtCode,
			description
		];

		return {
			id: `static-alt-code-${visitId}-${baseRowId}`,
			alternativeProcedureId: alternativeProcedureId,
			visitCdtCodeMapId: alternativeProcedure.visitCdtCodeMapId,
			description: description,
			selectedCdtCode: {
				code: cdtCode,
			},
			isStatic: true,
			extraRowInput 
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

	const createDynamicRowForAltCode = (visitId, currentRow, activeParentRowId) => {
		const dynamicRowId = `dynamic-alt-code-${visitId}-${currentRow.id}-${Date.now()}`;
		const tempId = `temp-${Date.now()}`;
		return {
			id: dynamicRowId,
			tempId,
			parentRowId: activeParentRowId,
			textFieldProps: {
				label: "",
				borderColor: UI_COLORS.purple,
				width: "auto"
			},
			visitCdtCodeMapId: currentRow.visitCdtCodeMapId,
			selectedCdtCode: null,
		};
	};

	const convertToDynamicRowForAltCode = (currentRow, visitId, dynamicRowValues) => {

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

	const convertToStaticRowForAltCode = (selectedCdtCode, visitId, rowId, rowsForVisit, dynamicRowValues, tempId, operationType) => {

		const userDescription = dynamicRowValues[rowId] || 'Description not provided';

		const parentRow = rowsForVisit.find(row => row.id === rowId);

		const newStaticAltRow = {
			id: rowId,
			tempId,
			isStatic: true,
			visitCdtCodeMapId: parentRow.visitCdtCodeMapId,
			description: userDescription,
			selectedCdtCode: {
				code: selectedCdtCode.code,
				longDescription: userDescription,
			},
			extraRowInput: showToothNumber
				? [treatmentPlan.toothNumber, selectedCdtCode.code, userDescription || 'Description not provided']
				: [selectedCdtCode.code, userDescription || 'Description not provided'],
		};

		// Define the base structure for creates
		const newAltProcedureObjectForState = {
			alternativeProcedureId: null,
			tempId,
			cdtCodeId: selectedCdtCode.cdtCodeId,
			code: selectedCdtCode.code, 
			userDescription: userDescription,
			visitCdtCodeMapId: parentRow.visitCdtCodeMapId,
		};

		// Define the base structure for updates
		const updates = {
			code: selectedCdtCode.code,
			userDescription: userDescription,
			visitCdtCodeMapId: parentRow.visitCdtCodeMapId,
		};

		// Only include cdtCodeId in updates if it's defined in selectedCdtCode
		if ('cdtCodeId' in selectedCdtCode && typeof selectedCdtCode.cdtCodeId !== 'undefined') {
			updates.cdtCodeId = selectedCdtCode.cdtCodeId;
		} else {
			// If cdtCodeId is not being updated, retain the existing value from the state
			const existingAltProcedure = alternativeProcedures.find(ap => ap.tempId === tempId || ap.alternativeProcedureId === parentRow.alternativeProcedureId);
			if (existingAltProcedure) {
				updates.cdtCodeId = existingAltProcedure.cdtCodeId;
			}
		}

		if (operationType === "update") {
			const identifier = tempId ? { tempId } : { alternativeProcedureId: parentRow.alternativeProcedureId };
			dispatch(updateAlternativeProcedure({ ...identifier, updates }));
		} else if (operationType === "create") {
			dispatch(addAlternativeProcedure(newAltProcedureObjectForState));
		}

		return newStaticAltRow;
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
							activeParentRow={activeParentRow}
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
