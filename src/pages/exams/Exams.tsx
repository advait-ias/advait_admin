import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../components/dataTable/DataTable";
import { fetchAllExams } from "../../api/services/examService";
import "./exams.scss";
import AddExamDialog from "./AddExamDialog";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Exam Name",
    width: 200,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 150,
  },
  {
    field: "isActive",
    headerName: "Active",
    type: "boolean",
    width: 100,
  },
];

const Exams = () => {
  const [open, setOpen] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchAllExams,
  });

  const formattedRows =
    data?.map((exam: any, index: number) => ({
      id: exam._id || index,
      name: exam.name,
      description: exam.description,
      isActive: exam.isActive,
      createdAt: new Date(exam.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="exams">
      <div className="info">
        <h1>Exams</h1>
        <button onClick={() => setOpen(true)}>Add New Exam</button>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="exam" columns={columns} rows={formattedRows} />
      )}

      {open && <AddExamDialog setOpen={setOpen} />}
    </div>
  );
};

export default Exams;
