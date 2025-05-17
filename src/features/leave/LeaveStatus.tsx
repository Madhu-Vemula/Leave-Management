import { ChangeEvent, useEffect,useState } from "react";
import { Leave } from "../../Types"
import { RootState } from "../../store/store";
import { setUpdateLeaveItem } from "./leaveSlice";
import { useDispatch, useSelector } from "react-redux";
import { setActionStatus, setLeaveData } from "../dashboard/managerSlice";
import { useGetEmployeesByManagerQuery } from "../../services/employeeService";
import { useGetLeaveByManagerQuery } from "../../services/leaveService"
import { getUserFromSession } from "../../utils/roleUtils";
import { convertFirstLetterToLowerCase, convertFirstLetterToUpperCase } from "../../utils/leaveUtils";
import FilterContainter from "../../components/common/FilterContainter";

const LeaveStatus: React.FC = () => {
    const user = getUserFromSession();
    const { data } = useGetEmployeesByManagerQuery(user.email);
    const employeeEmails = data?.map((employee) => employee.email)
    const { data: employeeLeaves = [] } = useGetLeaveByManagerQuery(employeeEmails ?? [])
    const dispatch = useDispatch()
    const leaveTypeFilter = useSelector((state: RootState) => state.leave.leaveTypeFilter)
    const leaveStatusFilter = useSelector((state: RootState) => state.leave.leaveStatusFilter)
    const [filterEmployeeLeaves, setFilterEmployeeLeaves] = useState<Leave[]>([])

    useEffect(() => {
        let result = [...employeeLeaves];
        if (leaveTypeFilter !== "all") {
            result = result.filter((leave) => leave.leaveType === leaveTypeFilter)
        }
        if (leaveStatusFilter !== "all") {
            result = result.filter((leave) => leave.status.toLowerCase() === leaveStatusFilter.toLowerCase())
        }
        setFilterEmployeeLeaves(result);
    }, [leaveTypeFilter, employeeLeaves, leaveStatusFilter])

    const handleActionsTypes = (event: ChangeEvent<HTMLSelectElement>, leave: Leave): void => {
        dispatch(setUpdateLeaveItem(leave))
        dispatch(setActionStatus(event.target.value))
        dispatch(setLeaveData(leave))
    }

    return (
        <div className="table-container">
            <h2>Employees Leave Request</h2>
            <FilterContainter />
            {filterEmployeeLeaves.length === 0 ? (
                <h3>No data found..</h3>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Employee Id</th>
                                <th>Employee Email</th>
                                <th>Leave Type</th>
                                <th>Date</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Take Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterEmployeeLeaves.map((leave: Leave) => (
                                <tr key={leave.id}>
                                    <td>{leave.empId}</td>
                                    <td>{leave.email}</td>
                                    <td>{leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}</td>
                                    <td>{leave.startDate} to {leave.endDate}</td>
                                    <td>{leave.reason}</td>
                                    <td className={convertFirstLetterToLowerCase(leave.status)}>{convertFirstLetterToUpperCase(leave.status)}</td>
                                    <td>
                                        <button
                                            title="actions"
                                            type="button"
                                            className="button submit-btn action-btn"
                                            disabled={leave.status !== "Pending"}>
                                            <select
                                                name="actions"
                                                title="actions"
                                                disabled={leave.status !== "Pending"}
                                                onChange={(e) => handleActionsTypes(e, leave)}>
                                                <option value="" >Actions</option>
                                                <option value="approved">Approve</option>
                                                <option value="rejected">Reject</option>
                                            </select>
                                        </button>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}
export default LeaveStatus;