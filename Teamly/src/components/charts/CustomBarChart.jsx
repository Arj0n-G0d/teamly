import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell, PieChart, Pie
} from "recharts";
import CustomTooltip from "./CustomTooltip.jsx";
import CustomLegend from "./CustomLegend.jsx";

const CustomBarChart = ({ data, colors }) => {
    const CustomTooltip = ({ active, payload }) => {
        if(active && payload && payload.length) {
            return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                    <p className="text-xs font-semibold mb-1">
                        { payload[0].payload.priority }
                    </p>
                    <p className="text-sm text-gray-600">
                        Count: { " " }
                        <span className="text-sm font-medium text-gray-900">
                            { payload[0].payload.count }
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white mt-6">
            <ResponsiveContainer width={ "100%" } height={ 325 }>
                <BarChart data={data}>
                   <CartesianGrid stroke={ "none" }/>
                    <XAxis
                        dataKey={ "priority" }
                        tick={{ fontSize: 12, fill: "#555" }}
                        stroke={ "none" }
                    />
                    <YAxis
                        tick={{ fontSize:12, fill: "#555" }}
                        stroke={ "none" }
                    />
                    <Bar
                        dataKey={ "count" }
                        nameKey={ "priority" }
                        fill={ "#FF8042" }
                        radius={ [10, 10, 0, 0] }
                        activeDot={{ r:8, fill: "yellow" }}
                        activeStyle={{ fill: "green" }}
                    >
                        { data.map((entry, index) => (
                            <Cell key={ index } fill={ colors[index] }/>
                        )) }
                    </Bar>
                    <Tooltip content={CustomTooltip} cursor={{ fill: "transparent" }}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomBarChart;