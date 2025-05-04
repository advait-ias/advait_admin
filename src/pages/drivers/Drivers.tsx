import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import Add from "../../components/add/Add";
import DataTable from "../../components/dataTable/DataTable";
import "./drivers.scss";

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
    width: 200,
  },
  {
    field: "phone",
    type: "string",
    headerName: "Phone",
    width: 130,
  },
  {
    field: "vehicleCategory",
    type: "string",
    headerName: "Vehicle Category",
    width: 130,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 100,
    type: "string",
  },
  {
    field: "verified",
    headerName: "Verified",
    width: 100,
    type: "boolean",
  },
];

const Drivers = () => {
  const [open, setOpen] = useState(false);

  // CALL THE API
  const { isLoading, data } = useQuery({
    queryKey: ["allusers"],
    queryFn: () =>
      fetch("https://api.mfeel.co.in/partner").then((res) => res.json()),
  });

  const filteredData =
    data?.filter((user: any) => user.role === "driver") || [];

  return (
    <div className="drivers">
      <div className="info">
        <h1>Drivers</h1>
        <button onClick={() => setOpen(true)}>Add New Driver</button>
      </div>
      {/* <DataTable slug="drivers" columns={columns} rows={userRows} /> */}
      {/* CALL THE API */}
      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="driver"
          columns={columns}
          rows={filteredData.map((user: any, index: number) => ({
            id: user._id || index, // Ensure each row has a unique 'id'
            img: user.profilePic,
            name: user.name,
            phone: user.mobile,
            vehicleCategory: user.vehicle?.vehicleCategory || "N/A",
            createdAt: new Date(user.createdAt).toLocaleDateString("en-GB"),
            verified: user.isVerified,
          }))}
        />
      )}

      {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Drivers;
