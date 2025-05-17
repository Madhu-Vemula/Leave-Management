import { useLazyGetEmployeeByMailQuery } from "../services/employeeService"
import { User } from "../Types";

const useAuth = () => {
    const [triggerAuth, { data }] = useLazyGetEmployeeByMailQuery();
    const loginUser = (user: User) => {
        return triggerAuth(user.email);
    }
    return { loginUser, data }
}

export default useAuth