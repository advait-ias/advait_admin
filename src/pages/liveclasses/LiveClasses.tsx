import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import Add from "../../components/add/Add";
import "./liveclasses.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "img",
    headerName: "Icon",
    width: 75,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "category",
    headerName: "Course Category",
    width: 200,
    type: "string",
  },
  {
    field: "name",
    type: "string",
    headerName: "Course Name",
    width: 200,
  },
  {
    field: "email",
    type: "string",
    headerName: "Duration",
    width: 150,
  },
  {
    field: "phone",
    type: "number",
    headerName: "Price",
    width: 150,
  },
];

const LiveClasses = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="users">
      <div className="info">
        <h1>Live Classes</h1>
      </div>
      <p className="noData">Coming Soon</p>
      {open && <Add slug="student" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default LiveClasses;
