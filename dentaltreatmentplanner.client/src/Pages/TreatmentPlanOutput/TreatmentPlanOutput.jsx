import PropTypes from 'prop-types';
import './TreatmentPlanOutput.css';
import Table from "../../Components/Table/Table";
import { useState, useEffect, useRef, useMemo } from 'react';
import DropdownSearch from "../../Components/Common/DropdownSearch/DropdownSearch";
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import { updateTreatmentPlan, createVisit, createNewProcedures, handleCreateNewTreatmentPlanFromDefault, handleCreateNewTreatmentPlanForPatient } from '../../ClientServices/apiService';
import { mapToUpdateTreatmentPlanDto, mapToCreateVisitDto } from '../../Utils/mappingUtils';
import deleteIcon from '../../assets/delete-x.svg';
import dragIcon from '../../assets/drag-icon.svg';
import Alert from '../../Components/Common/Alert/Alert';
import { useBusiness } from '../../Contexts/BusinessContext/useBusiness';
import { StyledContainerWithTableInner, StyledTableLabelText, StyledAddButtonCellContainer, StyledClickableText, StyledEditIcon, StyledDeleteIcon, StyledEditDeleteIconsContainer, StyledSaveTextBtn, StyledLightGreyText, StyledRoundedBoxContainerInner, StyledSemiboldBlackTitle } from '../../GlobalStyledComponents';
import { UI_COLORS } from '../../Theme';
import pencilEditIcon from '../../assets/pencil-edit-icon.svg';
import RoundedButton from "../../Components/Common/RoundedButton/RoundedButton";
import useTreatmentPlan from '../../Contexts/TreatmentPlanContext/useTreatmentPlan';
import SaveButtonRow from "../../Components/Common/SaveButtonRow/index";
import useSortContext from '../../Contexts/SortContext/useSortContext';

const TreatmentPlanOutput = ({ treatmentPlan, treatmentPlans, onAddVisit, onUpdateVisitsInTreatmentPlan, onDeleteVisit, showToothNumber, isInGenerateTreatmentPlanContext }) => {
    const [allRows, setAllRows] = useState({});
    const [visitOrder, setVisitOrder] = useState([]);
    const [deletedRowIds, setDeletedRowIds] = useState([]);
    const [deletedVisitIds, setDeletedVisitIds] = useState([]);
    const isInitialLoad = useRef(true);
    const [localUpdatedVisits, setLocalUpdatedVisits] = useState([]);
    const [alertInfo, setAlertInfo] = useState({ open: false, type: '', message: '' });
    const [combinedVisits, setCombinedVisits] = useState([]);
    const { facilityCdtCodes, defaultCdtCodes } = useBusiness(); 
    const combinedCdtCodes = useMemo(() => [...defaultCdtCodes, ...facilityCdtCodes], [defaultCdtCodes, facilityCdtCodes]);
    const [editingRowId, setEditingRowId] = useState(null);
    const [originalRowData, setOriginalRowData] = useState(null);
    const [editedRows, setEditedRows] = useState([]);
    const { selectedPatient, refreshPatientTreatmentPlans, facilityPayerCdtCodeFees } = useBusiness();
    const { selectedPayer } = useTreatmentPlan();
    const [hasEdits, setHasEdits] = useState(false);
    const { alignment, selectedCategories, initialRenderComplete, setRenderComplete  } = useSortContext();
    

    useEffect(() => {
        console.log("Received treatmentPlan:", treatmentPlan);
    }, [treatmentPlan]);

    useEffect(() => {
        setCombinedVisits(treatmentPlan.visits);
    }, [treatmentPlan, isInGenerateTreatmentPlanContext]);

    useEffect(() => {
        if (treatmentPlan && treatmentPlan.visits && treatmentPlan.visits.length > 0) {
            setRenderComplete(true);
        }
    }, [treatmentPlan]);

    useEffect(() => {
        if (isInitialLoad.current) {
            const visits = treatmentPlan.visits || [];
            const newAllRows = visits.reduce((acc, visit, index) => {
                const visitId = visit.visitId;
                const cdtCodes = Array.isArray(visit.cdtCodes) ? visit.cdtCodes : [];
                const staticRows = cdtCodes.map((visitCdtCodeMap, cdtIndex) =>
                    createInitialStaticRows(visitCdtCodeMap, visitId, cdtIndex));
                const initialRowId = `initial-${visitId}`;
                acc[visitId] = [...staticRows, createDynamicRowv1(visitId, initialRowId)];
                return acc;
            }, {});

            setAllRows(newAllRows);
            setVisitOrder(visits.map(visit => visit.visitId));
            isInitialLoad.current = false;
        }
    }, [treatmentPlan, facilityCdtCodes, defaultCdtCodes]);


    useEffect(() => {
        setLocalUpdatedVisits(treatmentPlan.visits);
    }, [treatmentPlan.visits]);

    const sortVisitsByCategory = (visits, selectedCategories) => {
        let categoryGroups = {};

        visits.forEach(visit => {
            // Check if the visit is a combined visit with original categories information
            if (visit.originalCategories) {
                // Handle combined visit: Distribute CDT codes based on their original categories
                visit.cdtCodes.forEach(cdtCode => {
                    const categoryName = cdtCode.procedureCategoryName; 
                    if (!categoryGroups[categoryName]) {
                        categoryGroups[categoryName] = {
                            visitId: `combined-${categoryName}`,
                            description: `Combined Visit for ${categoryName}`,
                            cdtCodes: [],
                            originLineIndex: [],
                            procedureCategoryName: categoryName
                        };
                    }
                    categoryGroups[categoryName].cdtCodes.push(cdtCode);
                    if (!categoryGroups[categoryName].originLineIndex.includes(cdtCode.originLineIndex)) {
                        categoryGroups[categoryName].originLineIndex.push(cdtCode.originLineIndex);
                    }
                });
            } else {
                // Handle regular visit: Group by existing procedureCategoryName
                const categoryName = visit.procedureCategoryName;
                if (!categoryGroups[categoryName]) {
                    categoryGroups[categoryName] = {
                        visitId: `combined-${categoryName}`,
                        description: `Combined Visit for ${categoryName}`,
                        cdtCodes: [],
                        originLineIndex: [],
                        procedureCategoryName: categoryName
                    };
                }
                visit.cdtCodes.forEach(cdtCode => {
                    categoryGroups[categoryName].cdtCodes.push(cdtCode);
                    if (!categoryGroups[categoryName].originLineIndex.includes(visit.originLineIndex)) {
                        categoryGroups[categoryName].originLineIndex.push(visit.originLineIndex);
                    }
                });
            }
        });

        // Convert grouped CDT codes into format for combined visits by category
        const combinedVisitsByCategory = Object.values(categoryGroups)
            .filter(category => selectedCategories.has(category.procedureCategoryName)) // Filter based on selected categories
            .map(category => {
            // Sort combinedCdtCodes within each category
            category.cdtCodes.sort((a, b) =>
                a.originLineIndex - b.originLineIndex ||
                a.visitNumber - b.visitNumber ||
                a.orderWithinVisit - b.orderWithinVisit
            );
            category.originLineIndex = Math.min(...category.originLineIndex);

            return category;
        });

        return combinedVisitsByCategory;
    };




    const sortVisitsIntoOne = (allVisits) => {
        let combinedCdtCodes = [];

        console.log("Before sorting, allVisits:", JSON.parse(JSON.stringify(allVisits)));


        allVisits.forEach(visit => {
            visit.cdtCodes.forEach(cdtCode => {
                combinedCdtCodes.push({
                    ...cdtCode,
                    originLineIndex: visit.originLineIndex,
                    visitNumber: visit.visitNumber,
                    orderWithinVisit: cdtCode.order
                });
            });
        });
        console.log("Before sort, combinedCdtCodes:", JSON.parse(JSON.stringify(combinedCdtCodes)));

/*        // Sort combinedCdtCodes by originLineIndex, visitNumber, and then by orderWithinVisit
        combinedCdtCodes.sort((a, b) =>
            a.originLineIndex - b.originLineIndex ||
            a.visitNumber - b.visitNumber ||
            a.orderWithinVisit - b.orderWithinVisit
        );
        console.log("After sort, combinedCdtCodes:", JSON.parse(JSON.stringify(combinedCdtCodes)));*/

        return [{
            visitId: 'combined',
            description: 'Combined Visit',
            cdtCodes: combinedCdtCodes,
            originLineIndex: 0
        }];
    };

    const updateStateWithSortedVisits = (sortedVisits) => {
        console.log("sortedVisits in updateStateWithSortedVisits:", JSON.parse(JSON.stringify(sortedVisits)));

        // Update `localUpdatedVisits` with sorted visits
        setLocalUpdatedVisits(sortedVisits);

        // Recalculate `allRows` and `visitOrder` based on `sortedVisits`
        const newAllRows = {};
        const newVisitOrder = [];
        sortedVisits.forEach((visit, index) => {
            const visitId = visit.visitId;
            newVisitOrder.push(visitId);
            console.log(`Processing visitId: ${visitId}, index: ${index}`);

            const staticRows = visit.cdtCodes.map((cdtCode, cdtIndex) =>
                createInitialStaticRows(cdtCode, visitId, cdtIndex));
            const initialRowId = `initial-${visitId}`;
            newAllRows[visitId] = [...staticRows, createDynamicRowv1(visitId, initialRowId)];
        });

        console.log("newAllRows after processing:", JSON.parse(JSON.stringify(newAllRows)));
        console.log("newVisitOrder after processing:", newVisitOrder);

        setAllRows(newAllRows);
        setVisitOrder(newVisitOrder);
    };

    useEffect(() => {
        if (!alignment || !treatmentPlan.visits || !initialRenderComplete || !selectedCategories) return;

        let sortedVisits;
        if (alignment === 'category') {
            // Logic for sorting by category
            sortedVisits = sortVisitsByCategory(treatmentPlan.visits, selectedCategories);
        } else if (alignment === 'default') {
            // Only execute sortVisitsIntoOne if previous alignment was 'category'
            sortedVisits = sortVisitsIntoOne(treatmentPlan.visits);
        } else {
            // If not changing from 'category' to another value, maintain the current visits without re-sorting
            sortedVisits = treatmentPlan.visits;
        }

        // Update the state with these sorted visits
        updateStateWithSortedVisits(sortedVisits);

    }, [alignment, treatmentPlan.visits, selectedCategories]); 



    const handleCloseAlert = () => {
        setAlertInfo({ ...alertInfo, open: false });
    };

    const createInitialStaticRows = (visitCdtCodeMap, visitId, index) => {
        const fee = facilityPayerCdtCodeFees.find(f => f.code === visitCdtCodeMap.code);

        let ucrFee, discountFee;
        if (isInGenerateTreatmentPlanContext && selectedPayer) {
            ucrFee = fee ? fee.ucrDollarAmount : "Not configured";
            discountFee = fee ? fee.discountFeeDollarAmount : "Not configured";
        } else {
            ucrFee = fee ? fee.ucrDollarAmount : "Not configured";
            discountFee = fee ? fee.discountFeeDollarAmount : "Not configured"; 
        }

        const extraRowInput = [
            visitCdtCodeMap.toothNumber,
            visitCdtCodeMap.code,
            visitCdtCodeMap.longDescription,
            ucrFee,
            discountFee
        ];
        console.log(`Creating row for visitId ${visitId}, index ${index}, toothNumber:`, visitCdtCodeMap.toothNumber);
        return {
            id: `static-${visitId}-${index}`, 
            visitCdtCodeMapId: visitCdtCodeMap.visitCdtCodeMapId,
            description: visitCdtCodeMap.longDescription,
            selectedCdtCode: visitCdtCodeMap,
            isStatic: true,
            extraRowInput
        };
    };



    const createCDTCodeDropdown = (rowId, visitId, combinedCdtCodes, handleSelect, selectedCdtCode) => {
        const cdtCodeOptions = combinedCdtCodes.map(code => ({
            id: code.code,
            ...code
        }));

        return (
            <DropdownSearch
                key={rowId}
                items={cdtCodeOptions}
                selectedItem={selectedCdtCode}
                onSelect={(selectedCode) => handleSelect(selectedCode, visitId, rowId)}
                itemLabelFormatter={(cdtCode) => `${cdtCode.code} - ${cdtCode.longDescription}`}
            />
        );
    };


    const createDynamicRowv1 = (visitId, initialRowId) => {
        const dropdownSearchElement = createCDTCodeDropdown(initialRowId, visitId, combinedCdtCodes, handleSelect);
        const extraRowInput = [treatmentPlan.toothNumber, dropdownSearchElement];

        return {
            id: initialRowId,
            description: '',
            selectedCdtCode: null,
            extraRowInput
        };
    };


    const convertToStaticRow = (currentRow, visitId, selectedCdtCode, originalDescription) => {
        // Prioritize using the originalDescription if provided
        const description = originalDescription || (selectedCdtCode ? selectedCdtCode.longDescription : currentRow.description);
        const ucrFee = currentRow.extraRowInput[2];
        const discountFee = currentRow.extraRowInput[3];

        return {
            ...currentRow,
            id: `static-${visitId}-${Date.now()}`,
            isStatic: true,
            visitCdtCodeMapId: null,
            selectedCdtCode: selectedCdtCode || currentRow.selectedCdtCode,
            description,
            extraRowInput: [
                treatmentPlan.toothNumber,
                selectedCdtCode ? selectedCdtCode.code : currentRow.selectedCdtCode?.code,
                description,
                ucrFee,
                discountFee
            ]
        };
    };


    const convertToDynamicRow = (currentRow, visitId) => {
        const dropdownSearchElement = createCDTCodeDropdown(currentRow.id, visitId, combinedCdtCodes, handleSelect, currentRow.selectedCdtCode);
        const toothNumber = currentRow.selectedCdtCode && currentRow.selectedCdtCode.toothNumber ? currentRow.selectedCdtCode.toothNumber : '';
        const ucrFee = currentRow.extraRowInput[3];
        const discountFee = currentRow.extraRowInput[4];

        const extraRowInput = [toothNumber, dropdownSearchElement, ucrFee, discountFee];

        return {
            ...currentRow,
            id: `dynamic-${visitId}-${Date.now()}`,
            extraRowInput,
            isStatic: false,
            isEditing: true
        };
    };


    const handleSelect = (selectedCode, visitId, rowId) => {
        const cdtCodeObj = combinedCdtCodes.find(cdtCode => cdtCode.code === selectedCode.value);

        setAllRows(prevRows => {
            let rows = [...prevRows[visitId]];
            let rowIndex = rows.findIndex(row => row.id === rowId);

            if (rowIndex !== -1) {
                const currentRow = rows[rowIndex];

                // Update the current dynamic row with the selected CDT code
                rows[rowIndex] = {
                    ...currentRow,
                    selectedCdtCode: cdtCodeObj,
                    description: cdtCodeObj.longDescription
                };
            }

            return {
                ...prevRows,
                [visitId]: rows
            };
        });
    };

    const createDynamicRowUponAddClick = (visitId) => {
        return {
            id: `dynamic-${visitId}-${Date.now()}`,
            description: '',
            selectedCdtCode: null,
            extraRowInput: [treatmentPlan.toothNumber, '', '']
        };
    };


    function addNewRow(visitId) {
        setAllRows(prevAllRows => {
            const rowsForVisit = prevAllRows[visitId] || [];
            const lastRow = rowsForVisit.length > 0 ? rowsForVisit[rowsForVisit.length - 1] : null;

            if (lastRow) {
                // Use convertToStaticRow to convert the last row to static
                const staticRow = convertToStaticRow(lastRow, visitId, lastRow.selectedCdtCode);

                // Use createDynamicRow to add a new dynamic row
                const newDynamicRow = createDynamicRowUponAddClick(visitId);

                return {
                    ...prevAllRows,
                    [visitId]: [...rowsForVisit.slice(0, -1), staticRow, newDynamicRow]
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
            const tableId = result.source.droppableId.replace('droppable-table-', '');
            const rows = allRows[tableId];

            if (!rows) {
                return;
            }

            const reorderedRows = reorder(
                rows,
                result.source.index,
                result.destination.index
            );

            setAllRows(prevRows => ({
                ...prevRows,
                [tableId]: reorderedRows
            }));
        }
    };

    const reorderAllRows = (newVisitOrder) => {
        const reorderedRows = {};
        newVisitOrder.forEach(visitId => {
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

        // Update visit order
        setVisitOrder(newOrder);

        // Update visitNumber for each visit
        const updatedVisits = treatmentPlan.visits.map(visit => {
            const newOrderIndex = newOrder.indexOf(visit.visitId);
            return { ...visit, visitNumber: newOrderIndex + 1 };
        });

        onUpdateVisitsInTreatmentPlan(treatmentPlan.treatmentPlanId, updatedVisits);

        reorderAllRows(newOrder);
    };


    const handleDeleteRow = (visitId, rowId) => {
        setAllRows(prevRows => {
            const updatedRows = prevRows[visitId].filter(row => row.id !== rowId);
            return { ...prevRows, [visitId]: updatedRows };
        });
        setDeletedRowIds(prevIds => [...prevIds, rowId]);
    };

    const handleDeleteVisit = (visitId) => {
        // Update the visitOrder to remove the visit
        setVisitOrder(prevOrder => prevOrder.filter(id => id !== visitId));
        // Update allRows to remove the rows associated with the visit
        setAllRows(prevRows => {
            const updatedRows = { ...prevRows };
            delete updatedRows[visitId];
            return updatedRows;
        });
        setDeletedVisitIds(prevIds => {
            const newDeletedVisitIds = [...prevIds, visitId];
            console.log("Deleted visit added, new deletedVisitIds:", newDeletedVisitIds);
            return newDeletedVisitIds;
        });
        onDeleteVisit(treatmentPlan.treatmentPlanId, visitId);
    };

    const createNewCombinedTreatmentPlanForPatient = async (treatmentPlan, allRows, visitOrder) => {
        console.log('Attempting to create a new combined treatment plan...'); 
        try {
            const newTreatmentPlan = await handleCreateNewTreatmentPlanForPatient(
                treatmentPlan,
                allRows,
                visitOrder,
                selectedPatient.patientId,
                selectedPayer.payerId,
                hasEdits
            );
            console.log('New treatment plan created successfully:', newTreatmentPlan); 
            return newTreatmentPlan;
        } catch (error) {
            console.error('Error in creating new treatment plan:', error);
        }
    };



    const handleUpdateTreatmentPlan = async () => {
        let proceedToUpdate = false; // Flag to determine if update logic should be executed

        try {
            if (isInGenerateTreatmentPlanContext) {
                const newCombinedTreatmentPlan = await createNewCombinedTreatmentPlanForPatient(treatmentPlan, allRows, visitOrder);
                setAlertInfo({ open: true, type: 'success', message: 'New treatment plan created successfully!' });
                //if no edits were made we return immediately 
                if (hasEdits) {
                    console.log("edits were made, we are going to create the treatment plan and then perform the update logic.")
                    proceedToUpdate = true; // Edits were made, so we need to proceed to update logic
                } else {
                    console.log("no edits we are returning immediately after creating the new treatment plan.")
                    await refreshPatientTreatmentPlans();
                    return;
                }
            }
            //if we are not in the generate treatment plan context we always go inside update logic
            if (!isInGenerateTreatmentPlanContext || proceedToUpdate) {
                console.log("we correctly proceeded with the update logic.")
                const tempVisitIds = visitOrder.filter(visitId => String(visitId).startsWith('temp-'));
                const createVisitPromises = tempVisitIds.map(tempVisitId => {
                    const visitData = mapToCreateVisitDto(treatmentPlan, allRows, tempVisitId);
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
                Object.keys(deepCopyAllRows).forEach(visitId => {
                    if (visitIdMap[visitId]) {
                        deepCopyAllRows[visitIdMap[visitId]] = deepCopyAllRows[visitId];
                        delete deepCopyAllRows[visitId];
                    }
                });

                // Update the state
                setAllRows(deepCopyAllRows);

                // Identify new procedures and associate them with actualVisitIds
                const newProcedures = [];
                Object.keys(deepCopyAllRows).forEach(visitId => {
                    deepCopyAllRows[visitId].forEach(row => {
                        if (!row.visitCdtCodeMapId && row.selectedCdtCode) {
                            newProcedures.push({
                                visitId: visitId,
                                CdtCodeId: row.selectedCdtCode.cdtCodeId,
                                Order: 0
                            });
                        }
                    });
                });

                // Send new procedures to backend and process the response
                const newProcedureResponse = await createNewProcedures(newProcedures);
                newProcedureResponse.forEach(proc => {
                    const { visitId, visitCdtCodeMapId, cdtCodeId } = proc;
                    const rows = deepCopyAllRows[visitId];
                    if (!rows) {
                        return;
                    }
                    const rowIndex = rows.findIndex(row => row.selectedCdtCode && row.selectedCdtCode.cdtCodeId === cdtCodeId);
                    if (rowIndex > -1) {
                        rows[rowIndex].visitCdtCodeMapId = visitCdtCodeMapId;
                    }
                });

                // Update the visit order with actualVisitIds
                const updatedVisitOrder = visitOrder.map(visitId => visitIdMap[visitId] || visitId);

                // Update the treatment plan visits
                const updatedVisits = treatmentPlan.visits.map(visit => {
                    const actualVisitId = visitIdMap[visit.visitId] || visit.visitId;
                    const updatedProcedures = deepCopyAllRows[actualVisitId]
                        ? deepCopyAllRows[actualVisitId]
                            .filter(row => row.selectedCdtCode !== null)
                            .map(row => {
                                return {
                                    visitCdtCodeMapId: row.visitCdtCodeMapId,
                                    cdtCodeId: row.selectedCdtCode.cdtCodeId,
                                    description: row.description,
                                    // ...additional properties possibly later
                                };
                            })
                        : visit.procedures;

                    return { ...visit, visitId: actualVisitId, procedures: updatedProcedures };
                });

                // Update local state for immediate reflection in the UI
                setLocalUpdatedVisits(updatedVisits);

                // Update allRows and visitOrder in state
                setVisitOrder(updatedVisitOrder);
                setAllRows(deepCopyAllRows);

                // update the treatment plan
                const updateDto = mapToUpdateTreatmentPlanDto(treatmentPlan, deepCopyAllRows, updatedVisitOrder, deletedRowIds, deletedVisitIds, editedRows);
                const updatedTreatmentPlan = await updateTreatmentPlan(treatmentPlan.treatmentPlanId, updateDto);

                onUpdateVisitsInTreatmentPlan(treatmentPlan.treatmentPlanId, updatedVisits);
                console.log('Updated Treatment Plan:', updatedTreatmentPlan);

                await refreshPatientTreatmentPlans();
                setAlertInfo({ open: true, type: 'success', message: 'Your changes have been saved successfully!' });
                setHasEdits(false); 
            }
        } catch (error) {
            console.error('Error updating treatment plan:', error);
        }
    };


    const lockDimensions = () => {
        const tables = document.querySelectorAll('.tx-table');
        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td, th');
                cells.forEach(cell => {
                    const computedStyle = window.getComputedStyle(cell);
                    cell.style.width = `${computedStyle.width}`;
                    cell.style.minWidth = `${computedStyle.width}`;
                });
            });
        });
    };

    const createHeaders = () => {
        let headers = ['Tooth #', 'CDT Code', 'Description', 'UCR Fee', 'Discount Fee'];
        return headers;
    };


    const constructStaticRowData = (row) => {
        return row.extraRowInput.map((input, index, array) => {
            // UCR Fee and Discount Fee are the last two elements in the array
            if (index === array.length - 2 || index === array.length - 1) {
                // Replace null or undefined fees with "NA"
                return input != null ? input.toString() : "NA";
            }
            return input;
        });
    };


    const constructDynamicRowData = (row, visitId) => {
        const ucrFee = row.extraRowInput[2];
        const discountFee = row.extraRowInput[3];
        const dropdownKey = `dropdown-${row.id}`;
        const cdtDropdown = <DropdownSearch
            key={dropdownKey}
            items={combinedCdtCodes}
            selectedItem={row.selectedCdtCode}
            onSelect={(selectedCode) => handleSelect(selectedCode, visitId, row.id)}
            itemLabelFormatter={(cdtCode) => `${cdtCode.code} - ${cdtCode.longDescription}`}
            valueKey="code"
            labelKey="longDescription"
        />;

        const toothNumber = row.selectedCdtCode && row.selectedCdtCode.toothNumber ? row.selectedCdtCode.toothNumber.toString() : '';
        return [toothNumber, cdtDropdown, row.description, ucrFee, discountFee];
    };


    const handleCancelEdit = (rowId, visitId) => {
        setEditingRowId(null);
        setAllRows(prevAllRows => {
            const rows = prevAllRows[visitId];
            const updatedRows = rows.map(row => {
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
        setAllRows(prevAllRows => {
            const rows = prevAllRows[visitId];
            const updatedRows = rows.map(row => {
                if (row.id === rowId) {
                    const editedRow = convertToStaticRow(row, visitId, row.selectedCdtCode, row.description);
                    // This step might require adjustments depending on how you track edits
                    setEditedRows(prev => [...prev, { ...editedRow, visitId }]); // Storing full row data and visitId

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
                        onClick={() => handleDeleteRow(visitId, row.id)}
                    />
                </StyledEditDeleteIconsContainer>
            );
        }
        return null;
    }

    const padRowData = (rowData, headers) => {
        while (rowData.length < headers.length - 1) {
            rowData.push(''); // Add empty strings for missing cells
        }
        return rowData;
    };


    const createTableRow = (row, visitId, headers, index) => {
        const isStaticRow = row.isStatic;
        let rowData = isStaticRow ? constructStaticRowData(row) : constructDynamicRowData(row, visitId);

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

        return {
            id: row.id,
            data: rowData,
        };
    };

    const handleEditRow = (rowId, visitId) => {
        // Directly access the rows for the specific visitId
        const rows = allRows[visitId];
        const rowIndex = rows.findIndex(row => row.id === rowId);

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
            setAllRows(prevAllRows => ({
                ...prevAllRows,
                [visitId]: updatedRows, // Only update the rows for the specific visit
            }));
        } else {
            console.error("Row not found with rowId:", rowId, "in visitId:", visitId);
        }
    };

    const columnWidths = ['5%', '10%', '10%', '45%', '15%', '15%', '5%'];

    const renderVisit = (visitId, index) => {
        console.log(`Rendering visit: visitId=${visitId}, index=${index}`);
        const visitIdStr = String(visitId);
        const isTempVisit = visitIdStr.startsWith('temp-');
        
        const visit = isTempVisit
            ? { visitId: visitIdStr, visit_number: index + 1 }
            : localUpdatedVisits.find(v => String(v.visitId) === visitIdStr);

        if (!visit) {
            return null;
        }
        const draggableKey = isTempVisit ? `temp-visit-${index}` : `visit-${visit.visitId}`;
        const headers = createHeaders();

        if (!allRows[visitIdStr]) {
            return null;
        }

        const tableRows = allRows[visitIdStr].map((row, rowIndex) => {
            return createTableRow(row, visit.visitId, headers, rowIndex, allRows[visitIdStr]);
        });
        const categoryName = visit.procedureCategoryName;
        return (
            <Draggable key={draggableKey} draggableId={`visit-${visit.visitId}`} index={index} type="table">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className={`visit-section ${index > 0 ? 'visit-separator' : ''}`}>
                        {categoryName && <StyledTableLabelText>{categoryName}</StyledTableLabelText>}
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
                    </div>
                )}
            </Draggable>
        );
    };

    return (
        <>
            <SaveButtonRow onSave={handleUpdateTreatmentPlan} />

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
                    onDragEnd={(result) => result.type === "table" ? onTableDragEnd(result) : onDragEnd(result)}
                    onBeforeDragStart={lockDimensions}
                >
                    <Droppable droppableId="visits-droppable" type="table" direction="vertical">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="table-container">
                                {visitOrder.map((visitId, index) => renderVisit(visitId, index))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
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
    imageIconSrc: PropTypes.string,
    hideToothNumber: PropTypes.bool
};

TreatmentPlanOutput.defaultProps = {
    includeExtraRow: false,
    imageIconSrc: false,
};

export default TreatmentPlanOutput;