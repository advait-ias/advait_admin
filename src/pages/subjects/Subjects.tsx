import DataTable from "../../components/dataTable/DataTable";
import { Link } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllSubjects } from "../../api/services/subjectService";
import "./subjects.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Category Name",
    width: 200,
  },
  {
    field: "isActive",
    headerName: "Active",
    type: "boolean",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 150,
  },
];

const Subjects = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchAllSubjects,
  });

  const formattedRows =
    data?.map((category: any, index: number) => ({
      id: category._id || index,
      name: category.name,
      isActive: category.isActive,
      createdAt: new Date(category.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="subjects">
      <div className="info">
        <h1>Subjects</h1>
        <Link to="/subjects/add">
          <button>Add New Subject</button>
        </Link>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="subject"
          route="subjects"
          columns={columns}
          rows={formattedRows}
        />
      )}
    </div>
  );
};

export default Subjects;
