import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from '../../../Utils/constants';

const OPEN_DENTAL_API_URL = `${API_BASE_URL}/OpenDental`;

// Create the API slice
export const openDentalApiSlice = createApi({
    reducerPath: 'openDentalApi',
    baseQuery: fetchBaseQuery({
        baseUrl: OPEN_DENTAL_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getPatientsForUserFacilityFromOpenDental: builder.query({
            query: () => '/facilityPatientsOpenDental',
        }),
        importTreatmentPlanToOpenDental: builder.mutation({
            query: (openDentalTreatmentPlanDto) => ({
                url: '/importtoopendental',
                method: 'POST',
                body: openDentalTreatmentPlanDto,
            }),
        }),
        savePatientsFromOpenDentalToDatabase: builder.mutation({
            query: () => ({
                url: '/savePatientsFromOpenDentalToDatabase',
                method: 'POST',
            }),
        }),
    }),
});

// Export the auto-generated hook for each endpoint
export const {
    useGetPatientsForUserFacilityFromOpenDentalQuery,
    useImportTreatmentPlanToOpenDentalMutation,
    useSavePatientsFromOpenDentalToDatabaseMutation,
} = openDentalApiSlice;
