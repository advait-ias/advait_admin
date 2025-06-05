import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import Add from "../../components/add/Add";
import DataTable from "../../components/dataTable/DataTable";
import "./tests.scss";
import { fetchAllTests } from "../../api/services/testService";

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
    headerName: "Test Category",
    width: 200,
    type: "string",
  },
  {
    field: "name",
    type: "string",
    headerName: "Test Name",
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
    headerName: "Free/Paid",
    width: 150,
  },
];

const Tests = () => {
  const [open, setOpen] = useState(false);

  // CALL THE API
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["tests"],
    queryFn: fetchAllTests,
  });

  return (
    <div className="users">
      <div className="info">
        <h1>Tests</h1>
        <button onClick={() => setOpen(true)}>Add New Test</button>
      </div>
      <p className="noData">No data</p>
      {/* CALL THE API */}
      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="test"
          route="tests"
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

export default Tests;
