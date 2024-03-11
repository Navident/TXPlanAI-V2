import { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import searchIcon from '../../../assets/search-icon.svg';
import TextField from '@mui/material/TextField';
import StandardTextfield from '../../../Components/Common/StandardTextfield/StandardTextfield';
import UniversalTable from '../../../Components/Common/UniversalTable/UniversalTable';
import { StyledRoundedBoxContainer, StyledAddButtonCellContainer, StyledClickableText, StyledEditIcon, StyledDeleteIcon, StyledEditDeleteIconsContainer, StyledSaveTextBtn, StyledLightGreyText, StyledRoundedBoxContainerInner, StyledSemiboldBlackTitle } from '../../../GlobalStyledComponents';
import { updateCustomFacilityCdtCodes } from '../../../ClientServices/apiService';
import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import deleteIcon from '../../../assets/delete-x.svg';
import pencilEditIcon from '../../../assets/pencil-edit-icon.svg';
import { UI_COLORS } from '../../../Theme';
import { useBusiness } from '../../../Contexts/BusinessContext/useBusiness';
import SaveButtonRow from "../../../Components/Common/SaveButtonRow/index";
import { showAlert } from '../../../Redux/ReduxSlices/Alerts/alertSlice';
import { useDispatch } from 'react-redux';

const CustomCdtCodes = () => {
    const { facilityCdtCodes } = useBusiness(); 
    const [inputText, setInputText] = useState('');
    const [rowsData, setRowsData] = useState([]);
    const headers = ["CDT Code", "Description", ""];
    const [deletedCdtCodes, setDeletedCdtCodes] = useState([]);
    const [editingRowId, setEditingRowId] = useState(null);
    const [originalRowData, setOriginalRowData] = useState(null);
    const dispatch = useDispatch()

    useEffect(() => {
        let staticRows = [];
        if (facilityCdtCodes && facilityCdtCodes.length > 0) {
            staticRows = facilityCdtCodes.map(code => ({
                id: code.cdtCodeId.toString(),
                code: code.code,
                description: code.longDescription,
                isStatic: true
            }));
        }
        // Always add an empty row for adding new CDT codes, regardless of whether there are existing codes
        const dynamicRow = { id: `dynamic-${Date.now()}`, code: '', description: '', isStatic: false };
        setRowsData([...staticRows, dynamicRow]);
    }, [facilityCdtCodes]);


    const renderStaticRow = (row, index) => ([
        <span key={`code-${index}`}>{row.code}</span>,
        <span key={`description-${index}`}>{row.description}</span>,
        createDeleteIconCell(row, index)
    ]);

    const renderDynamicRow = (row, index) => {
        const isAddButtonRow = index === rowsData.length - 1;

        const lastCell = isAddButtonRow ?
            createAddButtonCell() :
            (row.id === editingRowId ? renderDoneCancelText(row.id) : null);

        return [
            <StandardTextfield
                key={`code-${index}`}
                value={row.code}
                onChange={(e) => handleInputChange(index, 'code', e.target.value)}
                borderColor={UI_COLORS.purple}
                width="180px"
            />,
            <StandardTextfield
                key={`description-${index}`}
                value={row.description}
                onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                borderColor={UI_COLORS.purple}
                width="300px"
            />,
            lastCell
        ];
    };


    const rows = rowsData.map((row, index) => {
        return {
            data: row.isStatic ?
                renderStaticRow(row, index) :
                renderDynamicRow(row, index)
        };
    });


    const handleDeleteRow = (rowId) => {
        setRowsData(prevRowsData => prevRowsData.filter(row => row.id !== rowId));
        if (!rowId.startsWith('dynamic')) {
            setDeletedCdtCodes(prev => [...prev, rowId]); 
        }
    };

    function addNewRow() {
        setRowsData(prevRowsData => {
            const newRowsData = [...prevRowsData];
            const lastRow = newRowsData[newRowsData.length - 1];

            if (lastRow.id.startsWith('dynamic') && lastRow.code.trim() && lastRow.description.trim()) {
                lastRow.id = `static-${Date.now()}`;
                lastRow.isStatic = true;
                lastRow.isNew = true;

                newRowsData.push({ id: `dynamic-${Date.now()}`, code: '', description: '', isStatic: false, isNew: true });
            }

            return newRowsData;
        });
    }

    function createAddButtonCell() {
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
                    onClick={addNewRow}
                />
            </StyledAddButtonCellContainer>
        );
    }

    const handleEditRow = (rowId) => {
        const originalRow = rowsData.find(row => row.id === rowId);
        console.log("Original row data:", originalRow); 
        setOriginalRowData(originalRow);
        setEditingRowId(rowId);
        setRowsData(prevRowsData => prevRowsData.map(row => {
            if (row.id === rowId) {
                return { ...row, isStatic: false };
            }
            return row;
        }));
    };

    const handleDoneEdit = (rowId) => {
        setEditingRowId(null);
        setRowsData(prevRowsData => prevRowsData.map(row => {
            if (row.id === rowId) {
                // Convert the row back to static and mark it as edited
                return { ...row, isStatic: true, isEdited: true };
            }
            return row;
        }));
    };

    const handleCancelEdit = (rowId) => {
        setEditingRowId(null);
        if (originalRowData && originalRowData.id === rowId) {
            setRowsData(prevRowsData => prevRowsData.map(row => {
                if (row.id === rowId) {
                    // convert the row back to static and revert the changes
                    return { ...originalRowData, isStatic: true };
                }
                return row;
            }));
        }
        setOriginalRowData(null); 
    };

    function renderDoneCancelText(rowId) { 
        return (
            <StyledEditDeleteIconsContainer>
                <StyledClickableText onClick={() => handleDoneEdit(rowId)}>
                    Done
                </StyledClickableText>
                <StyledClickableText onClick={() => handleCancelEdit(rowId)}>
                    Cancel
                </StyledClickableText>
            </StyledEditDeleteIconsContainer>
        );
    }

    function createDeleteIconCell(row, index) {
        console.log("Creating delete icon cell for row:", row.id);
        const isNotLastRow = index !== rowsData.length - 1;
        if (row.isStatic && isNotLastRow) {
            return (
                <StyledEditDeleteIconsContainer>
                    <StyledEditIcon
                        src={pencilEditIcon}
                        alt="Edit Icon"
                        onClick={() => handleEditRow(row.id)}
                    />
                    <StyledDeleteIcon
                        src={deleteIcon}
                        alt="Delete Icon"
                        onClick={() => handleDeleteRow(row.id)}
                    />
                </StyledEditDeleteIconsContainer>
            );
        }
        return null;
    }

    const handleInputChange = (index, field, value) => {
        setRowsData(prevRowsData => prevRowsData.map((row, i) => {
            if (i === index && (row.id === editingRowId || row.id.startsWith('dynamic'))) {
                return { ...row, [field]: value, isNew: row.id.startsWith('dynamic') };
            }
            return row;
        }));
    };


    const updateCustomCdtCodes = async () => {
        const newCdtCodes = rowsData
            .filter(row => row.isNew && row.code.trim() && row.description.trim())
            .map(row => ({
                Code: row.code,
                LongDescription: row.description
            }));

        const editedCdtCodes = rowsData
            .filter(row => row.isEdited && !row.isNew)
            .map(row => ({
                Id: parseInt(row.id, 10),
                Code: row.code,
                LongDescription: row.description
            }));

        const deletedCdtCodeIds = deletedCdtCodes.map(id => parseInt(id, 10));

        const updateData = {
            NewCdtCodes: newCdtCodes,
            EditedCdtCodes: editedCdtCodes,
            DeletedCdtCodeIds: deletedCdtCodeIds
        };
        const response = await updateCustomFacilityCdtCodes(updateData);
        if (response) { 
            dispatch(showAlert({ type: 'success', message: 'Your changes were saved successfully!' }));
        } else {
            dispatch(showAlert({ type: 'error', message: 'Failed to save changes' }));
        }
    };
    return (
        <div className="default-procedure-management-wrapper">
            <div className="dashboard-right-side-row">
                <StyledSemiboldBlackTitle>Custom CDT Codes</StyledSemiboldBlackTitle>
                <TextField
                    className="rounded-box"
                    placeholder="Search CDT Codes"
                    value={inputText}
                    onChange={handleInputChange}
                    sx={{
                        width: '350px',
                        backgroundColor: 'white',
                        '& label.Mui-focused': {
                            color: UI_COLORS.purple,
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'rgba(0, 0, 0, 0)',
                            },
                            '&:hover fieldset': {
                                borderColor: UI_COLORS.purple,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: UI_COLORS.purple,
                            },
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <img src={searchIcon} alt="Search" />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <StyledRoundedBoxContainer>
                <StyledRoundedBoxContainerInner>
                    <SaveButtonRow onSave={updateCustomCdtCodes} gap="120px">
                        <StyledLightGreyText>
                            Custom CDT codes are CDT codes that are not a part of the
                            standard CDT codes used by the American Dental Association
                            but rather, made up codes that your facility creates to fill up an appointment slot.
                        </StyledLightGreyText>
                    </SaveButtonRow>
                    <UniversalTable headers={headers} rows={rows} />
                </StyledRoundedBoxContainerInner>
            </StyledRoundedBoxContainer>
        </div>
    );
};

export default CustomCdtCodes;


