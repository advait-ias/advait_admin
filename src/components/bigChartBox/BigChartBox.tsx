import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./bigChartBox.scss";

const data = [
  {
    name: "Sun",
    clothes: 0,
    electronic: 0,
  },
  {
    name: "Mon",
    clothes: 0,
    electronic: 0,
  },
  {
    name: "Tue",
    clothes: 0,
    electronic: 0,
  },
  {
    name: "Wed",
    clothes: 0,
    electronic: 0,
  },
  {
    name: "Thu",
    clothes: 0,
    electronic: 0,
  },
  {
    name: "Fri",
    clothes: 0,
    electronic: 0,
  },
  {
    name: "Sat",
    clothes: 0,
    electronic: 0,
  },
];

const BigChartBox = () => {
  return (
    <div className="bigChartBox">
      <h1>Revenue Analytics</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="electronic"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="clothes"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BigChartBox;
