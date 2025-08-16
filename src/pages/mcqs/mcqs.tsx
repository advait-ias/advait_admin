import DataTable from "../../components/dataTable/DataTable";
import { Link } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMCQs } from "../../api/services/mcqService";
import "./mcqs.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "title",
    type: "string",
    headerName: "Title",
    width: 250,
  },
  {
    field: "totalTime",
    type: "string",
    headerName: "Duration",
    width: 100,
  },
  {
    field: "isPaid",
    headerName: "Paid",
    type: "boolean",
    width: 100,
  },
  {
    field: "showIn",
    headerName: "Show In",
    type: "boolean",
    width: 100,
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

const MCQs = () => {
  // CALL THE API
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["mcqs"],
    queryFn: fetchAllMCQs,
  });

  return (
    <div className="mcqs">
      <div className="info">
        <h1>MCQs</h1>
        <Link to="/mcqs/add">
          <button>Add New MCQ</button>
        </Link>
      </div>
      <p className="noData">No data</p>
      {/* CALL THE API */}
      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="mcq"
          route="mcqs"
          columns={columns}
          rows={data.map((quiz: any, index: number) => ({
            id: quiz._id || index, // Ensure each row has a unique 'id'
            title: quiz.title,
            totalTime: quiz.totalTime,
            isPaid: quiz.isPaid,
            showIn: quiz.showIn,
            isActive: quiz.isActive,
            createdAt: new Date(quiz.createdAt).toLocaleDateString("en-GB"),
          }))}
        />
      )}
    </div>
  );
};

export default MCQs;
