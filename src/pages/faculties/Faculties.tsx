import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllFaculty } from "../../api/services/facultyService";
import AddFacultyDialog from "./AddFacultyDialog";
import DataTable from "../../components/dataTable/DataTable";
import "./faculties.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "img",
    headerName: "Avatar",
    width: 75,
    renderCell: () => <img src={"/noavatar.png"} alt="" />, // Placeholder
  },
  { field: "name", headerName: "Full Name", width: 200 },
  { field: "mobile", headerName: "Phone", width: 120 },
  { field: "education", headerName: "Education", width: 150 },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 120,
  },
  {
    field: "verified",
    headerName: "Verified",
    type: "boolean",
    width: 100,
  },
];

const Faculties = () => {
  const [open, setOpen] = useState(false);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["faculties"],
    queryFn: fetchAllFaculty,
  });

  const formattedRows =
    data?.map((faculty: any, index: number) => ({
      id: faculty._id || index,
      img: faculty.profilePic,
      name: faculty.name,
      mobile: faculty.mobile,
      education: faculty.education,
      createdAt: new Date(faculty.createdAt).toLocaleDateString("en-GB"),
      verified: faculty.isVerified,
    })) || [];

  return (
    <div className="mechanics">
      <div className="info">
        <h1>Faculties</h1>
        <button onClick={() => setOpen(true)}>Add New Faculty</button>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="faculty" columns={columns} rows={formattedRows} />
      )}

      {open && <AddFacultyDialog setOpen={setOpen} />}
    </div>
  );
};

export default Faculties;
