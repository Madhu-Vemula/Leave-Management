import { ChangeEvent, useEffect, useState } from "react";
import { Leave } from "../../Types";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateLeaveItem, setLeaveInitialData } from "./leaveSlice";
import { setShowPopUp } from "../../store/uiSlice";
import { setCancelPopUp } from "../employee/employeeSlice";
import { useLazyGetLeaveByUserQuery, useLazyGetLeavesQuery } from "../../services/leaveService"
import { getUserFromSession } from "../../utils/roleUtils";
import { RootState } from "../../store/store";
import { convertFirstLetterToLowerCase, convertFirstLetterToUpperCase } from "../../utils/leaveUtils";
import FilterContainter from "../../components/common/FilterContainter";

const LeaveHistory = () => {
    const user = getUserFromSession()
    const [triggerGetLeaveByUser] = useLazyGetLeaveByUserQuery();
    const [triggerGetAllLeaves] = useLazyGetLeavesQuery();
    const dispatch = useDispatch();
    const refetchLeaveHistory = useSelector((state: RootState) => state.leave.refetchLeaveHistory);
    const [leavesData, setLeavesData] = useState<Leave[]>([]);
    const [reverseLeavesData, setReverseLeavesData] = useState<Leave[]>([])
    const [filteredLeaves, setFilterLeaves] = useState<Leave[]>([]);
    const leaveTypeFilter = useSelector((state: RootState) => state.leave.leaveTypeFilter)
    const leaveStatusFilter = useSelector((state: RootState) => state.leave.leaveStatusFilter)
    const authRole = user?.role?.toLowerCase();
    const [actionValue, setActionValue] = useState<string>('')

    useEffect(() => {
        const fetchLeaves = async () => {
            if (authRole === "employee" || authRole === "manager") {
                try {
                    const response = await triggerGetLeaveByUser(user.email).unwrap();
                    setLeavesData(response)
                    console.log(response)
                }
                catch (error: any) {
                    alert(`Error Message ${error.message}`)
                }
            }
            else if (authRole === "hr") {
                try {
                    const response = await triggerGetAllLeaves().unwrap();
                    setLeavesData(response)
                }
                catch (error: any) {
                    alert(`Error Message ${error.message}`)
                }
            }
        }
        fetchLeaves()
    }, [triggerGetLeaveByUser, authRole, triggerGetAllLeaves, user.email, refetchLeaveHistory])

    useEffect(() => {
        const reversedLeaveData = [...leavesData].reverse()
        setReverseLeavesData(reversedLeaveData);
    }, [leavesData])

    useEffect(() => {
        let result = [...reverseLeavesData];
        if (leaveTypeFilter !== "all") {
            result = result.filter((leave) => leave.leaveType === leaveTypeFilter)
        }
        if (leaveStatusFilter !== "all") {
            result = result.filter((leave) => leave.status.toLowerCase() === leaveStatusFilter.toLowerCase())
        }
        setFilterLeaves(result);
    }, [leaveTypeFilter, reverseLeavesData, leaveStatusFilter])


    const handleModifyLeave = (event: ChangeEvent<HTMLSelectElement>, item: Leave): void => {
        const modifyValue = event.target.value;
        if (modifyValue === 'modify') {
            dispatch(setShowPopUp(true));
            dispatch(setLeaveInitialData(item))
        }
        else {
            dispatch(setCancelPopUp(true));
            dispatch(setUpdateLeaveItem(item))
        };
        setActionValue('')
    }

    return (
        <div className="leave-history-cont">
            <FilterContainter />
            {filteredLeaves.length === 0 ? (
                <h3>No data found..</h3>
            ) : (

                <table>
                    <thead>
                        <tr>
                            {authRole === 'hr' && (<th>EmpId</th>)}
                            {authRole === 'hr' && (<th>Employee Email</th>)}
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Type</th>
                            <th>Reason</th>
                            <th>Days</th>
                            <th>Status</th>
                            <th>Responded By</th>
                            {authRole !== 'hr' && (<th>Actions</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredLeaves.map((item: Leave) => (
                                <tr key={item.id}>
                                    {authRole === 'hr' && (<td>{item.empId}</td>)}
                                    {authRole === 'hr' && (<td>{item.email}</td>)}
                                    <td>{item.startDate}</td>
                                    <td>{item.endDate}</td>
                                    <td>{item.leaveType.charAt(0).toUpperCase() + item.leaveType.slice(1)}</td>
                                    <td>{item.reason}</td>
                                    <td>{item.dayDifference}</td>
                                    <td className={convertFirstLetterToLowerCase(item.status)}>{convertFirstLetterToUpperCase(item.status)}</td>
                                    <td>{item.respondedBy ?? "Still in progress"}</td>
                                    {authRole !== 'hr' && (
                                        <td>
                                            <button
                                                type="button"
                                                title="actions"
                                                className="button submit-btn action-btn"
                                                disabled={item.status !== "Pending"}
                                            >
                                                <select
                                                    name="actions"
                                                    value={actionValue}
                                                    title="actions-type"
                                                    disabled={item.status !== "Pending"}
                                                    onChange={(e) => handleModifyLeave(e, item)}>
                                                    <option value="" >Actions</option>
                                                    <option value="modify">Modify</option>
                                                    <option value="cancel">Cancel</option>
                                                </select>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default LeaveHistory