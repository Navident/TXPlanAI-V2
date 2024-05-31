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
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getPatientsForUserFacilityFromOpenDental: builder.query({
            query: () => '/facilityPatientsOpenDental',
        }),
        getDiseasesForPatient: builder.query({
            query: (patNum) => `/diseases/${patNum}`,
        }),
        getMedicationsForPatient: builder.query({
            query: (patNum) => `/medications/${patNum}`,
        }),
        getAllergiesForPatient: builder.query({
            query: (patNum) => `/allergies/${patNum}`,
        }),
        importTreatmentPlanToOpenDental: builder.mutation({
            query: (openDentalTreatmentPlanDto) => ({
                url: '/importtoopendental',
                method: 'POST',
                body: openDentalTreatmentPlanDto,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        savePatientsFromOpenDentalToDatabase: builder.mutation({
            query: () => ({
                url: '/savePatientsFromOpenDentalToDatabase',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        createProcedureLog: builder.mutation({
            query: (openDentalProcedureLogCreateRequest) => ({
                url: '/procedurelogs',
                method: 'POST',
                body: openDentalProcedureLogCreateRequest,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        createProcNote: builder.mutation({
            query: (openDentalProcNoteCreateRequest) => ({
                url: '/procnotes',
                method: 'POST',
                body: openDentalProcNoteCreateRequest,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
    }),
});
// Export the auto-generated hook for each endpoint
export const {
    useGetPatientsForUserFacilityFromOpenDentalQuery,
    useGetDiseasesForPatientQuery,
    useGetMedicationsForPatientQuery,
    useGetAllergiesForPatientQuery,
    useImportTreatmentPlanToOpenDentalMutation,
    useSavePatientsFromOpenDentalToDatabaseMutation,
    useCreateProcedureLogMutation,
    useCreateProcNoteMutation, 
} = openDentalApiSlice;