import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../../Utils/constants';

const CDT_CODES_API_URL = `${API_BASE_URL}/cdtcodes`;

// Create a new apiSlice
export const cdtCodesApiSlice = createApi({
    reducerPath: 'cdtCodesApi', // Unique key within your store
    baseQuery: fetchBaseQuery({
        baseUrl: CDT_CODES_API_URL,
        prepareHeaders: (headers) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('jwtToken');
            // If token exists, set Authorization header
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            // Optionally, set 'Content-Type' header for all requests
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['CdtCodes'], 
    endpoints: (builder) => ({
        getDefaultCdtCodes: builder.query({
            query: () => '/defaultcdtcodes',
            providesTags: ['CdtCodes'],
        }),
        getCustomCdtCodes: builder.query({
            query: () => '/facilityCdtCodes',
            providesTags: ['CdtCodes'],
        }),
        getAlternativeProceduresByFacility: builder.query({
            query: () => '/alternativeprocedures',
        }),
        updateCustomFacilityCdtCodes: builder.mutation({
            query: (updateData) => ({
                url: '/updateCustomCdtCodes',
                method: 'POST',
                body: updateData,
            }),
            invalidatesTags: ['CdtCodes'],
        }),

    }),
});

// Export hooks for usage in functional components
export const {
    useGetDefaultCdtCodesQuery,
    useGetCustomCdtCodesQuery,
    useGetAlternativeProceduresByFacilityQuery,
    useUpdateCustomFacilityCdtCodesMutation,
} = cdtCodesApiSlice;
