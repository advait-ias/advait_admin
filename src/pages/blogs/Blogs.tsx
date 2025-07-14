import DataTable from "../../components/dataTable/DataTable";
import AddBlogDialog from "./AddBlogDialog";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogs } from "../../api/services/blogService";
import "./blogs.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "img",
    headerName: "Image",
    width: 75,
    renderCell: () => <img src={"/noavatar.png"} alt="" />,
  },
  { field: "headline", headerName: "Headline", width: 200 },
  { field: "content", headerName: "Content", width: 120 },
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

const Blogs = () => {
  const [open, setOpen] = useState(false);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchAllBlogs,
  });

  const formattedRows =
    data?.map((blog: any, index: number) => ({
      id: blog._id || index,
      image: blog.image,
      headline: blog.headline,
      content: blog.content,
      createdAt: new Date(blog.createdAt).toLocaleDateString("en-GB"),
      isActive: blog.isisActive,
    })) || [];

  return (
    <div className="blogs">
      <div className="info">
        <h1>Blogs</h1>
        <button onClick={() => setOpen(true)}>Add New Blog</button>
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

      {open && <AddBlogDialog setOpen={setOpen} />}
    </div>
  );
};

export default Blogs;
