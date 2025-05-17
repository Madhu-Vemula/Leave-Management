import { Navigate } from "react-router-dom"
import { ProtectedRouteProps } from "../Types"

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const response = sessionStorage.getItem("user");
    const user = response ? JSON.parse(response) : null;
    if (!user || user.role?.toLowerCase() !== role) return <Navigate to="/" />
    return <>{children}</>;
}

export default ProtectedRoute;