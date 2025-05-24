import { useState } from "react";
import "./liveclass.scss";

const LiveClass = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="users">
      <div className="info">
        <h1>Live Classes</h1>
      </div>
      <p className="noData">Coming Soon</p>
    </div>
  );
};

export default LiveClass;
