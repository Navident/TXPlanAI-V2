import { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import searchIcon from '../../../assets/search-icon.svg';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import StandardTextfield from '../../../Components/Common/StandardTextfield/StandardTextfield';
import UniversalTable from '../../../Components/Common/UniversalTable/UniversalTable';
import { StyledRoundedBoxContainer, StyledAddButtonCellContainer, StyledClickableText, StyledEditIcon, StyledDeleteIcon, StyledEditDeleteIconsContainer, StyledSaveTextBtn, StyledLightGreyText, StyledRoundedBoxContainerInner, StyledSemiboldBlackTitle } from '../../../GlobalStyledComponents';
import { updateFacilityPayers } from '../../../ClientServices/apiService';
import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import deleteIcon from '../../../assets/delete-x.svg';
import pencilEditIcon from '../../../assets/pencil-edit-icon.svg';
import { UI_COLORS } from '../../../Theme';
import { useBusiness } from '../../../Contexts/BusinessContext/useBusiness';
import Alert from "../../../Components/Common/Alert/Alert";
import { Outlet } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

const FeeScheduling = () => {
    const { payers } = useBusiness();
    const [inputText, setInputText] = useState('');
    const [rowsData, setRowsData] = useState([]);
    const headers = ["Payer", ""];
    const [deletedPayers, setDeletedPayers] = useState([]);
    const [alertInfo, setAlertInfo] = useState({ open: false, type: '', message: '' });
    const [editingRowId, setEditingRowId] = useState(null);
    const [originalRowData, setOriginalRowData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isEditingFacilityFeeScheduling = location.pathname.includes("/feescheduling/edit");

    useEffect(() => {
        let payerRows = [];
        if (payers && payers.length > 0) {
            payerRows = payers.map(payer => ({
                id: payer.payerId.toString(),
                payerName: payer.payerName,
                isStatic: true
            }));
        }
        const newPayerRow = { id: `dynamic-${Date.now()}`, payerName: '', isStatic: false };
        setRowsData([...payerRows, newPayerRow]);
    }, [payers]);


    const handleEditButtonClick = (payerId, payerName) => {
        navigate(`/dashboard/feescheduling/edit/${payerId}`, { state: { payerName } });
    };


    const renderStaticRow = (row, index) => ([
        <span key={`payerName-${index}`}>{row.payerName}</span>,
        createDeleteIconCell(row, index)
    ]);

    const renderDynamicRow = (row, index) => {
        const isAddButtonRow = index === rowsData.length - 1;

        const lastCell = isAddButtonRow ?
            createAddButtonCell() :
            (row.id === editingRowId ? renderDoneCancelText(row.id) : null);

        return [
            <StandardTextfield
                key={`payerName-${index}`}
                value={row.payerName}
                onChange={(e) => handlePayerNameChange(index, e.target.value)}
                borderColor={UI_COLORS.purple}
                width="180px"
                placeholder="Payer Name"
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
            setDeletedPayers(prev => [...prev, rowId]);
        }
    };

    function addNewRow() {
        setRowsData(prevRowsData => {
            const newRowsData = [...prevRowsData];
            const lastRow = newRowsData[newRowsData.length - 1];
            console.log("lastRow.id", lastRow.id);
            if (lastRow.id.startsWith('dynamic') && lastRow.payerName.trim()) {

                lastRow.id = `static-${Date.now()}`;
                lastRow.isStatic = true;
                lastRow.isNew = true;

                newRowsData.push({ id: `dynamic-${Date.now()}`, payerName: '', isStatic: false, isNew: true });
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

    /*    const handleEditRow = (rowId) => {
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
        };*/

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
                    // Convert the row back to static and revert the changes
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
                        onClick={() => handleEditButtonClick(row.id, row.payerName)}
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

    const handlePayerNameChange = (index, value) => {
        setRowsData(prevRowsData => prevRowsData.map((row, i) => {
            if (i === index) {
                return { ...row, payerName: value };
            }
            return row;
        }));
    };

    const updatePayers = async () => {
        const newPayers = rowsData
            .filter(row => row.isNew && row.payerName.trim())
            .map(row => ({
                PayerName: row.payerName,
            }));

        const editedPayers = rowsData
            .filter(row => row.isEdited && !row.isNew)
            .map(row => ({
                Id: parseInt(row.id, 10),
                PayerName: row.payerName,
            }));

        const deletedPayerIds = deletedPayers.map(id => parseInt(id, 10));

        const updateData = {
            NewPayers: newPayers,
            EditedPayers: editedPayers,
            DeletedPayerIds: deletedPayerIds
        };
        const response = await updateFacilityPayers(updateData);
        if (response) {
            setAlertInfo({ open: true, type: 'success', message: 'Your changes have been saved' });
        } else {
            setAlertInfo({ open: true, type: 'error', message: 'Failed to save changes' });
        }
    };

    const handleCloseAlert = () => {
        setAlertInfo({ ...alertInfo, open: false });
    };

    const handleSearchChange = (event) => {
        setInputText(event.target.value.toLowerCase());
    };

    // Filter rowsData based on inputText
    const filteredRowsData = rowsData.filter(row => row.payerName.toLowerCase().includes(inputText));

    const renderRows = () => {
        // Map over filteredRowsData instead of rowsData
        return filteredRowsData.map((row, index) => {
            return {
                data: row.isStatic ?
                    renderStaticRow(row, index) :
                    renderDynamicRow(row, index)
            };
        });
    };


    return (
        <div className="default-procedure-management-wrapper">
            {isEditingFacilityFeeScheduling ? (
                <Outlet />
            ) : (
                <>
                    <div className="dashboard-right-side-row">
                        <StyledSemiboldBlackTitle>Fee Scheduling</StyledSemiboldBlackTitle>
                        <TextField
                            className="rounded-box"
                            placeholder="Search Payers"
                            value={inputText}
                            onChange={handleSearchChange}
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
                                <UniversalTable headers={headers} rows={renderRows()} />
                            <StyledSaveTextBtn onClick={updatePayers}>
                                Save
                            </StyledSaveTextBtn>
                        </StyledRoundedBoxContainerInner>
                    </StyledRoundedBoxContainer>
                    {alertInfo.type && (
                        <Alert
                            open={alertInfo.open}
                            handleClose={handleCloseAlert}
                            type={alertInfo.type}
                            message={alertInfo.message}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default FeeScheduling;


