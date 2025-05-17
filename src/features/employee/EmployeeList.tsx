import { useGetEmployeesQuery, useRemoveEmployeeMutation } from "../../services/employeeService"
import { Employee } from "../../Types";
import { useDispatch } from "react-redux"
import { setEmployeeInitialData } from "./employeeSlice";
import { setShowPopUp } from "../../store/uiSlice";
import { useDeleteLeavesByIdMutation, useLazyGetLeaveByUserQuery } from "../../services/leaveService";

const EmployeeList: React.FC = () => {
    const dispatch = useDispatch();
    const { data: employeeData = [] } = useGetEmployeesQuery();
    const [removeEmployee] = useRemoveEmployeeMutation();
    const [deleteLeavesById] = useDeleteLeavesByIdMutation()
    const [getLeavesByUser] = useLazyGetLeaveByUserQuery()

    const handleEditEmployee = (employee: Employee): void => {
        dispatch(setShowPopUp(true))
        dispatch(setEmployeeInitialData(employee))
    }

    const handleRemoveEmployee = async (employee: Employee): Promise<void> => {
        try {
            const response = await getLeavesByUser(employee.email).unwrap();
            await removeEmployee(employee.id).unwrap()
            response.forEach(async (leave) => {
                const response3 = await deleteLeavesById(leave.id ?? '')
                console.log(response3)
            })
        }
        catch (error: any) {
            alert(`Error Message ${error.message}`)
        }
    }
    return (
        <div className="table-container">
            <h2>Employee List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Employee Id</th>
                        <th>Employee Name</th>
                        <th>Employee Email</th>
                        <th>Employee Role</th>
                        <th>Employee Manager</th>
                        <th>Edit</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        employeeData.map((employee: Employee) => (
                            <tr key={employee.id}>
                                <td>{employee.empId}</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}</td>
                                <td>{employee.managerEmail}</td>
                                <td><button type="button" className="button edit-btn" onClick={() => handleEditEmployee(employee)}>Edit</button></td>
                                <td><button type="button" className="button remove-btn" onClick={() => handleRemoveEmployee(employee)}>Remove</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default EmployeeList