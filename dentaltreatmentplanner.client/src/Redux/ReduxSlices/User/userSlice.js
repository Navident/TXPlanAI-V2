import { createSlice } from '@reduxjs/toolkit';

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
        setUserDetails: (state, action) => {
            const { jwtToken, isUserLoggedIn, isSuperAdmin, facilityName, facilityId } = action.payload;
            state.jwtToken = jwtToken;
            state.isUserLoggedIn = isUserLoggedIn;
            state.isSuperAdmin = isSuperAdmin;
            state.facilityName = facilityName;
            state.facilityId = facilityId;

            // Update localStorage
            localStorage.setItem('jwtToken', jwtToken || '');
            localStorage.setItem('isLoggedIn', isUserLoggedIn.toString());
            localStorage.setItem('isSuperAdmin', isSuperAdmin.toString());
            localStorage.setItem('businessName', facilityName || '');
        },
        resetUserState: (state) => {
            state.facilityName = '';
            state.facilityId = '';
            state.isUserLoggedIn = false;
            state.isSuperAdmin = false;
            state.jwtToken = '';
            state.customerKey = '';

            // Clear localStorage
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('businessName');
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('isSuperAdmin');
        },
        setCustomerKey: (state, action) => {
            state.customerKey = action.payload;
        },
    },
});

export const { setUserDetails, resetUserState, setCustomerKey } = userSlice.actions;

export const selectFacilityName = (state) => state.user.facilityName;
export const selectFacilityId = (state) => state.user.facilityId;
export const selectCustomerKey = (state) => state.user.customerKey;
export const selectIsUserLoggedIn = (state) => state.user.isUserLoggedIn;
export const selectIsSuperAdmin = (state) => state.user.isSuperAdmin;
export const selectJwtToken = (state) => state.user.jwtToken;

export default userSlice.reducer;