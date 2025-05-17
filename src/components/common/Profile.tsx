import { ProfileProps } from "../../Types"
import palTechProfile from "../../assets/images/paltech-profile.jpg"
import Loader from "../layout/Loader";
const Profile: React.FC<ProfileProps> = (props) => {
    const { employeeData } = props;
    return (
        <>
            <div className="profile-containter">
                <h2>My profile</h2>
                {employeeData ? (
                    <div className="profile-header">
                        <img src={palTechProfile} alt="paltech-profile" className="pal-tech-profile" />
                        <div>
                            <p><b>Employee Id: </b><span>{employeeData.empId}</span></p> 
                             <p><b>Employee Name: </b><span>{employeeData.name}</span></p>
                            <p><b>Employee Email: </b>{employeeData.email}</p>
                            <p><b>Employee Role: </b>{employeeData.role.charAt(0).toUpperCase() + employeeData.role.slice(1)}</p>
                            <p><b>Reporting To: </b>{employeeData.managerEmail}</p>
                        </div>
                    </div>
                ) : (
                    <Loader />
                )}
            </div>
        </>
    )
}

export default Profile