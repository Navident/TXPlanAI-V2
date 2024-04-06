import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mapToCreateNewTreatmentPlanFromDefaultDto, mapToCreateNewCombinedTreatmentPlanForPatient } from '../../../Utils/mappingUtils';

import { API_BASE_URL } from '../../../Utils/constants';

const TREATMENT_PLANS_API_URL = `${API_BASE_URL}/TreatmentPlans`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Create a new API slice
export const treatmentPlansApiSlice = createApi({
    reducerPath: 'treatmentPlansApi',
    baseQuery: fetchBaseQuery({
        baseUrl: TREATMENT_PLANS_API_URL,
        prepareHeaders: (headers) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('jwtToken');
            // If token exists, set Authorization header
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            // Set 'Content-Type' header for all requests
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['TreatmentPlans'], // for providing automatic cache invalidation
    endpoints: (builder) => ({
        // Endpoint to fetch all treatment plans for the current user's facility
        getAllPatientTreatmentPlansForFacility: builder.query({
            query: () => '/allpatientplansforfacility',
            providesTags: ['TreatmentPlans'],
        }),

        generateTreatmentPlan: builder.mutation({
            query: (treatmentPlanData) => ({
                url: '/',
                method: 'POST',
                body: treatmentPlanData,
            }),
            invalidatesTags: ['TreatmentPlans'],
        }),
        getTreatmentPlanById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['TreatmentPlans'],
        }),

        createNewTreatmentPlanFromDefault: builder.mutation({
            query: ({ treatmentPlan, allRows, visitOrder }) => {
                const body = mapToCreateNewTreatmentPlanFromDefaultDto(treatmentPlan, allRows, visitOrder);
                return {
                    url: '/newfromdefault',
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: ['TreatmentPlans'],
        }),

        updateTreatmentPlan: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updatedData,
            }),
            invalidatesTags: ['TreatmentPlans'],
        }),
        createNewTreatmentPlanForPatient: builder.mutation({
            query: ({ treatmentPlan, allRows, alternativeRows, visitOrder, selectedPatientId, payerId }) => {
                const body = {
                    ...mapToCreateNewCombinedTreatmentPlanForPatient(treatmentPlan, allRows, alternativeRows, visitOrder, payerId),
                    patientId: selectedPatientId
                };
                return {
                    url: '/newTxForPatient',
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: ['TreatmentPlans'],
        }),

        deleteTreatmentPlanById: builder.mutation({
            query: (treatmentPlanId) => ({
                url: `/delete/${treatmentPlanId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TreatmentPlans'],
        }),

        getAllSubcategoryTreatmentPlans: builder.query({
            query: () => `/allsubcategorytreatmentplansforfacility`,
            providesTags: ['TreatmentPlans'],
        }),

        getTreatmentPlansByPatient: builder.query({
            query: (patientId) => `/Patient/${patientId}`,
            providesTags: ['TreatmentPlans'],
        }),

    }),
});

// Export hooks for usage in functional components
export const {
    useGetAllPatientTreatmentPlansForFacilityQuery,
    useGenerateTreatmentPlanMutation,
    useGetTreatmentPlanByIdQuery,
    useCreateNewTreatmentPlanFromDefaultMutation,
    useUpdateTreatmentPlanMutation,
    useCreateNewTreatmentPlanForPatientMutation,
    useDeleteTreatmentPlanByIdMutation,
    useGetAllSubcategoryTreatmentPlansQuery,
    useGetTreatmentPlansByPatientQuery,
} = treatmentPlansApiSlice;
