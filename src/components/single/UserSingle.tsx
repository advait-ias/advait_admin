import axios from "axios";
import { singleUser } from "../../data";
import { useEffect, useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./single.scss";

// type Props = {
//   _id: number;
//   profilePic?: string;
//   name: string;
//   email: object;
//   mobile: object;
//   gender: object;
//   role: object;
//   city?: object;
//   district?: object;
//   documents?: { time: string; text: string }[];
//   vehicle?: { time: string; text: string }[];
//   professional?: { time: string; text: string }[];
// };

const UserSingle = (props: any) => {
  const [editableUser, setEditableUser] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log("props", props);

  useEffect(() => {
    setEditableUser(props.user);
  }, [props.user]);

  if (props.user === null) {
    return (
      <div className="single">
        <div className="view">
          <div className="info">
            <div className="topInfo">
              <h1>Loading...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allowedFields = [
    "email",
    "mobile",
    "gender",
    "role",
    "city",
    "district",
    // "createdAt",
    // "updatedAt",
  ];

  // Handle input changes
  const handleChange = (key: string, value: any) => {
    setEditableUser((prev: any) => ({ ...prev, [key]: value }));
    setIsEditing(true);
  };

  // Handle Save
  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `https://api.mfeel.co.in/user/${props.user._id}`,
        editableUser
      );
      if (response.status === 200) {
        alert("User updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      alert("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="topInfo">
            {props.user.profilePic && (
              <img src={props.user.profilePic} alt="" />
            )}
            <h1>{props.user.name}</h1>
          </div>
          <div className="details">
            {props.user ? (
              <div className="items">
                {Object.entries(props.user)
                  .filter(
                    ([key, value]) => allowedFields.includes(key) && value
                  )
                  .map(([key, value]) => (
                    <div className="item" key={key}>
                      <span className="itemTitle">{key}</span>
                      <input
                        className="itemInput"
                        type={typeof value === "number" ? "number" : "text"}
                        value={String(value)}
                        onChange={(e) =>
                          handleChange(
                            key,
                            typeof value === "number"
                              ? Number(e.target.value)
                              : e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <p>Loading user data...</p> // Show a fallback message
            )}

            <button
              className="saveButton"
              onClick={handleSave}
              disabled={!isEditing || loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
          {/* <div className="details">
            {Object.entries(props.user)
              .filter(([key, value]) => allowedFields.includes(key) && value) // Ensure only allowed fields with existing values
              .map(([key, value]) => (
                <div className="item" key={key}>
                  <span className="itemTitle">{key}</span>
                  <span className="itemValue">
                    {typeof value === "string" || typeof value === "number"
                      ? value
                      : key.includes("At")
                      ? new Date(value as string).toLocaleString()
                      : JSON.stringify(value)}{" "}
                  </span>
                </div>
              ))}
          </div> */}
          <hr />
        </div>
        <hr />
        {singleUser.chart && (
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={singleUser.chart.data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {singleUser.chart.dataKeys.map((dataKey, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={dataKey.name}
                    stroke={dataKey.color}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="activities">
        <h2>Latest Activities</h2>
        <p>No recent activities</p>
        {/* {singleUser.activities && (
          <ul>
            {singleUser.activities.map((activity) => (
              <li key={activity.text}>
                <div>
                  <p>{activity.text}</p>
                  <time>{activity.time}</time>
                </div>
              </li>
            ))}
          </ul>
        )} */}
      </div>
    </div>
  );
};

export default UserSingle;
