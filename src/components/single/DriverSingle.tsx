import axios from "axios";
import { singleUser } from "../../data";
import { FormControlLabel, styled, Switch } from "@mui/material";
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

const DriverSingle = (props: any) => {
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [isDocumentVerified, setIsDocumentVerified] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editableUser, setEditableUser] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log("props", props);

  useEffect(() => {
    setIsUserVerified(props.user?.isUserVerified || false);
    setEditableUser(props.user);
  }, [props.user]);

  useEffect(() => {
    // Check if at least one document has valid images (front/back)
    // const hasVerifiedDocuments = Object.values(props.user?.documents || {}).some(
    //   (files) =>
    //     Array.isArray(files) && files.some((file) => file.front || file.back) // Ensure at least one file exists
    // );
    setIsDocumentVerified(false);
  }, [props.user?.documents]);

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
        `https://api.mfeel.co.in/partner/${props.user._id}`,
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

  const MaterialUISwitch = styled(Switch)(() => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M7.629 13.536l-3.181-3.182-1.414 1.415 4.595 4.596L17.071 6.923l-1.414-1.414-8.028 8.027z"/></svg>')`, // Checkmark icon for verified
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#4CAF50", // Green track for verified
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#4CAF50", // Red thumb for not verified
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M15.536 4.464L10 9.999l-5.536-5.535-1.414 1.414L8.586 11.414l-5.536 5.536 1.414 1.414L10 12.829l5.536 5.535 1.414-1.414-5.536-5.536 5.536-5.536z"/></svg>')`, // Cross icon for not verified
      },
      "&.Mui-checked": {
        backgroundColor: "#388E3C", // Green thumb for verified
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#D32F2F", // Red track for not verified
      borderRadius: 20 / 2,
    },
  }));

  const handleVerificationChange = async () => {
    try {
      await axios.post(
        `https://api.mfeel.co.in/partner/verify/${props.user._id}`
      );
      setIsUserVerified(!isUserVerified); // Update UI based on API response
    } catch (error) {
      console.error("Error updating verification status:", error);
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
            <FormControlLabel
              control={
                <MaterialUISwitch
                  checked={isUserVerified}
                  onChange={handleVerificationChange}
                  sx={{ m: 1 }}
                />
              }
              label={isUserVerified ? "Activated" : "Deactivated"}
            />
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
          {props.user.documents &&
            Object.entries(props.user.documents)
              .filter(([_, files]) => Array.isArray(files) && files.length > 0) // Ensure it's an array and not empty
              .map(([key, files]) => {
                const fileArray = files as { front?: string; back?: string }[]; // Explicit type assertion

                return (
                  <div key={key} className="document-group">
                    <div className="document-title">
                      <h4>{key.replace(/([A-Z])/g, " $1").trim()}</h4>{" "}
                      <FormControlLabel
                        control={
                          <MaterialUISwitch checked={isDocumentVerified} />
                        }
                        label={isDocumentVerified ? "Activated" : "Deactivated"}
                      />
                    </div>
                    {/* Convert camelCase to readable text */}
                    <div className="document-images">
                      {fileArray.map((file, index) => (
                        <div key={index} className="document-item">
                          {file.front && (
                            <img
                              src={file.front}
                              alt={`${key} Front`}
                              className="document-img"
                              onClick={() => setSelectedImage(file.front!)}
                            />
                          )}
                          {file.back && (
                            <img
                              src={file.back}
                              alt={`${key} Back`}
                              className="document-img"
                              onClick={() => setSelectedImage(file.back!)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
        </div>
        {/* Fullscreen Preview Modal */}
        {selectedImage && (
          <div
            className="image-preview-overlay"
            onClick={() => setSelectedImage(null)}
          >
            <div className="image-preview-container">
              <img
                src={selectedImage}
                alt="Document Preview"
                className="preview-img"
              />
              <button
                className="close-btn"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <hr />
        {/* Show Vehicle or Professional Details */}
        {props.user.vehicle ? (
          <div className="vehicle-details">
            <h3>Vehicle Details</h3>
            <div className="details">
              {Object.entries(props.user.vehicle)
                .filter(([_, value]) => value) // Ensure the value exists
                .map(([key, value]) => (
                  <div className="detail-item" key={key}>
                    <span className="detail-title">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="detail-value">{String(value)}</span>
                  </div>
                ))}
            </div>
          </div>
        ) : props.user.professional ? (
          <div className="professional-details">
            <h3>Professional Details</h3>
            <div className="details">
              {Object.entries(props.user.professional)
                .filter(([_, value]) => value) // Ensure the value exists
                .map(([key, value]) => (
                  <div className="detail-item" key={key}>
                    <span className="detail-title">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    {Array.isArray(value) ? (
                      <span className="detail-value">{value.join(", ")}</span> // Convert array to a readable string
                    ) : (
                      <span className="detail-value">{String(value)}</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ) : null}
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

export default DriverSingle;
