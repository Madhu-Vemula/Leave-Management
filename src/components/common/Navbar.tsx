import { NavLink, useNavigate } from "react-router-dom"
import palTechLogoNew from "../../assets/images/paltech_logo_new.svg"
import navBarIcon from "../../assets/icons/nav-bar-icon.svg"
import { getUserRoleFromSession } from "../../utils/roleUtils"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { setLeaveStatusFilter, setLeaveTypeFilter } from "../../features/leave/leaveSlice"
import { useState } from "react"

const Navbar: React.FC = () => {
    const role = getUserRoleFromSession();
    const navigate = useNavigate()
    const authRole = role?.toLowerCase()
    const [showNavBar, setShowNavBar] = useState<boolean>(false)
    const showFormPopUp = useSelector((state: RootState) => state.ui.showFormPopUp);
    const actionStatus = useSelector((state: RootState) => state.manager.actionStatus)
    const dispatch = useDispatch()


    const logOutUser = (): void => {
        sessionStorage.removeItem('user');
        navigate("/")
    }
    const setDefaultFilterTypes = (): void => {
        dispatch(setLeaveTypeFilter('all'))
        dispatch(setLeaveStatusFilter('all'))
    }

    const toggleNavBar = (): void => {
        setShowNavBar((prev) => !prev)
    }
    return (
        <>
            <div className={`navbar-containter ${(showFormPopUp || actionStatus) && 'disbale-pointer-events'} `}>
                <img src={palTechLogoNew} alt="paltech-logo-new" className="paltech-logo-new" />
                <button type="button" className="none-button" title="nav-bar" onClick={toggleNavBar}>
                    <img src={navBarIcon} alt="nav-bar" className="nav-bar-icon" />
                </button>
                <div className={`nav-buttons-container ${!showNavBar && 'hide-nav-bar'}`}>
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
                <div className={!showNavBar ? 'hide-nav-bar' : ''}>
                    <button
                        type="button"
                        title="logout"
                        className="button logout-btn"
                    >
                        <NavLink to="/" className="unstyled-link" onClick={() => logOutUser()}>Log out</NavLink>
                    </button>
                </div>
            </div> 
            <div className="mobile-navbar">
                 <button
                        type="button"
                        title="home"
                        className="button"
                    >
                        <NavLink to={`/${authRole}`} className="unstyled-link">Home</NavLink>
                    </button>
                 <button>History</button>
            </div>
        </>
    )
}
export default Navbar