import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Employee } from "../Types"

export const employeeApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
    tagTypes: ['Employee', 'Leave'],
    endpoints: (builder) => ({
        addEmployee: builder.mutation<Employee, Employee>({
            query: (intialEmployee) => ({
                url: "/employees",
                method: "POST",
                body: intialEmployee
            }),
            invalidatesTags: ['Employee']
        }),
        getEmployees: builder.query<Employee[], void>({
            query: () => ({
                url: '/employees'
            }),
            providesTags: ['Employee']
        }),
        getEmployeesByManager: builder.query<Employee[], string>({
            query: (managerEmail) => ({
                url: `/employees/?managerEmail=${managerEmail}`
            }),
            providesTags: ["Employee"]
        }),
        updateEmployee: builder.mutation<Employee, Employee>({
            query: (intialEmployee) => ({
                url: `/employees/${intialEmployee.id}`,
                method: "PUT",
                body: intialEmployee
            }),
            invalidatesTags: ['Employee']
        }),
        removeEmployee: builder.mutation<Employee, string | undefined>({
            query: (id) => ({
                url: `/employees/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Employee']
        }),
        getAllManagers: builder.query<Employee[], void>({
            query: () => ({
                url: `/employees/?role=manager`
            }),
            providesTags: ['Employee']
        }),
        getEmployeeByMail: builder.query<Employee[], string>({
            query: (email) => ({
                url: `/employees/?email=${email}`
            }),
            providesTags: ['Employee']
        })
    })
})

export const { 
    useAddEmployeeMutation,
    useGetEmployeesQuery,
    useUpdateEmployeeMutation,
    useRemoveEmployeeMutation,
    useGetEmployeesByManagerQuery,
    useGetAllManagersQuery,
    useLazyGetEmployeeByMailQuery,
    useGetEmployeeByMailQuery
} = employeeApi