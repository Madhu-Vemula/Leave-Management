//This service is no longer being used 

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Employee, User } from "../Types";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        getEmployeeByMail: builder.query<Employee[], User>({
            query: (user) => ({
                url: `/employees/?email=${user.email}`
            }), 
            providesTags: ['Auth']
        })
    })
})

export const { useLazyGetEmployeeByMailQuery,useGetEmployeeByMailQuery } = authApi

