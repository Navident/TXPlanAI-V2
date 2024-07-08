import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../../Utils/constants';

const PAYERS_API_URL = `${API_BASE_URL}/payer`;

export const payersApiSlice = createApi({
    reducerPath: 'payersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: PAYERS_API_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Payers'],
    endpoints: (builder) => ({
        getFacilityPayers: builder.query({
            query: () => '/facilityPayers',
            providesTags: ['Payers'],
        }),
        getFacilityPayersWithCdtCodesFees: builder.query({
            query: () => '/facilityPayersWithCdtCodesFees',
            providesTags: ['Payers'],
        }),
        updateFacilityPayers: builder.mutation({
            query: (updateData) => ({
                url: '/updateFacilityPayers',
                method: 'POST',
                body: updateData,
            }),
            invalidatesTags: ['Payers'],
        }),
    }),
});

export const {
    useGetFacilityPayersQuery,
    useGetFacilityPayersWithCdtCodesFeesQuery,
    useUpdateFacilityPayersMutation,
} = payersApiSlice;
