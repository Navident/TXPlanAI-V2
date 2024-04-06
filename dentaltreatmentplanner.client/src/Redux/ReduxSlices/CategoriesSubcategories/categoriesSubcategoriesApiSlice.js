
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from '../../../Utils/constants';

const CATS_SUBCATS__API_URL = `${API_BASE_URL}/ProcedureCategory`;


export const categoriesSubcategoriesApiSlice = createApi({
    reducerPath: 'categoriesSubcategoriesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: CATS_SUBCATS__API_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/categories',
        }),
        getSubcategories: builder.query({
            query: () => `/subcategories`,
        }),
    }),
});

export const { useGetCategoriesQuery, useGetSubcategoriesQuery } = categoriesSubcategoriesApiSlice;
