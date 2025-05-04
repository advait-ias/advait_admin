import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import Add from "../../components/add/Add";
import DataTable from "../../components/dataTable/DataTable";
import "./students.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "img",
    headerName: "Avatar",
    width: 75,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "name",
    type: "string",
    headerName: "Full Name",
    width: 175,
  },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 200,
  },
  {
    field: "phone",
    type: "string",
    headerName: "Phone",
    width: 120,
  },
  {
    field: "gender",
    type: "string",
    headerName: "Gender",
    width: 150,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 100,
    type: "string",
  },
];

const Students = () => {
  const [open, setOpen] = useState(false);

  // CALL THE API
  const { isLoading, data } = useQuery({
    queryKey: ["allusers"],
    queryFn: () =>
      fetch("https://api.mfeel.co.in/mechanic").then((res) => res.json()),
  });

  return (
    <div className="users">
      <div className="info">
        <h1>Students</h1>
        <button onClick={() => setOpen(true)}>Add New Student</button>
      </div>
      <p className="noData">No data</p>
      {/* CALL THE API */}
      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="user"
          columns={columns}
          rows={data.map((user: any, index: number) => ({
            id: user._id || index, // Ensure each row has a unique 'id'
            img: user.profilePic,
            name: user.name,
            phone: user.mobile,
            gender: user.gender,
            createdAt: new Date(user.createdAt).toLocaleDateString("en-GB"),
          }))}
        />
      )}

      {open && <Add slug="student" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Students;
