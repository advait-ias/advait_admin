import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllFaculty } from "../../api/services/facultyService";
import { Link } from "react-router-dom";
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
  { field: "experience", headerName: "Experience", width: 150 },
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
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["faculties"],
    queryFn: fetchAllFaculty,
  });

  const formattedRows =
    data?.map((faculty: any, index: number) => ({
      id: faculty._id || index,
      img: faculty.profilePic,
      name: faculty.name,
      experience: faculty.experience,
      education: faculty.education,
      createdAt: new Date(faculty.createdAt).toLocaleDateString("en-GB"),
      verified: faculty.isVerified,
    })) || [];

  return (
    <div className="mechanics">
      <div className="info">
        <h1>Faculties</h1>
        <Link to="/faculties/add">
          <button>Add New Faculty</button>
        </Link>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="faculty"
          route="faculties"
          columns={columns}
          rows={formattedRows}
        />
      )}
    </div>
  );
};

export default Faculties;
