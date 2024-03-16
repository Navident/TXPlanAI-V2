import PropTypes from "prop-types";
import "./TreatmentPlanOutput.css";
import Table from "../../Components/Table/Table";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import DropdownSearch from "../../Components/Common/DropdownSearch/DropdownSearch";
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
import deleteIcon from "../../assets/delete-x.svg";
import dragIcon from "../../assets/drag-icon.svg";
import { useBusiness } from "../../Contexts/BusinessContext/useBusiness";
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
import { selectPayersForFacility, selectSelectedPayer, setGrandUcrTotal, setGrandCoPayTotal, setGrandTotalsReady } from '../../Redux/ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice';

import { onDeleteTemporaryVisit, onUpdateVisitDescription, setTreatmentPlanId, addTreatmentPlan, setVisitOrder, selectVisitOrder, handleAddCdtCode, onDeleteCdtCode } from '../../Redux/ReduxSlices/TreatmentPlans/treatmentPlansSlice';
import categoryColorMapping from '../../Utils/categoryColorMapping';
import StandardTextfield from '../../Components/Common/StandardTextfield/StandardTextfield';
import PaymentTotals from "../../Components/PaymentTotals/index";

const TreatmentPlanOutput = ({
	treatmentPlan,
	treatmentPlans,
	onAddVisit,
	onUpdateVisitsInTreatmentPlan,
	onDeleteVisit,
	showToothNumber,
	isInGenerateTreatmentPlanContext,
}) => {
	const dispatch = useDispatch();
	const [allRows, setAllRows] = useState({});
	const [deletedRowIds, setDeletedRowIds] = useState([]);
	const [deletedVisitIds, setDeletedVisitIds] = useState([]);
	const isInitialLoad = useRef(true);
	const [localUpdatedVisits, setLocalUpdatedVisits] = useState([]);

	const [combinedVisits, setCombinedVisits] = useState([]);
	const { facilityCdtCodes, defaultCdtCodes } = useBusiness();
	const combinedCdtCodes = useMemo(
		() => [...defaultCdtCodes, ...facilityCdtCodes],
		[defaultCdtCodes, facilityCdtCodes]
	);
	const [editingRowId, setEditingRowId] = useState(null);
	const [originalRowData, setOriginalRowData] = useState(null);
	const [editedRows, setEditedRows] = useState([]);
	const {
		selectedPatient,
	} = useBusiness();
	const [hasEdits, setHasEdits] = useState(false);
	const columnWidths = ["5%", "10%", "10%", "30%", "10%", "10%", "10%", "5%", "5%", "5%"];

	const checkedRows = useSelector(selectCheckedRows);
	const isGroupActive = useSelector(selectIsGroupActive);
	const selectedCategories = useSelector(selectSelectedCategories); 
	const visitOrder = useSelector(selectVisitOrder);
	const [editTableNameMode, setEditTableNameMode] = useState(null); 
	const [editTableNameValue, setEditTableNameValue] = useState(''); 
	const updateRequested = useSelector(selectUpdateRequested);
	const payers = useSelector(selectPayersForFacility);
	const selectedPayer = useSelector(selectSelectedPayer);

	useEffect(() => {
		const newCheckedRows = [];
		Object.values(allRows).forEach(visitRows => {
			visitRows.forEach(row => {
				if (row.selectedCdtCode && selectedCategories.has(row.selectedCdtCode.originalVisitCategory)) {
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
		setCombinedVisits(treatmentPlan.visits);
	}, [treatmentPlan, isInGenerateTreatmentPlanContext]);

	useEffect(() => {
		if (isInitialLoad.current) {
			console.log("we went in the initial load conditional");
			const visits = treatmentPlan.visits || [];
			const newAllRows = visits.reduce((acc, visit, index) => {
				const visitId = visit.visitId;
				const cdtCodes = Array.isArray(visit.cdtCodes) ? visit.cdtCodes : [];
				const staticRows = cdtCodes.map((visitCdtCodeMap, cdtIndex) =>
					createInitialStaticRows(visitCdtCodeMap, visitId, cdtIndex)
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
			isInitialLoad.current = false;
		}
	}, [treatmentPlan, facilityCdtCodes, defaultCdtCodes]);

	useEffect(() => {
		setLocalUpdatedVisits(treatmentPlan.visits);
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

		// Use handleAddVisit to add the new visit with grouped rows
		handleAddVisit(newGroupVisitId, groupedRows, newAllRows); 

		// Clear checked rows after grouping
		dispatch(clearCheckedRows());
	}, [allRows, checkedRows, dispatch]);




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


	const createInitialStaticRows = (visitCdtCodeMap, visitId, index) => {
		let selectedPayerDetails;
		// Check if we're not in the create treatment plan context and a payerId exists on the treatment plan
		if (!isInGenerateTreatmentPlanContext && treatmentPlan.payerId) {
			const savedTxPayerId = treatmentPlan.payerId;
			selectedPayerDetails = payers.find(payer => payer.payerId === savedTxPayerId);
		}
		// Check if we are in the create treatment plan context and a selectedPayer exists
		else if (isInGenerateTreatmentPlanContext && selectedPayer && selectedPayer.payerId) {
			selectedPayerDetails = payers.find(payer => payer.payerId === selectedPayer.payerId);
		}

		const fee = selectedPayerDetails?.cdtCodeFees?.find(f => f.code === visitCdtCodeMap.code);

		// Default values for UCR Fee, Coverage Percent, and CoPay when fee details are available
		const ucrFee = fee ? fee.ucrDollarAmount : "Not configured";
		const coveragePercent = fee ? fee.coveragePercent : "Not configured";
		const coPay = fee ? fee.coPay : "Not configured";
		const surface = visitCdtCodeMap.surface || "";
		const arch = visitCdtCodeMap.arch || "";

		const extraRowInput = [
			visitCdtCodeMap.toothNumber,
			visitCdtCodeMap.code,
			visitCdtCodeMap.longDescription,
			ucrFee,
			coveragePercent,
			coPay,
			surface,
			arch
		];

		return {
			id: `static-${visitId}-${index}`,
			visitCdtCodeMapId: visitCdtCodeMap.visitCdtCodeMapId,
			description: visitCdtCodeMap.longDescription,
			selectedCdtCode: visitCdtCodeMap,
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
			code: selectedCdtCode.code, // The actual CDT code string
			longDescription: selectedCdtCode.longDescription, // Description of the CDT code
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
		let selectedPayerDetails;
		if (!isInGenerateTreatmentPlanContext && treatmentPlan.payerId) {
			const savedTxPayerId = treatmentPlan.payerId;
			selectedPayerDetails = payers.find(payer => payer.payerId === savedTxPayerId);
		} else if (isInGenerateTreatmentPlanContext && selectedPayer && selectedPayer.payerId) {
			selectedPayerDetails = payers.find(payer => payer.payerId === selectedPayer.payerId);
		}

		// Extract fee details for the selected CDT code
		const fee = selectedPayerDetails?.cdtCodeFees?.find(f => f.code === (selectedCdtCode ? selectedCdtCode.code : currentRow.selectedCdtCode?.code));

		// Use extracted or default values
		const ucrFee = fee ? fee.ucrDollarAmount : "Not configured";
		const coveragePercent = fee ? fee.coveragePercent : "Not configured";
		const coPay = fee ? fee.coPay : "Not configured";

		const description = originalDescription || (selectedCdtCode ? selectedCdtCode.longDescription : currentRow.description);

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
			selectedCdtCode: selectedCdtCode || currentRow.selectedCdtCode,
			description,
			extraRowInput: [
				currentRow.extraRowInput[0], 
				selectedCdtCode ? selectedCdtCode.code : currentRow.selectedCdtCode?.code, 
				description,
				ucrFee,
				coveragePercent,
				coPay
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
			currentRow.selectedCdtCode && currentRow.selectedCdtCode.toothNumber
				? currentRow.selectedCdtCode.toothNumber
				: "";
		const ucrFee = currentRow.extraRowInput[3];
		const coveragePercent = currentRow.extraRowInput[4];
		const coPay = currentRow.extraRowInput[5];
		const surf = currentRow.extraRowInput[6];
		const arch = currentRow.extraRowInput[7];

		const extraRowInput = [
			toothNumber,
			dropdownSearchElement,
			ucrFee,
			coveragePercent,
			coPay,
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
			extraRowInput: [treatmentPlan.toothNumber, "", ""],
		};
	};

	function addNewRow(visitId) {
		setAllRows((prevAllRows) => {
			const rowsForVisit = prevAllRows[visitId] || [];
			const lastRow =
				rowsForVisit.length > 0 ? rowsForVisit[rowsForVisit.length - 1] : null;

			if (lastRow) {
				// Use convertToStaticRow to convert the last row to static
				const staticRow = convertToStaticRow(
					lastRow,
					visitId,
					lastRow.selectedCdtCode
				);

				// Use createDynamicRow to add a new dynamic row
				const newDynamicRow = createDynamicRowUponAddClick(visitId);

				return {
					...prevAllRows,
					[visitId]: [...rowsForVisit.slice(0, -1), staticRow, newDynamicRow],
				};
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

	const handleDeleteRow = (visitId, rowId, row) => {
		console.log("row in delete", row);
		const rowVisitCdtCodeMapId = row.visitCdtCodeMapId;
		dispatch(onDeleteCdtCode({ treatmentPlanId: treatmentPlan.treatmentPlanId, visitId, visitCdtCodeMapIdToDelete: rowVisitCdtCodeMapId }));
		setAllRows((prevRows) => {
			const updatedRows = prevRows[visitId].filter((row) => row.id !== rowId);
			return { ...prevRows, [visitId]: updatedRows };
		});
		setDeletedRowIds((prevIds) => [...prevIds, rowId]);
	};

	const handleDeleteVisit = (visitId) => {
		// Check if the visitId starts with "temp-" to identify temporary visits
		const isTemporaryVisit = visitId.startsWith("temp-");

		// Update the visitOrder to remove the visit
		const newVisitOrder = visitOrder.filter(id => id !== visitId);
		dispatch(setVisitOrder(newVisitOrder));

		// Update allRows to remove the rows associated with the visit
		setAllRows(prevRows => {
			const updatedRows = { ...prevRows };
			delete updatedRows[visitId];
			return updatedRows;
		});

		// If the visit is not temporary
		if (!isTemporaryVisit) {
			setDeletedVisitIds(prevIds => {
				const newDeletedVisitIds = [...prevIds, visitId];
				console.log("Deleted visit added, new deletedVisitIds:", newDeletedVisitIds);
				return newDeletedVisitIds;
			});

			if (treatmentPlan.treatmentPlanId) {
				onDeleteVisit(treatmentPlan.treatmentPlanId, visitId);
			}

		}

		else {
			// here the visit is temporary
			dispatch(onDeleteTemporaryVisit({ deletedVisitId: visitId }));

		}
	};


	const createNewCombinedTreatmentPlanForPatient = async (
		treatmentPlan,
		allRows,
		visitOrder
	) => {
		console.log("Attempting to create a new combined treatment plan...");
		try {
			const payerId = selectedPayer ? selectedPayer.payerId : null;

			const newTreatmentPlan = await handleCreateNewTreatmentPlanForPatient(
				treatmentPlan,
				allRows,
				visitOrder,
				selectedPatient.patientId,
				payerId, 
				hasEdits
			);
			console.log("New treatment plan created successfully:", newTreatmentPlan);
			return newTreatmentPlan;
		} catch (error) {
			console.error("Error in creating new treatment plan:", error);
		}
	};


	const handleUpdateTreatmentPlan = async () => {
		try {
			// Check if in generate treatment plan context and no treatment plan ID exists
			if (isInGenerateTreatmentPlanContext) {
				// Logic for creating a new treatment plan
				const newTreatmentPlanResponse = await createNewCombinedTreatmentPlanForPatient(
					treatmentPlan,
					allRows,
					visitOrder
				);
				console.log("New treatment plan created successfully:", newTreatmentPlanResponse);

				if (newTreatmentPlanResponse && newTreatmentPlanResponse.treatmentPlanId) {
					adjustUpdatedTreatmentPlanStructure(newTreatmentPlanResponse, treatmentPlan);

					dispatch(setTreatmentPlanId(newTreatmentPlanResponse.treatmentPlanId));
					dispatch(addTreatmentPlan(newTreatmentPlanResponse));
				}

				dispatch(showAlert({ type: 'success', message: 'New treatment plan created successfully' }));

			

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
										// ...additional properties possibly later
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
				const updatedTreatmentPlan = await updateTreatmentPlan(
					treatmentPlan.treatmentPlanId,
					updateDto
				);

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


	const createHeaders = () => {
		let headers = [
			"Tooth #",
			"CDT Code",
			"Description",
			"UCR Fee",
			"Coverage %",
			"Co-Pay",
			"Surf",
			"arch"
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


	const constructDynamicRowData = (row, visitId) => {
		const ucrFee = row.extraRowInput[2];
		const coveragePercent = row.extraRowInput[3];
		const coPay = row.extraRowInput[4];
		const surf = row.extraRowInput[5];
		const arch = row.extraRowInput[6];
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

		const toothNumber =
			row.selectedCdtCode && row.selectedCdtCode.toothNumber
				? row.selectedCdtCode.toothNumber.toString()
				: "";
		return [toothNumber, cdtDropdown, row.description, ucrFee, coveragePercent, coPay, surf, arch];
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
				// If the row's category is selected, use the corresponding color
				backgroundColor = categoryColorMapping[category];
			} else {
				// If the row is checked but its category is not among the selected, or it doesn't have a category, make it transparent
				backgroundColor = "transparent";
			}
		} else {
			// Default background color when not checked
			backgroundColor = null; 
		}

		return {
			id: row.id,
			data: rowData,
			backgroundColor,
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


	const lockDimensions = () => {
		const tables = document.querySelectorAll(".tx-table");
		tables.forEach(table => {
			const computedStyle = window.getComputedStyle(table);
			table.style.width = computedStyle.getPropertyValue('width');
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

	const calculateTotalsForVisit = (visitRows) => {
		let ucrTotal = 0;
		let coPayTotal = 0;

		visitRows.forEach(row => {
			if (row.isStatic) {
				const ucrFee = parseFloat(row.extraRowInput[3]);
				const coPay = parseFloat(row.extraRowInput[5]);

				if (!isNaN(ucrFee)) {
					ucrTotal += ucrFee;
				}

				if (!isNaN(coPay)) {
					coPayTotal += coPay;
				}
			}
		});

		return { ucrTotal, coPayTotal };
	};

	const calculateGrandTotals = (allRows) => {
		let grandUcrTotal = 0;
		let grandCoPayTotal = 0;

		if (allRows) {
			console.log("we went inside the if condition")
			Object.values(allRows).forEach(visitRows => {
				const { ucrTotal, coPayTotal } = calculateTotalsForVisit(visitRows);
				grandUcrTotal += ucrTotal;
				grandCoPayTotal += coPayTotal;
			});
		}

		return { grandUcrTotal, grandCoPayTotal };
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
		const { ucrTotal, coPayTotal } = calculateTotalsForVisit(allRows[visitIdStr]);
		const { grandUcrTotal, grandCoPayTotal } = calculateGrandTotals(allRows);
		// Dispatch actions to update the totals in the store
		dispatch(setGrandUcrTotal(grandUcrTotal));
		dispatch(setGrandCoPayTotal(grandCoPayTotal));
		dispatch(setGrandTotalsReady(true));
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
							columnWidths={columnWidths}
						/>
						<PaymentTotals ucrTotal={ucrTotal} coPayTotal={coPayTotal} justifyContent="center" />
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
