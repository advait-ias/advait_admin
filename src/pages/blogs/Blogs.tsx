import AddBlogDialog from "./AddBlogDialog";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogs } from "../../api/services/blogService";
import "./blogs.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "headline",
    headerName: "Headline",
    width: 150,
    type: "string",
  },
  {
    field: "content",
    headerName: "Content",
    width: 200,
    type: "string",
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

const Blogs = () => {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog"],
    queryFn: fetchAllBlogs,
  });

  const rows =
    data?.map((blog: any) => ({
      id: blog._id,
      headline: blog.headline,
      content: blog.content,
      isActive: blog.isActive,
      createdAt: new Date(blog.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="blogs">
      <div className="info">
        <h1>Blogs</h1>
        <button onClick={() => setOpen(true)}>Add New Blog</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="error">Failed to fetch blogs.</p>
      ) : rows.length === 0 ? (
        <p className="noData">No data available.</p>
      ) : (
        <DataTable slug="blog" route="blogs" columns={columns} rows={rows} />
      )}

      {open && <AddBlogDialog setOpen={setOpen} />}
    </div>
  );
};

export default Blogs;
