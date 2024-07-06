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
import SaveButtonRow from "../../../../Components/Common/SaveButtonRow/index";
import { CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';
import { selectActiveCdtCodes, selectPayersForFacility, fetchPayersWithCdtCodesFeesForFacility } from '../../../../Redux/ReduxSlices/CdtCodesAndPayers/cdtCodeAndPayersSlice';
import { showAlert } from '../../../../Redux/ReduxSlices/Alerts/alertSlice';
import { useGetDefaultCdtCodesQuery, useGetCustomCdtCodesQuery } from '../../../../Redux/ReduxSlices/CdtCodes/cdtCodesApiSlice';

const EditFacilityFeeScheduling = () => {
    const dispatch = useDispatch();
    const { payerId } = useParams();
    const location = useLocation();
    const initialPayerName = location.state?.payerName || 'Unknown Payer';
    const [payerNameInputText, setPayerNameInputText] = useState(initialPayerName);
    const [searchInputText, setSearchInputText] = useState('');
    const headers = ["CDT Code", "Description", "UCR Fee", "Coverage %", ""];
    const columnWidths = ['20%', '45%', '15%', '15%', '5%'];
    const [alertInfo, setAlertInfo] = useState({ open: false, type: '', message: '' });
    const [editingRowId, setEditingRowId] = useState(null);
    const [originalRowData, setOriginalRowData] = useState(null);
    const [activeRowsData, setActiveRowsData] = useState([]);
    const [inactiveRowsData, setInactiveRowsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const activeCdtCodes = useSelector(selectActiveCdtCodes);
    const payers = useSelector(selectPayersForFacility);

    // New hooks to fetch default and custom CDT codes
    const { data: defaultCdtCodes = [], isLoading: isDefaultLoading } = useGetDefaultCdtCodesQuery();
    const { data: facilityCdtCodes = [], isLoading: isFacilityLoading } = useGetCustomCdtCodesQuery();

    useEffect(() => {
        setIsLoading(isDefaultLoading || isFacilityLoading);
    }, [isDefaultLoading, isFacilityLoading]);

    useEffect(() => {
        if (!isLoading && defaultCdtCodes.length > 0 && facilityCdtCodes.length > 0) {
            const payerFees = payers.find(payer => payer.payerId === parseInt(payerId))?.cdtCodeFees || [];

            const combinedCdtCodes = [...defaultCdtCodes, ...facilityCdtCodes];
            console.log('Combined CDT Codes:', combinedCdtCodes); // Add this line to check combinedCdtCodes

            const _activeRowsData = [];
            const _inactiveRowsData = [];
            console.log("payerFees: ", payerFees);
            combinedCdtCodes.forEach(code => {
                const fee = payerFees.find(f => f.cdtCodeId === code.cdtCodeId);
                const rowData = {
                    id: code.cdtCodeId.toString(),
                    code: code.code,
                    description: code.longDescription,
                    ucrFee: fee?.ucrDollarAmount ?? '',
                    coveragePercent: fee?.coveragePercent ?? '',
                    coPay: fee?.coPay ?? '',
                    isStatic: true
                };
                console.log('Row Data:', rowData);
                if (activeCdtCodes.includes(code.cdtCodeId)) {
                    _activeRowsData.push(rowData);
                } else {
                    _inactiveRowsData.push(rowData);
                }
            });

            console.log('Active Rows Data:', _activeRowsData); // Debugging log
            console.log('Inactive Rows Data:', _inactiveRowsData); // Debugging log

            setActiveRowsData(_activeRowsData);
            setInactiveRowsData(_inactiveRowsData);
        }
    }, [payers, facilityCdtCodes, defaultCdtCodes, payerId, activeCdtCodes, isLoading]);


    const renderStaticRow = (row, index) => ([
        <span key={`code-${index}`}>{row.code}</span>,
        <span key={`description-${index}`}>{row.description}</span>,
        <span key={`ucrFee-${index}`}>{row.ucrFee ? `$${row.ucrFee}` : ''}</span>,
        <span key={`coveragePercent-${index}`}>{row.coveragePercent ? `${row.coveragePercent}%` : ''}</span>,
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
                key={`coveragePercent-${index}`}
                value={row.coveragePercent}
                onChange={(e) => handleInputChange(row.id, 'coveragePercent', e.target.value)}
                borderColor={UI_COLORS.purple}
                width="300px"
                adornment={<InputAdornment position="start">%</InputAdornment>}
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
            CoveragePercent: parseFloat(row.coveragePercent)
        }));

        // Existing fees being updated
        const updatedFees = combinedRowsData.filter(row => row.UcrFeeId && row.isEdited).map(row => ({
            UcrFeeId: parseInt(row.UcrFeeId, 10),
            UcrDollarAmount: parseFloat(row.ucrFee),
            CoveragePercent: parseFloat(row.coveragePercent)
        }));

        let editedPayer = null;
        if (initialPayerName !== payerNameInputText) {
            editedPayer = {
                Id: parseInt(payerId, 10),
                PayerName: payerNameInputText,
            };
        }

        const payload = {
            payerId: parseInt(payerId, 10),
            newFees: newFees,
            updatedFees: updatedFees,
            editedPayer: editedPayer,
        };

        const response = await updateFacilityPayerCdtCodeFees(payload);
        if (response) {
            dispatch(showAlert({ type: 'success', message: 'Your changes were saved successfully!' }));
            dispatch(fetchPayersWithCdtCodesFeesForFacility());
        } else {
            dispatch(showAlert({ type: 'error', message: 'Your changes failed to save' }));
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
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress style={{ color: "rgb(119, 119, 161)" }} />
                    </div>
                ) : (
                    <StyledRoundedBoxContainerInner>
                        <SaveButtonRow onSave={saveFacilityPayerCdtCodeFeesChanges}>
                            <StandardTextfield
                                value={payerNameInputText}
                                onChange={(e) => setPayerNameInputText(e.target.value)}
                                borderColor={UI_COLORS.purple}
                                width="300px"
                            />
                        </SaveButtonRow>
                        <StyledTableLabelText>Active CDT Codes</StyledTableLabelText>
                        <UniversalTable headers={headers} rows={activeTableRows} columnWidths={columnWidths} />
                        <StyledTableLabelText>Inactive CDT Codes</StyledTableLabelText>
                        <UniversalTable headers={headers} rows={inactiveTableRows} columnWidths={columnWidths} />
                    </StyledRoundedBoxContainerInner>
                )}
            </StyledRoundedBoxContainer>
        </div>
    );

};

export default EditFacilityFeeScheduling;
