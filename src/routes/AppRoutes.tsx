import EmployeeDashboard from "../features/dashboard/EmployeeDashboard";
import HRDashboard from "../features/dashboard/HRDashboard";
import ManagerDashboard from "../features/dashboard/ManagerDashboard";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import { Route, Routes } from "react-router-dom";
import { store } from "../store/store";
import { Provider } from "react-redux";
import LeaveHistory from "../features/leave/LeaveHistory";
import LeaveStatus from "../features/leave/LeaveStatus";
const AppRoutes: React.FC = () => {
    return (
        <Provider store={store}>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/employee"
                    element={
                        <ProtectedRoute role="employee">
                            <EmployeeDashboard />
                        </ProtectedRoute>} >
                    <Route path="leave-history" element={<LeaveHistory />} />
                </Route>
                <Route
                    path="/manager"
                    element={
                        <ProtectedRoute role="manager">
                            <ManagerDashboard />
                        </ProtectedRoute>} >
                    <Route path="leave-requests" element={<LeaveStatus />} />
                    <Route path="leave-history" element={<LeaveHistory />} />
                </Route>
                <Route
                    path="/hr"
                    element={
                        <ProtectedRoute role="hr">
                            <HRDashboard />
                        </ProtectedRoute>}>
                    <Route path="leave-history" element={<LeaveHistory />} />
                    <Route path="leave-requests" element={<LeaveStatus />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes >
        </Provider>

    )
}
export default AppRoutes;