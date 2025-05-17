import { DonutChartProps } from '../../Types';
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { useState } from "react"

const DonutChart: React.FC<DonutChartProps> = (props) => {
    const { leaveTypes } = props
    var { paidLeaves, unPaidLeaves } = leaveTypes
    const data = [{ name: "Paid", leaves: paidLeaves }, { name: "Unpaid", leaves: unPaidLeaves }]
    const [activeIndex, setActiveIndex] = useState(null);

    const handleMouseEnter = (_: void, index: any) => {
        setActiveIndex(index);
    }

    const handleMouseLeave = () => {
        setActiveIndex(null);
    }

    return (
        <PieChart width={400} height={400}>
            <Tooltip
                contentStyle={{
                    width: '150px',
                    fontSize: '12px',
                    padding: '5px',
                    borderRadius: '0.25rem'
                }}
            />
            <Pie
                data={data}
                dataKey="leaves"
                outerRadius={135}
                innerRadius={90}
                label={({ name, leaves }) => `${name}: ${leaves}`}
                labelLine={false}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={entry.name === "Paid" ? "rgb(235, 102, 102)" : "rgb(255,208,110)"}
                        style={{
                            filter: activeIndex === index ? 'drop-shadow(0 0 8px rgb(235, 102, 102)))' : 'none',
                            animation: activeIndex === index ? 'blink 1s infinite alternate' : 'none',
                        }}
                    />
                ))}
            </Pie>
        </PieChart>
    );
};
export default DonutChart;
