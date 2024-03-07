import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    type: '',
    message: '',
};

export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        // Action to show an alert
        showAlert: (state, action) => {
            const { type, message } = action.payload;
            state.open = true;
            state.type = type;
            state.message = message;
        },
        // Action to close the alert
        closeAlert: (state) => {
            state.open = false;
        },
    },
});

export const selectAlertInfo = (state) => state.alert;

export const { showAlert, closeAlert } = alertSlice.actions;

export default alertSlice.reducer;
