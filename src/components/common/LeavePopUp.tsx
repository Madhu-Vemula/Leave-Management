import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LeaveForm from "../../features/leave/LeaveForm";
import { useState, ChangeEvent } from "react";
import { getUserMailFromSession } from "../../utils/roleUtils";
import { useUpdateLeaveByIdMutation } from "../../services/leaveService"
import { useGetEmployeeByMailQuery, useUpdateEmployeeMutation } from "../../services/employeeService"
import { setCancelPopUp } from "../../features/employee/employeeSlice";
import { setRefetchLeaveHistory } from "../../features/leave/leaveSlice";

const EmployeePopUp = () => {
    const userEmail = getUserMailFromSession();
    const { data: employeeData = [] } = useGetEmployeeByMailQuery(userEmail);
    const [updateLeaveById] = useUpdateLeaveByIdMutation();
    const showFormPopUp = useSelector((state: RootState) => state.ui.showFormPopUp);
    const showCancelPopUp = useSelector((state: RootState) => state.employee.showCancelPopUp)
    const cancelLeaveItem = useSelector((state: RootState) => state.leave.updateLeaveItem)
    const refetchLeaveHistory = useSelector((state: RootState) => state.leave.refetchLeaveHistory)
    const [updateEmployee] = useUpdateEmployeeMutation()
    const [cancelReason, setCancelReason] = useState<string>('');
    const [hasError, setHasError] = useState<boolean>(false)

    const dispatch = useDispatch()
    const handleReasonText = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        const reasonValue = event.target.value;
        setCancelReason(reasonValue)
    }
    const handleCancelRequest = (): void => {
        setCancelReason('')
        dispatch(setCancelPopUp(false))
    }

    const handleSubmitRequest = async (): Promise<void> => {
        if (!cancelReason) {
            setHasError(true);
            return;
        }

        if (cancelLeaveItem && cancelLeaveItem.leaveType === "paid") {
            const updatedEmployeeData = {
                ...employeeData[0],
                leaveBalance: employeeData[0].leaveBalance + cancelLeaveItem.dayDifference
            }
            try {
                const employeeResponse = await updateEmployee(updatedEmployeeData).unwrap()
                console.log(employeeResponse)
            }
            catch (error: any) {
                alert(`Error Message ${error}`)
            }
        }

        const updatedLeaveData = { ...cancelLeaveItem, status: "Cancelled", reason: cancelReason }
        try {
            const leaveResponse = await updateLeaveById(updatedLeaveData).unwrap()
            console.log(leaveResponse);
        }
        catch (error: any) {
            alert(`Error Message ${error}`)
        }
        dispatch(setCancelPopUp(false))
        dispatch(setRefetchLeaveHistory(!refetchLeaveHistory))
        setCancelReason('')
    }

    return (
        <>
            {showFormPopUp && (<LeaveForm employeeData={employeeData[0]} />)}
            {showCancelPopUp && (
                <div className="form-container form-pop-up">
                    <h2>Do you want to cancel leave request?</h2>
                    <label htmlFor="reason">Reason<span className="error-message">*</span></label>
                    <textarea id="reason" value={cancelReason} onChange={(e) => handleReasonText(e)}>
                    </textarea>
                    {hasError && !cancelReason && (<span className="error-message">Field is required!</span>)}
                    <div className="actions-btn-cont">
                        <button type="button" className="button cancel-btn" onClick={handleCancelRequest}>Cancel</button>
                        <button type="button" className="button submit-btn" onClick={handleSubmitRequest}>Submit</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default EmployeePopUp