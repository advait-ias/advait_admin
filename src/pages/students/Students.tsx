import DataTable from "../../components/dataTable/DataTable";
import AddStudentDialog from "./AddStudentDialog";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllStudents } from "../../api/services/studentService";
import "./students.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "img",
    headerName: "Avatar",
    width: 75,
    renderCell: () => <img src={"/noavatar.png"} alt="" />,
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
    field: "mobile",
    type: "string",
    headerName: "Phone",
    width: 120,
  },
  {
    field: "gender",
    type: "string",
    headerName: "Gender",
    width: 100,
  },
  {
    field: "course",
    headerName: "Course Name",
    width: 150,
  },
];

const Students = () => {
  const [open, setOpen] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["students"],
    queryFn: fetchAllStudents,
  });

  const formattedData =
    data?.map((student: any, index: number) => ({
      id: student._id || index,
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      gender: student.gender,
      course: student.courses[0] || "N/A",
    })) || [];

  return (
    <div className="users">
      <div className="info">
        <h1>Students</h1>
        <button onClick={() => setOpen(true)}>Add New Student</button>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="student" route="students" columns={columns} rows={formattedData} />
      )}

      <AddStudentDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Students;
