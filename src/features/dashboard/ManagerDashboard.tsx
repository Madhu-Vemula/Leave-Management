import { useGetEmployeeByMailQuery } from "../../services/employeeService";
import { useGetLeaveByUserQuery } from "../../services/leaveService"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store"
import Profile from "../../components/common/Profile";
import LeaveBalanceCard from "../leave/LeaveBalanceCard";
import Navbar from "../../components/common/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { setShowPopUp } from "../../store/uiSlice";
import { setLeaveInitialData } from "../leave/leaveSlice";
import LeavePopUp from "../../components/common/LeavePopUp";
import ActionPopUp from "../../components/common/ActionPopUp";

const ManagerDashboard: React.FC = () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const { data: leaveData = [] } = useGetLeaveByUserQuery(user.email);
    const { data: employeeData = [] } = useGetEmployeeByMailQuery(user.email);
    const dispatch = useDispatch();
    const actionStatus = useSelector((state: RootState) => state.manager.actionStatus)
    const showFormPopUp = useSelector((state: RootState) => state.ui.showFormPopUp);
    const showCancelPopUp = useSelector((state: RootState) => state.employee.showCancelPopUp)


    const showLeavePopUp = (value: boolean): void => {
        dispatch(setShowPopUp(value))
        dispatch(setLeaveInitialData(null))
    }

    const location = useLocation()
    const isLeaveRequestsRoute = location.pathname.includes('leave-requests')
    const isLeaveHistoryRoute = location.pathname.includes('leave-history')

    return (
        <>
            <div>
                <Navbar />
                <div className={`manager-container ${actionStatus || showFormPopUp || showCancelPopUp ? "disable-containter " : ''}`}>
                    <h1>Manager Dashboard</h1>
                    {!isLeaveRequestsRoute && !isLeaveHistoryRoute && (
                        <div className="employee-header">
                            <Profile employeeData={employeeData[0]} />
                            <LeaveBalanceCard leaveData={leaveData} employeeData={employeeData[0]} />
                        </div>
                    )}
                    {isLeaveRequestsRoute && (
                        <Outlet />
                    )}
                    {isLeaveHistoryRoute && (
                        <div className={`leave-history-container`}>
                            <h2>My leave history</h2>
                            <button
                                type="button"
                                className="button submit-btn req-leave-btn"
                                onClick={() => showLeavePopUp(true)}>Request Leave</button>
                            <Outlet />
                        </div>
                    )}
                </div >
            </div>
            <LeavePopUp />
            <ActionPopUp />
        </>
    )
}

export default ManagerDashboard;