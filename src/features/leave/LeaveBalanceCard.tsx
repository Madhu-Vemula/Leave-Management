import DonutChart from "../../components/layout/DoNutChart"
import Loader from "../../components/layout/Loader";
import { LeaveBalanceCardProps } from "../../Types"
import { calculateLeaveTypes } from "../../utils/leaveUtils"

const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = (props) => {
    const { leaveData, employeeData } = props;
    const leaveTypes = calculateLeaveTypes(leaveData)
    console.log(leaveTypes)

    return (
        <div className="leave-balance-card">
            <h2>Total leave balance :{employeeData ? employeeData.leaveBalance : <Loader />} </h2>
            <div className="donut-container">
                <div className="donut">
                    <DonutChart leaveTypes={leaveTypes} />
                </div>
                <div >
                    <button type="button" className="button paid-btn">Paid {leaveTypes.paidLeaves}/20 </button>
                    <button type="button" className="button unpaid-btn">Unpaid {leaveTypes.unPaidLeaves}/Infinity</button>
                </div>
            </div>
        </div>
    )
}

export default LeaveBalanceCard