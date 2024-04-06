import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    type: '',
    message: '',
    title: '',
    content: '',
    textInput: false,
    textInputWidth: '75px',
    onAgree: null,
};

const alertSlice = createSlice({
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
            state.onAgree = onAgree;
        },
    },
});

export const selectAlertInfo = (state) => state.alert;

export const { showAlert, closeAlert, showPopupAlert } = alertSlice.actions;

export default alertSlice.reducer;
