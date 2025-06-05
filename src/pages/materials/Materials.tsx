import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import Add from "../../components/add/Add";
import DataTable from "../../components/dataTable/DataTable";
import "./materials.scss";
import { fetchAllMaterials } from "../../api/services/materialService";

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

const Materials = () => {
  const [open, setOpen] = useState(false);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["faculties"],
    queryFn: fetchAllMaterials,
  });

  return (
    <div className="users">
      <div className="info">
        <h1>Materials</h1>
        <button onClick={() => setOpen(true)}>Add New Material</button>
      </div>
      <p className="noData">No data</p>
      {/* CALL THE API */}
      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="material"
          route="materials"
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

export default Materials;
