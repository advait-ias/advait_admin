import DataTable from "../../components/dataTable/DataTable";
import { Link } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "../../api/services/categoryService";
import "./categories.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Category Name",
    width: 200,
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

const Categories = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["category"],
    queryFn: fetchAllCategories,
  });

  const formattedRows =
    data?.map((category: any, index: number) => ({
      id: category._id || index,
      name: category.name,
      isActive: category.isActive,
      createdAt: new Date(category.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="categories">
      <div className="info">
        <h1>Categories</h1>
        <Link to="/categories/add">
          <button>Add New Category</button>
        </Link>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="category"
          route="categories"
          columns={columns}
          rows={formattedRows}
        />
      )}
    </div>
  );
};

export default Categories;
