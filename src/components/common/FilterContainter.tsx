import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { setLeaveTypeFilter, setLeaveStatusFilter } from "../../features/leave/leaveSlice"

const FilterContainter = () => {
    const dispatch = useDispatch()

    const handleRequestType = (event: ChangeEvent<HTMLSelectElement>) => {
        const requestValue = event.target.value;
        dispatch(setLeaveTypeFilter(requestValue));
    }

    const handleStatusType = (event: ChangeEvent<HTMLSelectElement>): void => {
        const statusValue = event.target.value;
        dispatch(setLeaveStatusFilter(statusValue));
    }
    return (
        <div className="filter-container">
            <div>
                <label htmlFor="request-type">Request Type</label>
                <select id="request-type" onChange={(e) => handleRequestType(e)}>
                    <option value="">All</option>
                    <option value="unpaid">Unpaid Leave</option>
                    <option value="paid">Paid Leave</option>
                </select>
            </div>
            <div>
                <label htmlFor="request-status">Request Status</label>
                <select id="request-status"  onChange={(e) => handleStatusType(e)}>
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
        </div>
    )
}

export default FilterContainter