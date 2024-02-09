import GoBack from "../../../../Components/Common/GoBack/GoBack";
import { useParams, useLocation } from 'react-router-dom';
import { UI_COLORS } from '../../../../Theme';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import searchIcon from '../../../../assets/search-icon.svg';
import StandardTextfield from '../../../../Components/Common/StandardTextfield/StandardTextfield';
import { StyledRoundedBoxContainer, StyledTableLabelText, StyledAddButtonCellContainer, StyledClickableText, StyledEditIcon, StyledDeleteIcon, StyledEditDeleteIconsContainer, StyledSaveTextBtn, StyledLightGreyText, StyledRoundedBoxContainerInner, StyledSemiboldBlackTitle } from '../../../../GlobalStyledComponents';
import UniversalTable from '../../../../Components/Common/UniversalTable/UniversalTable';
import { useBusiness } from '../../../../Contexts/BusinessContext/useBusiness';
import pencilEditIcon from '../../../../assets/pencil-edit-icon.svg';
import { updateFacilityPayerCdtCodeFees } from '../../../../ClientServices/apiService';

const EditFacilityFeeScheduling = () => {
    const { payerId } = useParams();
    const location = useLocation();
    const initialPayerName = location.state?.payerName || 'Unknown Payer';
    const [payerNameInputText, setPayerNameInputText] = useState(initialPayerName);
    const [searchInputText, setSearchInputText] = useState('');
    const [rowsData, setRowsData] = useState([]);
    const headers = ["CDT Code", "Description", "UCR Fee", "Discount Fee", ""];
    const columnWidths = ['20%', '45%', '15%', '15%', '5%'];
    const [alertInfo, setAlertInfo] = useState({ open: false, type: '', message: '' });
    const [editingRowId, setEditingRowId] = useState(null);
    const [originalRowData, setOriginalRowData] = useState(null);
    const { facilityCdtCodes, defaultCdtCodes, facilityPayerCdtCodeFees, fetchFacilityPayerCdtCodeFees, activeCdtCodes } = useBusiness(); 
    const [activeRowsData, setActiveRowsData] = useState([]);
    const [inactiveRowsData, setInactiveRowsData] = useState([]);

    useEffect(() => {
        fetchFacilityPayerCdtCodeFees(payerId);
    }, [payerId]);

    useEffect(() => {
        const combinedCdtCodes = [...defaultCdtCodes, ...facilityCdtCodes];
        if (combinedCdtCodes.length > 0) {
            const _activeRowsData = [];
            const _inactiveRowsData = [];

            combinedCdtCodes.forEach(code => {
                const fees = facilityPayerCdtCodeFees.find(fee => parseInt(fee.cdtCodeId) === parseInt(code.cdtCodeId));
                const rowData = {
                    id: code.cdtCodeId.toString(),
                    code: code.code,
                    description: code.longDescription,
                    ucrFee: fees?.ucrDollarAmount ?? '',
                    discountFee: fees?.discountFeeDollarAmount ?? '',
                    isStatic: true
                };

                if (activeCdtCodes.includes(code.cdtCodeId)) {
                    _activeRowsData.push(rowData);
                } else {
                    _inactiveRowsData.push(rowData);
                }
            });

            setActiveRowsData(_activeRowsData);
            setInactiveRowsData(_inactiveRowsData);
        }
    }, [facilityCdtCodes, defaultCdtCodes, facilityPayerCdtCodeFees, activeCdtCodes]);

    const renderStaticRow = (row, index) => ([
        <span key={`code-${index}`}>{row.code}</span>,
        <span key={`description-${index}`}>{row.description}</span>,
        <span key={`ucrFee-${index}`}>{row.ucrFee ? `$${row.ucrFee}` : ''}</span>,
        <span key={`discountFee-${index}`}>{row.discountFee ? `$${row.discountFee}` : ''}</span>,
        createDeleteAndEditIconCell(row, index)
    ]);

    const renderDynamicRow = (row, index) => {
        const lastCell = (row.id === editingRowId ? renderDoneCancelText(row.id) : null);

        return [
            <span key={`code-${index}`}>{row.code}</span>,
            <span key={`description-${index}`}>{row.description}</span>, 
            <StandardTextfield 
                key={`ucrFee-${index}`}
                value={row.ucrFee}
                onChange={(e) => handleInputChange(row.id, 'ucrFee', e.target.value)}
                borderColor={UI_COLORS.purple}
                width="180px"
                adornment={<InputAdornment position="start">$</InputAdornment>}
            />,
            <StandardTextfield 
                key={`discountFee-${index}`}
                value={row.discountFee}
                onChange={(e) => handleInputChange(row.id, 'discountFee', e.target.value)}
                borderColor={UI_COLORS.purple}
                width="300px"
                adornment={<InputAdornment position="start">$</InputAdornment>}
            />,
            lastCell
        ];
    };

    // Filter active and inactive rows based on search input text
    const filteredActiveRowsData = activeRowsData.filter(row =>
        row.code.toLowerCase().includes(searchInputText) || row.description.toLowerCase().includes(searchInputText)
    );
    const filteredInactiveRowsData = inactiveRowsData.filter(row =>
        row.code.toLowerCase().includes(searchInputText) || row.description.toLowerCase().includes(searchInputText)
    );

    // Render filtered active CDT Codes Table Rows
    const activeTableRows = filteredActiveRowsData.map((row, index) => ({
        data: row.isStatic ? renderStaticRow(row, index) : renderDynamicRow(row, index),
    }));

    // Render filtered inactive CDT Codes Table Rows
    const inactiveTableRows = filteredInactiveRowsData.map((row, index) => ({
        data: row.isStatic ? renderStaticRow(row, index) : renderDynamicRow(row, index),
    }));


    const saveFacilityPayerCdtCodeFeesChanges = async () => {
        // Combine active and inactive rows before filtering and mapping
        const combinedRowsData = [...activeRowsData, ...inactiveRowsData];

        // New Fees being created
        const newFees = combinedRowsData.filter(row => !row.UcrFeeId && row.isEdited).map(row => ({
            CdtCodeId: parseInt(row.id, 10),
            UcrDollarAmount: parseFloat(row.ucrFee),
            DiscountFeeDollarAmount: parseFloat(row.discountFee)
        }));

        // Existing fees being updated
        const updatedFees = combinedRowsData.filter(row => row.UcrFeeId && row.isEdited).map(row => ({
            UcrFeeId: parseInt(row.UcrFeeId, 10),
            UcrDollarAmount: parseFloat(row.ucrFee),
            DiscountFeeDollarAmount: parseFloat(row.discountFee)
        }));

        const payload = {
            payerId: parseInt(payerId, 10),
            newFees: newFees,
            updatedFees: updatedFees,
        };

        const response = await updateFacilityPayerCdtCodeFees(payload);
        if (response) {
            setAlertInfo({ open: true, type: 'success', message: 'Your changes have been saved' });
        } else {
            setAlertInfo({ open: true, type: 'error', message: 'Failed to save changes' });
        }
    };


    const handleEditRow = (rowId) => {
        // Determine if the row is active or inactive
        let isRowActive = activeRowsData.some(row => row.id === rowId);
        let originalRow;

        if (isRowActive) {
            originalRow = activeRowsData.find(row => row.id === rowId);
            setActiveRowsData(prevRows => prevRows.map(row =>
                row.id === rowId ? { ...row, isStatic: false } : row
            ));
        } else {
            originalRow = inactiveRowsData.find(row => row.id === rowId);
            setInactiveRowsData(prevRows => prevRows.map(row =>
                row.id === rowId ? { ...row, isStatic: false } : row
            ));
        }

        setOriginalRowData(originalRow);
        setEditingRowId(rowId);
    };

    const handleDoneEdit = (rowId) => {
        setEditingRowId(null);
        const isRowActive = activeRowsData.some(row => row.id === rowId);

        if (isRowActive) {
            setActiveRowsData(prevRows => prevRows.map(row => {
                if (row.id === rowId) {
                    const isRowModified = JSON.stringify(row) !== JSON.stringify(originalRowData);
                    return { ...row, isStatic: true, isEdited: isRowModified };
                }
                return row;
            }));
        } else {
            setInactiveRowsData(prevRows => prevRows.map(row => {
                if (row.id === rowId) {
                    const isRowModified = JSON.stringify(row) !== JSON.stringify(originalRowData);
                    return { ...row, isStatic: true, isEdited: isRowModified };
                }
                return row;
            }));
        }
    };

    const handleCancelEdit = (rowId) => {
        setEditingRowId(null);
        if (originalRowData && originalRowData.id === rowId) {
            // Determine if the row is active or inactive
            const isRowActive = activeRowsData.some(row => row.id === rowId);

            if (isRowActive) {
                setActiveRowsData(prevRows => prevRows.map(row =>
                    row.id === rowId ? { ...originalRowData, isStatic: true } : row
                ));
            } else {
                setInactiveRowsData(prevRows => prevRows.map(row =>
                    row.id === rowId ? { ...originalRowData, isStatic: true } : row
                ));
            }
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

    function createDeleteAndEditIconCell(row) {
            return (
                <StyledEditDeleteIconsContainer>
                    <StyledEditIcon
                        src={pencilEditIcon}
                        alt="Edit Icon"
                        onClick={() => handleEditRow(row.id)}
                    />

                </StyledEditDeleteIconsContainer>
            );
    }

    const handleInputChange = (rowId, field, value) => {
        const updateRowData = (rows) => rows.map(row => {
            if (row.id === rowId) {
                return { ...row, [field]: value };
            }
            return row;
        });

        if (activeRowsData.some(row => row.id === rowId)) {
            setActiveRowsData(prevRows => updateRowData(prevRows));
        } else {
            setInactiveRowsData(prevRows => updateRowData(prevRows));
        }
    };

    const handleSearchChange = (event) => {
        setSearchInputText(event.target.value.toLowerCase());
    };

    return (
        <div className="procedure-customizer-wrapper">
            <div className="dashboard-right-side-row">
                <GoBack text="Go Back" />

                <TextField
                    className="rounded-box"
                    placeholder="Search CDT Codes"
                    value={searchInputText}
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
                    <StandardTextfield
                        value={payerNameInputText}
                        //onChange={handleSearchChange}
                        borderColor={UI_COLORS.purple}
                        width="300px"
                    />
                    <StyledTableLabelText>Active CDT Codes</StyledTableLabelText>
                    <UniversalTable headers={headers} rows={activeTableRows} columnWidths={columnWidths} />
                    <StyledTableLabelText>Inactive CDT Codes</StyledTableLabelText>
                    <UniversalTable headers={headers} rows={inactiveTableRows} columnWidths={columnWidths} />
                    <StyledSaveTextBtn onClick={saveFacilityPayerCdtCodeFeesChanges}>
                        Save
                    </StyledSaveTextBtn>
                </StyledRoundedBoxContainerInner>
            </StyledRoundedBoxContainer>
        </div>
    );
};

export default EditFacilityFeeScheduling;
