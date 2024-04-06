import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const initializeUser = createAsyncThunk('user/initializeUser', async () => {
    const storedBusinessName = localStorage.getItem('businessName');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return { businessName: storedBusinessName || '', isUserLoggedIn: isLoggedIn };
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        facilityName: '',
        facilityId: '',
        isUserLoggedIn: false,
        isSuperAdmin: false,
        jwtToken: '', 
        customerKey: '',
    },
    reducers: {
        setFacilityName: (state, action) => {
            state.facilityName = action.payload;
        },
        setFacilityId: (state, action) => {
            state.facilityId = action.payload;
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
        setCustomerKey: (state, action) => {
            state.customerKey = action.payload;
        },
        setIsSuperAdmin: (state, action) => {
            state.isSuperAdmin = action.payload;
            localStorage.setItem('isSuperAdmin', action.payload.toString()); 
        },
        setJwtToken: (state, action) => {
            state.jwtToken = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initializeUser.fulfilled, (state, action) => {
            state.businessName = action.payload.businessName;
            state.isUserLoggedIn = action.payload.isUserLoggedIn;
            const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
            state.isSuperAdmin = isSuperAdmin;
        });
    },
});

export const { setFacilityName, setFacilityId, setIsUserLoggedIn, resetUserState, setCustomerKey, setIsSuperAdmin } = userSlice.actions;

export const selectFacilityName = (state) => state.user.facilityName;
export const selectFacilityId = (state) => state.user.facilityId;
export const selectCustomerKey = (state) => state.user.customerKey;
export const selectIsUserLoggedIn = (state) => state.user.isUserLoggedIn;
export const selectIsSuperAdmin = (state) => state.user.isSuperAdmin;

export default userSlice.reducer;
