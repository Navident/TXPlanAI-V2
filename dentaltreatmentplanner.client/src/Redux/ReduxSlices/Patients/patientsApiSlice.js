// Import RTK Query methods
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../../Utils/constants';

const PATIENTS_API_URL = `${API_BASE_URL}/Patient`;

// Define our API slice
export const patientsApiSlice = createApi({
    reducerPath: 'patientsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: PATIENTS_API_URL, prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getPatientsForUserFacility: builder.query({
            query: () => '/facilityPatients',
        }),
        createPatient: builder.mutation({
            query: (patientData) => ({
                url: '/create',
                method: 'POST',
                body: patientData,
            }),
        }),
    }),
});

// Export hooks for usage in components
export const { useGetPatientsForUserFacilityQuery, useCreatePatientMutation } = patientsApiSlice;
