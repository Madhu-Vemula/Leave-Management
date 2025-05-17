import { ChangeEvent, useState } from "react"
import { Employee } from "../../Types"
import { useAddEmployeeMutation, useUpdateEmployeeMutation, useGetAllManagersQuery, useGetEmployeesQuery } from "../../services/employeeService"
import paltechLogo from "../../assets/images/paltech_logo.png";
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { setShowPopUp } from "../../store/uiSlice"
import { checkDuplicateEmployeeEMails, checkDuplicateEmployeeIds } from "../../utils/employeeUtils";


const EmployeeForm: React.FC = () => {
    const dispatch = useDispatch();
    const showFormPopUp = useSelector((state: RootState) => state.ui.showFormPopUp)
    const initialEmployeeData = useSelector((state: RootState) => state.employee.initialData)
    const [addEmployee] = useAddEmployeeMutation()
    const [updateEmployee] = useUpdateEmployeeMutation()
    const { data: managerData = [] } = useGetAllManagersQuery();
    const { data: allEmployeesData = [] } = useGetEmployeesQuery()
    const [employeeForm, setEmployeeForm] = useState<Employee>(
        initialEmployeeData ?? {
            empId: '',
            name: '',
            email: '',
            role: '',
            managerEmail: '',
            password: '',
            leaveBalance: 20
        })
    const [hasError, setHasError] = useState<boolean>(false);
    const [hasManagerError, sethasManagerError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("")

    const handleEmployeeId = (event: ChangeEvent<HTMLInputElement>): void => {
        const idValue = event.target.value;
        setEmployeeForm({ ...employeeForm, empId: idValue })
        if (checkDuplicateEmployeeIds(allEmployeesData, idValue)) {
            setErrorMessage("Employee Id already Taken")
        }
        else setErrorMessage('')
    }

    const handleEmployeeName = (event: ChangeEvent<HTMLInputElement>): void => {
        const nameValue = event.target.value;
        setEmployeeForm({ ...employeeForm, name: nameValue })
    }

    const handleEmployeePassword = (event: ChangeEvent<HTMLInputElement>): void => {
        const passwordValue = event.target.value;
        setEmployeeForm({ ...employeeForm, password: passwordValue })
        if (employeeForm.password.length < 6) {
            setErrorMessage("Password minimum length is 6")
        }
        else setErrorMessage('')
    }

    const handleEmployeeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
        const emailValue = event.target.value;
        setEmployeeForm({ ...employeeForm, email: emailValue })
        if (checkDuplicateEmployeeEMails(allEmployeesData, emailValue)) {
            setErrorMessage('Employee email already taken')
        }
        else setErrorMessage('')
    }

    const handleEmployeeRole = (event: ChangeEvent<HTMLSelectElement>): void => {
        const roleValue = event.target.value;
        setEmployeeForm({ ...employeeForm, role: roleValue })
    }

    const handleEmployeeManager = (event: ChangeEvent<HTMLInputElement>): void => {
        const managerValue = event.target.value;
        setEmployeeForm({ ...employeeForm, managerEmail: managerValue })
    }

    const handleCancelRequest = (): void => {
        dispatch(setShowPopUp(false));
    }

    const submitEmployeeForm = async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (errorMessage) return;
        if (!employeeForm.name || !employeeForm.email || !employeeForm.empId
            || !employeeForm.role || !employeeForm.password) {
            setHasError(true);
            return;
        }

        if (!employeeForm.email.includes("@pal.tech")) {
            setErrorMessage("Include domain @pal.tech for Employee");
            return;
        }

        if (employeeForm.role === "employee") {
            if (!employeeForm.managerEmail) {
                sethasManagerError(true);
                return;
            }
            if (!employeeForm.managerEmail.includes("@pal.tech")) {
                setErrorMessage("Include domain @pal.tech for Manager");
                return;
            }
        }
        if (employeeForm.role === "manager") {
            employeeForm.managerEmail = 'hr@pal.tech';
        }
        if (!initialEmployeeData) {
            try {
                const response = await addEmployee(employeeForm).unwrap();
                console.log(response);
                dispatch(setShowPopUp(false));
            }
            catch (error) {
                alert(`Error Message ${error}`)
            }
        }
        else {
            try {
                const response = await updateEmployee(employeeForm).unwrap();
                console.log(response);
                dispatch(setShowPopUp(false));
            }
            catch (error) {
                alert(`Error Message ${error}`)
            }
        }
    }
    return (
        <form onSubmit={submitEmployeeForm} className={`form-container form-pop-up ${showFormPopUp ? "show-pop-up" : ''}`}>
            <div className="form-header">
                <img src={paltechLogo} alt="paltech-logo" className="paltech-logo" />
                <h1>Add Employee</h1>
            </div>
            <label htmlFor="employee-id">Employee id<span className="error-message">*</span></label>
            <input
                type="text"
                placeholder="Enter employee id"
                id="employee-id"
                value={employeeForm.empId}
                onChange={(e) => handleEmployeeId(e)} />
            {hasError && !employeeForm.empId && (
                <span className="error-message">Field is required</span>
            )}
            <label htmlFor="employee-name">Employee name<span className="error-message">*</span></label>
            <input
                type="text"
                placeholder="Enter employee name"
                id="employee-name"
                value={employeeForm.name}
                onChange={(e) => handleEmployeeName(e)} />
            {hasError && !employeeForm.name && (
                <span className="error-message">Field is required</span>
            )}
            <label htmlFor="employee-password">Employee password<span className="error-message">*</span></label>
            <input
                type="text"
                placeholder="Enter employee password"
                id="employee-password"
                value={employeeForm.password}
                onChange={(e) => handleEmployeePassword(e)} />
            {hasError && !employeeForm.password && (
                <span className="error-message">Field is required</span>
            )}
            <label htmlFor="employee-email">Employee email<span className="error-message">*</span></label>
            <input
                type="text"
                placeholder="Enter employee email"
                id="employee-email"
                value={employeeForm.email}
                onChange={(e) => handleEmployeeEmail(e)} />
            {hasError && !employeeForm.email && (
                <span className="error-message">Field is required</span>
            )}
            <label htmlFor="assign-role">Assign role<span className="error-message">*</span></label>
            <select
                id="assign-role"
                value={employeeForm.role}
                onChange={(e) => handleEmployeeRole(e)}>
                <option value="">Select role</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
            </select>
            {hasError && !employeeForm.role && (
                <span className="error-message">Field is required</span>
            )}
            {employeeForm.role === "employee" && (
                <>
                    <label htmlFor="manager-email">Assign Manager<span className="error-message">*</span></label>
                    <input
                        list="datalist"
                        type="text"
                        id="manager-email"
                        value={employeeForm.managerEmail}
                        onChange={(e) => handleEmployeeManager(e)}
                        placeholder="Enter manager email" />
                    <datalist id="datalist" >
                        {
                            managerData.map((item) => (
                                <option key={item.id} value={item.email}>{item.email}</option>
                            ))
                        }
                    </datalist>
                    {hasManagerError && !employeeForm.managerEmail && (
                        <span className="error-message">Field is required</span>
                    )}
                </>
            )}
            <div className="btn-container">
                <button type="button" className="button cancel-btn" onClick={handleCancelRequest}>Cancel</button>
                <button type="submit" className="button submit-btn">Submit</button>
            </div>
            {errorMessage && (<span className="error-message">{errorMessage}</span>)}
        </form>
    )
}
export default EmployeeForm