import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchAllTestimonials } from "../../api/services/testimonialService";
import "./blogs.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 220 },

  { field: "name", headerName: "Name", width: 150 },
  { field: "message", headerName: "Message", width: 300 },
  { field: "rating", headerName: "Rating", width: 150 },
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

const Testimonials = () => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchAllTestimonials,
  });

  const formattedRows =
    data?.map((blog: any, index: number) => ({
      id: blog._id || index,
      name: blog.name,
      message: blog.message,
      rating: blog.rating,
      createdAt: new Date(blog.createdAt).toLocaleDateString("en-GB"),
      isActive: blog.isisActive,
    })) || [];

  return (
    <div className="testimonials">
      <div className="info">
        <h1>Testimonials</h1>
        <Link to="/testimonials/add">
          <button>Add New Testimonial</button>
        </Link>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="testimonial"
          route="testimonials"
          columns={columns}
          rows={formattedRows}
        />
      )}
    </div>
  );
};

export default Testimonials;
