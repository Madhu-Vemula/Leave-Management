import { DonutChartProps } from '../../Types';
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { useState } from "react";

const DonutChart: React.FC<DonutChartProps> = (props) => {
    const { leaveTypes } = props;
    var { paidLeaves, unPaidLeaves } = leaveTypes;

    const noLeavesConsumed = paidLeaves === 0 && unPaidLeaves === 0;

    const data = noLeavesConsumed
        ? [{ name: "No leaves consumed", leaves: 1 }]
        : [
            { name: "Paid", leaves: paidLeaves },
            { name: "Unpaid", leaves: unPaidLeaves },
        ];

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleMouseEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    return (
        <PieChart width={400} height={400}>
            <Tooltip
                contentStyle={{
                    width: '150px',
                    fontSize: '12px',
                    padding: '5px',
                    borderRadius: '0.25rem',
                }}
                formatter={(value, name) => noLeavesConsumed ? ["No leaves Consumed"] : [`${value}`, name]}
            />
            <Pie
                data={data}
                dataKey="leaves"
                outerRadius={135}
                innerRadius={90}
                label={({ name, leaves }) =>
                    noLeavesConsumed ? "No leaves consumed" : `${name}: ${leaves}`
                }
                labelLine={false}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                startAngle={90}
                endAngle={-270}
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={
                            noLeavesConsumed
                                ? "rgb(6, 133, 6)" 
                                : entry.name === "Paid"
                                    ? "rgb(235, 102, 102)"
                                    : "rgb(255,208, 110)"
                        }
                        style={{
                            filter: activeIndex === index
                                ? `drop-shadow(0 0 8px ${noLeavesConsumed
                                    ? "rgba(12, 184, 12, 0.8)" 
                                    : entry.name === "Paid"
                                        ? "rgba(235, 102, 102, 0.8)"
                                        : "rgba(255, 208, 110, 0.8)"
                                })`
                                : "none",
                            animation: activeIndex === index ? "blink 1s infinite alternate" : "none",
                        }}
                    />
                ))}
            </Pie>
        </PieChart>
    );
};

export default DonutChart;