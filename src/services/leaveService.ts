import { Leave } from "../Types";
import { employeeApi } from "./employeeService";

export const leaveApi = employeeApi.injectEndpoints({
    endpoints: (builder) => ({
        getLeaves: builder.query<Leave[], void>({
            query: () => ({ url: "/leaves" }),
            providesTags: ['Leave']
        }),
        submitLeave: builder.mutation<Leave, Leave>({
            query: (intialLeave) => ({
                url: "/leaves",
                method: 'POST',
                body: intialLeave
            }),
            invalidatesTags: ['Leave']
        }),
        getLeaveByUser: builder.query<Leave[], string>({
            query: (email) => ({
                url: `/leaves?email=${email}`,
            }),
            providesTags: ['Leave']
        }),
        getLeaveByManager: builder.query<Leave[], string[]>({
            query: () => (
                { url: '/leaves' }
            ),
            transformResponse: (response: Leave[], meta, employeeEmails) => {
                return response.filter((leave) => employeeEmails.includes(leave.email))
            },
            providesTags: ['Leave']
        }),
        updateLeaveById: builder.mutation<Leave, Partial<Leave>>({
            query: (leave) => {
                const { id, ...patch } = leave;
                return ({
                    url: `/leaves/${id}`,
                    method: "PATCH",
                    body: patch
                })
            },
            invalidatesTags: ['Leave']
        }),
        deleteLeavesById: builder.mutation<Leave[], string>({
            query: (id) => ({
                url: `/leaves/${id}`,
                method: "DELETE"
            })
        })
    })
})

export const {
    useSubmitLeaveMutation,
    useGetLeavesQuery,
    useLazyGetLeavesQuery,
    useGetLeaveByUserQuery,
    useLazyGetLeaveByUserQuery,
    useGetLeaveByManagerQuery,
    useUpdateLeaveByIdMutation, 
    useDeleteLeavesByIdMutation
} = leaveApi;