import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    type: '', // Keep for existing alerts
    message: '', // Keep for existing alerts
    // Adding new properties for PopupAlertWrapper
    title: '',
    content: '',
    textInput: false,
    textInputWidth: '75px',
    onAgree: null, // Function to execute on agree action, consider storing function references outside Redux
};

export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        // Existing reducers
        showAlert: (state, action) => {
            const { type, message } = action.payload;
            state.open = true;
            state.type = type;
            state.message = message;
        },
        closeAlert: (state) => {
            state.open = false;
        },
        // New reducer for PopupAlert
        showPopupAlert: (state, action) => {
            const { title, content, textInput, textInputWidth, onAgree } = action.payload;
            state.open = true;
            state.title = title;
            state.content = content;
            state.textInput = textInput;
            state.textInputWidth = textInputWidth;
            // Be cautious about storing function references in Redux state
            state.onAgree = onAgree;
        },
        // Could reuse closeAlert for both types of alerts
    },
});

export const selectAlertInfo = (state) => state.alert;

export const { showAlert, closeAlert, showPopupAlert } = alertSlice.actions;

export default alertSlice.reducer;
