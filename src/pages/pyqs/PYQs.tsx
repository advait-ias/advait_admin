import DataTable from "../../components/dataTable/DataTable";
import { Link } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPYQs } from "../../api/services/pyqService";
import "./pyqs.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "subject",
    headerName: "Subject Name",
    width: 200,
  },
  {
    field: "name",
    headerName: "PYQ Name",
    width: 250,
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

const PYQs = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["pyqs"],
    queryFn: fetchAllPYQs,
  });

  const formattedRows =
    data?.map((pyq: any, index: number) => ({
      id: pyq._id || index,
      subject: pyq.subject.name,
      name: pyq.name,
      isActive: pyq.isActive,
      createdAt: new Date(pyq.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="pyqs">
      <div className="info">
        <h1>PYQs</h1>
        <Link to="/pyqs/add">
          <button>Add New PYQ</button>
        </Link>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="pyq"
          route="pyqs"
          columns={columns}
          rows={formattedRows}
        />
      )}
    </div>
  );
};

export default PYQs;
