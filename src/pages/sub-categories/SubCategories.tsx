import DataTable from "../../components/dataTable/DataTable";
import { Link } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllSubCategories } from "../../api/services/subCategoryService";
import "./subCategories.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "category",
    headerName: "Category Name",
    width: 200,
  },
  {
    field: "name",
    headerName: "Sub Category Name",
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

const SubCategories = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["sub-category"],
    queryFn: fetchAllSubCategories,
  });

  const formattedRows =
    data?.map((exam: any, index: number) => ({
      id: exam._id || index,
      category: exam.category.name,
      name: exam.name,
      isActive: exam.isActive,
      createdAt: new Date(exam.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="sub-categories">
      <div className="info">
        <h1>Sub Categories</h1>
        <Link to="/sub-categories/add">
          <button>Add New Sub Category</button>
        </Link>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="sub-category"
          route="sub-categories"
          columns={columns}
          rows={formattedRows}
        />
      )}
    </div>
  );
};

export default SubCategories;
