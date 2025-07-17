import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogs } from "../../api/services/blogService";
import { Link } from "react-router-dom";
import "./blogs.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 220 },

  { field: "headline", headerName: "Headline", width: 250 },
  { field: "content", headerName: "Content", width: 400 },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 100,
  },
  {
    field: "isActive",
    headerName: "Active",
    type: "boolean",
    width: 100,
  },
];

const Blogs = () => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchAllBlogs,
  });

  const formattedRows =
    data?.map((blog: any, index: number) => ({
      id: blog._id || index,
      headline: blog.headline,
      content: blog.content,
      createdAt: new Date(blog.createdAt).toLocaleDateString("en-GB"),
      isActive: blog.isisActive,
    })) || [];

  return (
    <div className="blogs">
      <div className="info">
        <h1>Blogs</h1>
        <Link to="/blogs/add">
          <button>Add New Blog</button>
        </Link>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="blog"
          route="blogs"
          columns={columns}
          rows={formattedRows}
        />
      )}
    </div>
  );
};

export default Blogs;
