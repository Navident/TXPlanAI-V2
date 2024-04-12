// Import createApi and fetchBaseQuery from RTK Query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../../Utils/constants';

const ACCOUNT_API_URL = `${API_BASE_URL}/account`;

export const userApiSlice = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: ACCOUNT_API_URL }),
    tagTypes: ['User', 'CustomerKey'],
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (userData) => ({
                url: '/register',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),
        getCustomerKeyForUserFacility: builder.query({
            query: () => ({
                url: '/customerkey',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            }),
            providesTags: ['CustomerKey'],
        }),
        updateFacilityCustomerKey: builder.mutation({
            query: (payload) => ({
                url: '/updatecustomerkey',
                method: 'POST',
                body: payload,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            }),
            invalidatesTags: ['CustomerKey'],
        }),

    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useGetCustomerKeyForUserFacilityQuery,
    useUpdateFacilityCustomerKeyMutation,
} = userApiSlice;
