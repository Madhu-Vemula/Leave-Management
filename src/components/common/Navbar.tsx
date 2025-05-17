import { NavLink, useNavigate } from "react-router-dom"
import palTechLogoNew from "../../assets/images/paltech_logo_new.svg"
import { getUserRoleFromSession } from "../../utils/roleUtils"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { setLeaveStatusFilter, setLeaveTypeFilter } from "../../features/leave/leaveSlice"

const Navbar: React.FC = () => {
    const role = getUserRoleFromSession();
    const navigate = useNavigate()
    const authRole = role?.toLowerCase()
    const showFormPopUp = useSelector((state: RootState) => state.ui.showFormPopUp);
    const actionStatus = useSelector((state: RootState) => state.manager.actionStatus)
    const dispatch = useDispatch()

    const logOutUser = (): void => {
        sessionStorage.removeItem('user');
        navigate("/")
    }
    const setDefaultFilterTypes = (): void => {
        dispatch(setLeaveTypeFilter('all'));
        dispatch(setLeaveStatusFilter('all'))
    }

    return (
        <div className={`navbar-containter ${(showFormPopUp || actionStatus) && 'disbale-pointer-events'} `}>
            <img src={palTechLogoNew} alt="paltech-logo-new" className="paltech-logo-new" />
            <div className="nav-buttons-container">
                <button
                    type="button"
                    title="home"
                    className="button"
                >
                    <NavLink to={`/${authRole}`} className="unstyled-link">Home</NavLink>
                </button>
                <button
                    type="button"
                    title="leave-history"
                    className="button"
                    onClick={setDefaultFilterTypes}
                >
                    <NavLink to="leave-history" className="unstyled-link">Leave History</NavLink>
                </button>

                {(authRole === 'manager' || authRole === "hr") && (
                    <button
                        type="button"
                        title="leave-requests"
                        className="button"
                        onClick={setDefaultFilterTypes}
                    >
                        <NavLink to="leave-requests" className="unstyled-link">Leave Requests</NavLink>
                    </button>
                )}

            </div>
            <div>
                <button
                    type="button"
                    title="leave-history"
                    className="button logout-btn"
                >
                    <NavLink to="/" className="unstyled-link" onClick={() => logOutUser()}>Log out</NavLink>
                </button>
            </div>
        </div>
    )
}
export default Navbar