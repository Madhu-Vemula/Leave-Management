import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { setActionStatus } from "../../features/dashboard/managerSlice"
import { useUpdateLeaveByIdMutation } from "../../services/leaveService"
import { useLazyGetEmployeeByMailQuery, useUpdateEmployeeMutation } from "../../services/employeeService"
import { getUserMailFromSession } from "../../utils/roleUtils"

const ActionPopUp = () => {
    const dispatch = useDispatch()
    const updateLeaveItem = useSelector((state: RootState) => state.leave.updateLeaveItem)
    const employeeLeaveData = useSelector((state: RootState) => state.manager.leaveData)
    const [updateLeaveById] = useUpdateLeaveByIdMutation();
    const [updateEmployee] = useUpdateEmployeeMutation()
    const [triggerGetEmployee] = useLazyGetEmployeeByMailQuery()
    const userEmail = getUserMailFromSession()
    const handleCancel = (): void => {
        dispatch(setActionStatus(''))
    }
    const actionStatus = useSelector((state: RootState) => state.manager.actionStatus)

    const handleSubmit = async (): Promise<void> => {
        try {
            const updatedLeaveData = { ...updateLeaveItem, status: actionStatus, respondedBy: userEmail }
            await updateLeaveById(updatedLeaveData).unwrap();
        }
        catch (error: any) {
            alert(`Error Message${error.message}`)
        }
        var responseEmployeeData;
        if (employeeLeaveData?.email) {
            responseEmployeeData = await triggerGetEmployee(employeeLeaveData.email).unwrap();
        }
        if (actionStatus === "rejected") {
            if (responseEmployeeData && employeeLeaveData) {
                const updatedEmployeeData = {
                    ...responseEmployeeData[0],
                    leaveBalance: responseEmployeeData[0].leaveBalance + employeeLeaveData.dayDifference
                }
                console.log(await updateEmployee(updatedEmployeeData).unwrap())
            }
        }
        dispatch(setActionStatus(''))
    }
    return (
        <>
            {actionStatus && (
                <div className="form-container form-pop-up show-pop-up">
                    <h2>Do you want to {actionStatus === 'approved' ? 'approve' : 'reject'} leave?</h2>
                    <label htmlFor="comments">Comments</label>
                    <textarea id="comments">
                    </textarea>
                    <div className="actions-btn-cont">
                        <button
                            type='button'
                            className="button remove-btn"
                            onClick={handleCancel}>Cancel</button>
                        <button
                            type='button'
                            className="button edit-btn"
                            onClick={handleSubmit}
                        >{actionStatus === 'approved' ? 'Approve' : 'Reject'}</button>
                    </div>
                </div>
            )}
        </>
    )
}
export default ActionPopUp