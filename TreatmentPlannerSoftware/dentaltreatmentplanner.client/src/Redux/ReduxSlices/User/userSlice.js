import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const initializeUser = createAsyncThunk('user/initializeUser', async () => {
    const storedBusinessName = localStorage.getItem('businessName');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return { businessName: storedBusinessName || '', isUserLoggedIn: isLoggedIn };
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        businessName: '',
        isUserLoggedIn: false,
    },
    reducers: {
        setBusinessName: (state, action) => {
            state.businessName = action.payload;
            localStorage.setItem('businessName', action.payload); 
        },
        setIsUserLoggedIn: (state, action) => {
            state.isUserLoggedIn = action.payload;
            localStorage.setItem('isLoggedIn', action.payload.toString());
        },
        resetUserState: (state) => {
            state.businessName = '';
            state.isUserLoggedIn = false;
            localStorage.removeItem('businessName');
            localStorage.setItem('isLoggedIn', 'false');
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initializeUser.fulfilled, (state, action) => {
            state.businessName = action.payload.businessName;
            state.isUserLoggedIn = action.payload.isUserLoggedIn;
        });
    },
});

export const { setBusinessName, setIsUserLoggedIn, resetUserState } = userSlice.actions;

export default userSlice.reducer;
