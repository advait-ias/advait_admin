import AddCourseDialog from "./AddCourseDialog";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCourses } from "../../api/services/courseService";
import "./courses.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "coverImage",
    headerName: "Cover Image",
    width: 75,
    renderCell: () => <img src={"/noavatar.png"} alt="" />,
  },
  { field: "title", headerName: "Title", width: 200 },
  { field: "description", headerName: "Description", width: 200 },
  { field: "price", headerName: "Price", width: 120 },
  { field: "duration", headerName: "Duration", width: 120 },
  { field: "startDate", headerName: "Start Date", width: 120 },
  { field: "endDate", headerName: "End Date", width: 120 },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 120,
  },
  {
    field: "isActive",
    headerName: "Active",
    type: "boolean",
    width: 100,
  },
];

const Courses = () => {
  const [open, setOpen] = useState(false);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchAllCourses,
  });

  const formattedRows =
    data?.map((article: any, index: number) => ({
      id: article._id || index,
      coverImage: article.coverImage,
      title: article.title,
      description: article.description,
      price: article.price,
      duration: article.duration,
      startDate: new Date(article.startDate).toLocaleDateString("en-GB"),
      endDate: new Date(article.endDate).toLocaleDateString("en-GB"),
      createdAt: new Date(article.createdAt).toLocaleDateString("en-GB"),
      isActive: article.isisActive,
    })) || [];

  return (
    <div className="courses">
      <div className="info">
        <h1>Courses</h1>
        <button onClick={() => setOpen(true)}>Add New Course</button>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="course"
          route="courses"
          columns={columns}
          rows={formattedRows}
        />
      )}

      {open && <AddCourseDialog setOpen={setOpen} />}
    </div>
  );
};

export default Courses;
