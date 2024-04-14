import { useState, useEffect } from 'react';

import StandardTextfield from '../../../Components/Common/StandardTextfield/StandardTextfield';
import UniversalTable from '../../../Components/Common/UniversalTable/UniversalTable';
import { StyledRoundedBoxContainer, StyledAddButtonCellContainer, StyledClickableText, StyledEditIcon, StyledDeleteIcon, StyledEditDeleteIconsContainer, StyledSaveTextBtn, StyledLightGreyText, StyledRoundedBoxContainerInner, StyledSemiboldBlackTitle } from '../../../GlobalStyledComponents';
import RoundedButton from "../../../Components/Common/RoundedButton/RoundedButton";
import deleteIcon from '../../../assets/delete-x.svg';
import pencilEditIcon from '../../../assets/pencil-edit-icon.svg';
import { UI_COLORS } from '../../../Theme';
import SaveButtonRow from "../../../Components/Common/SaveButtonRow/index";
import { showAlert } from '../../../Redux/ReduxSlices/Alerts/alertSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectCustomerKey, setCustomerKey } from '../../../Redux/ReduxSlices/User/userSlice';
import { useUpdateFacilityCustomerKeyMutation, useGetCustomerKeyForUserFacilityQuery } from '../../../Redux/ReduxSlices/User/userApiSlice';
import {
    mapToUpdateCustomerKeyDto
} from "../../../Utils/mappingUtils";

const AccountInfo = () => {
    const [rowsData, setRowsData] = useState([]);
    const headers = ["Customer Key", ""];
    const [editingRowId, setEditingRowId] = useState(null);
    const [originalRowData, setOriginalRowData] = useState(null);
    const dispatch = useDispatch();


    const {
        data: customerKeyData,
        isLoading: isCustomerKeyLoading,
        error: customerKeyError
    } = useGetCustomerKeyForUserFacilityQuery();

    const [
        updateFacilityCustomerKey,
        { isLoading: isUpdating, isSuccess: isUpdateSuccess }
    ] = useUpdateFacilityCustomerKeyMutation();

    useEffect(() => {
        if (customerKeyData) {
            setRowsData([{
                id: 'customerKey',
                code: customerKeyData.customerKey || '',
                isStatic: !!customerKeyData.customerKey,
            }]);
        }
    }, [customerKeyData]);


    const renderStaticRow = (row, index) => ([
        <span key={`code-${index}`}>{row.code}</span>,
        createDeleteIconCell(row, index)
    ]);

    const renderDynamicRow = (row, index) => {
        // Determine if the 'Add' button should be shown based on the emptiness of the 'code' (customer key) value
        const isAddButtonRow = !customerKeyData && !row.isStatic;

        const lastCell = isAddButtonRow ?
            createAddButtonCell() : // Assuming this function adds an 'Add' button
            (row.id === editingRowId ? renderDoneCancelText(row.id) : null);


        return [
            <StandardTextfield
                key={`code-${index}`}
                value={row.code}
                onChange={(e) => handleInputChange(index, 'code', e.target.value)}
                borderColor={UI_COLORS.purple}
                width="180px"
            />,
            lastCell
        ];
    };

    const rows = rowsData.map((row, index) => {
        return {
            data: row.isStatic ? renderStaticRow(row, index) : renderDynamicRow(row, index)
        };
    });

    const handleDeleteRow = (rowId) => {
        // Instead of deleting, we clear the customer key value and make the row dynamic
        setRowsData(prevRowsData => prevRowsData.map(row => {
            if (row.id === rowId) {
                return { ...row, code: '', isStatic: false };
            }
            return row;
        }));

        // Dispatch action to clear the customer key in the Redux store
        dispatch(setCustomerKey(''));
    };

    function addNewRow() {
        // Initialize a variable to hold the customer key value
        let newCustomerKeyValue = '';

        setRowsData(prevRowsData => {
            const updatedRowsData = prevRowsData.map(row => {
                if (!row.isStatic) {
                    // Capture the current 'code' value before the row is set to static
                    newCustomerKeyValue = row.code;
                }
                // Convert row back to being static
                return { ...row, isStatic: true };
            });

            return updatedRowsData;
        });

        // Dispatch the action to update the customerKey in the Redux store
        if (newCustomerKeyValue !== '') {
            dispatch(setCustomerKey(newCustomerKeyValue));
        }
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
        // Find the row that was edited using the rowId
        const editedRow = rowsData.find(row => row.id === rowId);

        // Make sure we have the edited row and its code value is different from the original customerKey
        if (editedRow && editedRow.code !== customerKeyData) {
            // Dispatch the action to update the customerKey in the Redux store with the edited value
            dispatch(setCustomerKey(editedRow.code));
        }

        setEditingRowId(null);
        setRowsData(prevRowsData => prevRowsData.map(row => {
            if (row.id === rowId) {
                // Convert the row back to static
                return { ...row, isStatic: true };
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
        if (row.isStatic ) {
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
            if (i === index) {
                return { ...row, [field]: value };
            }
            return row;
        }));
    };

    const handleSaveCustomerKey = async () => {
        if (rowsData.length > 0 && rowsData[0].code !== customerKeyData?.customerKey) {
            const payload = mapToUpdateCustomerKeyDto(rowsData[0].code);
            try {
                await updateFacilityCustomerKey(payload).unwrap();
                dispatch(showAlert({ type: 'success', message: 'Customer key updated successfully!' }));
            } catch (error) {
                console.error("Error updating customer key:", error);
                dispatch(showAlert({ type: 'error', message: 'Failed to update customer key' }));
            }
        }
    };


    return (
        <div className="default-procedure-management-wrapper">
            <div className="dashboard-right-side-row">
                <StyledSemiboldBlackTitle>Account Info</StyledSemiboldBlackTitle>
            </div>
            <StyledRoundedBoxContainer>
                <StyledRoundedBoxContainerInner>
                    <SaveButtonRow onSave={handleSaveCustomerKey} gap="120px">
                        <StyledLightGreyText>
                            Please enter your OpenDental Customer Key in the field below to
                            link your account with our service. This key enables us to securely
                            connect and synchronize your dental records. Click "Save" once you've
                            entered the key to complete the setup.
                        </StyledLightGreyText>
                    </SaveButtonRow>
                    <UniversalTable headers={headers} rows={rows} />
                </StyledRoundedBoxContainerInner>
            </StyledRoundedBoxContainer>
        </div>
    );
};

export default AccountInfo;


