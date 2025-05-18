import Navbar from "../../components/common/Navbar";
import "../../styles/main.css"
import { useGetLeaveByUserQuery } from "../../services/leaveService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store"
import { setShowPopUp } from "../../store/uiSlice";
import { setLeaveInitialData } from "../leave/leaveSlice";
import LeaveBalanceCard from "../leave/LeaveBalanceCard";
import Profile from "../../components/common/Profile";
import { useGetEmployeeByMailQuery } from "../../services/employeeService"
import { Outlet, useLocation } from "react-router-dom";
import { getUserMailFromSession } from "../../utils/roleUtils";
import LeavePopUp from "../../components/common/LeavePopUp";
import Loader from "../../components/layout/Loader";

const EmployeeDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const showFormPopUp = useSelector((state: RootState) => state.ui.showFormPopUp);
    const showCancelPopUp = useSelector((state: RootState) => state.employee.showCancelPopUp)

    const userEmail = getUserMailFromSession();
    const { data: leaveData = [], isLoading: isLoadingLeaveData } = useGetLeaveByUserQuery(userEmail);
    const { data: employeeData = [], isLoading: isLoadingEmployeeData } = useGetEmployeeByMailQuery(userEmail);

    const showLeavePopUp = (value: boolean): void => {
        dispatch(setShowPopUp(value))
        dispatch(setLeaveInitialData(null))
    } 
    
    const location = useLocation();
    const isLeaveHistoryRoute = location.pathname.includes('leave-history'); 
    return (
        <>
            {isLoadingEmployeeData || isLoadingLeaveData ? (
                <Loader />
            ) : (
                <>
                    <div>
                        <Navbar />
                        <div className={`employee-container ${showFormPopUp || showCancelPopUp ? 'disable-containter' : ''}`}>
                            <h1>Employee Dashboard</h1>
                            {!isLeaveHistoryRoute && (
                                <div className="employee-header">
                                    <Profile employeeData={employeeData[0]} />
                                    <LeaveBalanceCard leaveData={leaveData} employeeData={employeeData[0]} />
                                </div>
                            )}
                            {isLeaveHistoryRoute && (
                                <div className={`leave-history-container`}>
                                    <h2>My leave history</h2>
                                    <button
                                        type="button"
                                        className="button submit-btn req-leave-btn"
                                        onClick={() => showLeavePopUp(true)}>
                                        Request Leave
                                    </button>
                                    <Outlet />
                                </div>
                            )}
                        </div>
                    </div>
                    <LeavePopUp />
                </>
            )}
        </>
    )
}

export default EmployeeDashboard;

