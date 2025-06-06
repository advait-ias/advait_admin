import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../components/dataTable/DataTable";
import { fetchAllCourses } from "../../api/services/courseService";
import "./courses.scss";
import AddCourseDialog from "./AddCourseDialog";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "title",
    headerName: "Course Name",
    width: 200,
    type: "string",
  },
  {
    field: "duration",
    headerName: "Duration (months)",
    width: 150,
    type: "number",
  },
  {
    field: "price",
    headerName: "Price (₹)",
    width: 120,
    type: "number",
  },
  {
    field: "discount",
    headerName: "Discount (₹)",
    width: 150,
    type: "number",
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 120,
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 120,
  },
];

const Courses = () => {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchAllCourses,
  });

  const rows =
    data?.map((course: any) => ({
      id: course._id,
      title: course.title,
      duration: course.duration,
      price: course.price,
      discount: course.discount,
      startDate: new Date(course.startDate).toLocaleDateString("en-GB"),
      endDate: new Date(course.endDate).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="courses">
      <div className="info">
        <h1>Courses</h1>
        <button onClick={() => setOpen(true)}>Add New Course</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="error">Failed to fetch courses.</p>
      ) : rows.length === 0 ? (
        <p className="noData">No data available.</p>
      ) : (
        <DataTable
          slug="course"
          route="courses"
          columns={columns}
          rows={rows}
        />
      )}

      {open && <AddCourseDialog setOpen={setOpen} />}
    </div>
  );
};

export default Courses;
