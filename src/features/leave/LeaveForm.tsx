import { useState, ChangeEvent } from "react";
import { Leave, EmployeeDataProps } from "../../Types";
import palTechLogo from "../../assets/images/paltech_logo.png"
import { useGetLeaveByUserQuery, useSubmitLeaveMutation, useUpdateLeaveByIdMutation } from "../../services/leaveService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setShowPopUp } from "../../store/uiSlice";
import { useUpdateEmployeeMutation } from "../../services/employeeService";
import { getUserFromSession, getUserMailFromSession } from "../../utils/roleUtils";
import { setRefetchLeaveHistory } from "./leaveSlice"
import { checkDuplicatedLeaves, compareUpdatedData } from "../../utils/leaveUtils";

const LeaveForm: React.FC<EmployeeDataProps> = (props) => {
    const { employeeData } = props
    const dispatch = useDispatch();
    const userEmail = getUserMailFromSession();
    const showFormPopUp = useSelector((state: RootState) => state.ui.showFormPopUp);
    const initialLeaveData = useSelector((state: RootState) => state.leave.initialData);
    const refetchLeaveHistory = useSelector((state: RootState) => state.leave.refetchLeaveHistory)
    const [submitLeave] = useSubmitLeaveMutation();
    const [updateLeaveById] = useUpdateLeaveByIdMutation();
    const [updateEmployee] = useUpdateEmployeeMutation();
    const { data: allLeaveData = [] } = useGetLeaveByUserQuery(userEmail);
    const [leaveForm, setLeaveForm] = useState<Leave>(
        initialLeaveData ?? {
            empId: '',
            email: '',
            startDate: '',
            endDate: '',
            leaveType: '',
            reason: '',
            status: 'Pending',
            dayDifference: 1
        })
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleStartDate = (event: ChangeEvent<HTMLInputElement>): void => {
        const startDateValue = event.target.value;
        setLeaveForm({ ...leaveForm, startDate: startDateValue })
    }

    const handleEndDate = (event: ChangeEvent<HTMLInputElement>): void => {
        const endDateValue = event.target.value;
        setLeaveForm({ ...leaveForm, endDate: endDateValue })
    }

    const handleLeaveType = (event: ChangeEvent<HTMLSelectElement>): void => {
        const leaveTypeValue = event.target.value;
        setLeaveForm({ ...leaveForm, leaveType: leaveTypeValue })
    }

    const handleReason = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        const reasonValue = event.target.value;
        setLeaveForm({ ...leaveForm, reason: reasonValue })
    }

    const handleLeaveFormData = async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason || !leaveForm.leaveType) {
            setHasError(true);
            return;
        }
        const start = new Date(leaveForm.startDate);
        const end = new Date(leaveForm.endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('Invalid date format');
        }
        const timeDifference = end.getTime() - start.getTime();
        const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;
        if (dayDifference < 0) {
            setHasError(true);
        } 

        if (!checkDuplicatedLeaves(allLeaveData, leaveForm.startDate, leaveForm.endDate)) {
            setErrorMessage("You already applied for specific dates")
            return
        } 

        if (initialLeaveData) {
            if (leaveForm.leaveType === "paid" && initialLeaveData.leaveType === "unpaid") {
                if (employeeData.leaveBalance - dayDifference < 0) {
                    setErrorMessage("Your paid leaves are not enough!")
                    return
                }
            }
        }
        else {
            if (employeeData.leaveBalance - dayDifference < 0) {
                setErrorMessage("Your paid leaves are not enough!")
                return
            }
        }

        const user = getUserFromSession()
        const updatedDayDifference = dayDifference ?? 1;
        const leaveData: Leave = {
            empId: employeeData.empId,
            email: user.email,
            dayDifference: updatedDayDifference,
            status: leaveForm.status,
            leaveType: leaveForm.leaveType,
            reason: leaveForm.reason,
            startDate: leaveForm.startDate,
            endDate: leaveForm.endDate,
        }

        var updatedEmployeeData = { ...employeeData }
        if (initialLeaveData) {
            if (initialLeaveData.leaveType === "paid" && leaveForm.leaveType === "unpaid") {
                updatedEmployeeData = { ...employeeData, leaveBalance: employeeData.leaveBalance + initialLeaveData.dayDifference }
            }
            else if (initialLeaveData.leaveType === "unpaid" && leaveForm.leaveType === "paid") {
                updatedEmployeeData = { ...employeeData, leaveBalance: employeeData.leaveBalance - updatedDayDifference }
            }
            else {
                if (leaveForm.leaveType === "paid") {
                    updatedEmployeeData = { ...employeeData, leaveBalance: employeeData.leaveBalance + initialLeaveData.dayDifference - updatedDayDifference }
                }
            }
        }
        else {
            if (leaveForm.leaveType === "paid") {
                updatedEmployeeData = { ...employeeData, leaveBalance: employeeData.leaveBalance - updatedDayDifference }
            }
        }
        try {
            const response = await updateEmployee(updatedEmployeeData).unwrap()
            console.log(response)
        }
        catch (error) {
            alert(`Error message ${error}`)
        }
        if (!initialLeaveData) {
            try {
                const responseData = await submitLeave(leaveData).unwrap()
                console.log(responseData);
            }
            catch (error) {
                alert(`Error Message, ${error}`)
            }
        }
        else {
            if (!compareUpdatedData(initialLeaveData, leaveForm)) {
                setErrorMessage("Form not updated please try again!")
                return;
            }
            const updatedData = { ...leaveForm, status: "Pending", dayDifference: updatedDayDifference }
            try {
                const responseData = await updateLeaveById(updatedData).unwrap();
                console.log(responseData);
            }
            catch (error) {
                alert(`Error Message ,${error}`)
            }
        }
        dispatch(setShowPopUp(false));
        dispatch(setRefetchLeaveHistory(!refetchLeaveHistory))
    }

    const handleCancelRequest = () => {
        dispatch(setShowPopUp(false));
    }

    return (
        <form onSubmit={handleLeaveFormData} className={`form-container form-pop-up ${showFormPopUp ? "show-pop-up" : ''}`}>
            <div className="form-header">
                <img src={palTechLogo} alt="paltech-logo" className="paltech-logo" />
                <h1>Apply Leave</h1>
            </div>
            <label htmlFor="start-date">Start Date<span className="error-message">*</span></label>
            <input value={leaveForm.startDate} type="date" id="start-date" onChange={(e) => handleStartDate(e)} />
            {hasError && !leaveForm.startDate && (
                <span className="error-message">Field is required</span>
            )}
            <label htmlFor="end-date">End Date<span className="error-message">*</span></label>
            <input value={leaveForm.endDate} type="date" id="end-date" onChange={(e) => handleEndDate(e)} />
            {hasError && !leaveForm.endDate && (
                <span className="error-message">Field is required</span>
            )}
            {leaveForm.startDate && leaveForm.endDate &&
                new Date(leaveForm.startDate) > new Date(leaveForm.endDate) && (
                    <span className="error-message">End date should be less than start date.</span>
                )}
            <label htmlFor="leave-type">Leave Type<span className="error-message">*</span></label>
            <select value={leaveForm.leaveType} id="leave-type" onChange={(e) => handleLeaveType(e)}>
                <option value="">Select Leave Type</option>
                <option value="unpaid">Unpaid Leave-Infinite days available</option>
                <option value="paid">Paid Leave-{employeeData.leaveBalance} days available</option>
            </select>
            {hasError && !leaveForm.leaveType && (
                <span className="error-message">Field is required</span>
            )}
            <label htmlFor="reason">Reason<span className="error-message">*</span></label>
            <textarea id="reason" value={leaveForm.reason} onChange={(e) => handleReason(e)}></textarea>
            {hasError && !leaveForm.reason && (
                <span className="error-message">Field is required</span>
            )}
            <div className="btn-container">
                <button type="button" className="button cancel-btn" onClick={handleCancelRequest}>Cancel</button>
                <button type="submit" className="button submit-btn">Request</button>
            </div>
            {errorMessage && (<span className="error-message">{errorMessage}</span>)}
        </form>
    )
}

export default LeaveForm