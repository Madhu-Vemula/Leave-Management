import EmployeeForm from "../employee/EmployeeForm";
import EmployeeList from "../employee/EmployeeList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setShowPopUp } from "../../store/uiSlice";
import { setEmployeeInitialData } from "../employee/employeeSlice"
import Navbar from "../../components/common/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import ActionPopUp from "../../components/common/ActionPopUp";

const HRDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const showFormPopUp = useSelector((state: RootState) => state.ui.showFormPopUp)
    const actionStatus = useSelector((state: RootState) => state.manager.actionStatus)
    const handleAddEmployee = (): void => {
        dispatch(setShowPopUp(true));
        dispatch(setEmployeeInitialData(null))
    }

    const location = useLocation();
    const isLeaveHistoryRoute = location.pathname.includes('leave-history')
    const isLeaveRequestsRoute = location.pathname.includes('leave-requests')
    return (
        <>
            <div>
                <Navbar />
                <div className={`hr-container ${(showFormPopUp || actionStatus) && 'disable-containter'}`} >
                    <h1>HR Dashboard</h1>
                    {(!isLeaveHistoryRoute && !isLeaveRequestsRoute) && (
                        <div>
                            <EmployeeList />
                            <button
                                type="button"
                                className="button add-btn"
                                onClick={() => handleAddEmployee()}>Add Employee</button>
                        </div>
                    )}
                    {isLeaveRequestsRoute && (
                        <Outlet />
                    )}
                    {isLeaveHistoryRoute && (
                        <div className="leave-history-container">
                            <h2>Employess Leave History</h2>
                            <Outlet />
                        </div>
                    )}
                </div>
            </div>
            {showFormPopUp && (<EmployeeForm />)}
            <ActionPopUp />
        </>
    )
}

export default HRDashboard;