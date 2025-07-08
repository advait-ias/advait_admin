import AddExamDialog from "./AddCategoryDialog";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "../../api/services/categoryService";
import "./categories.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "category",
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
  const [open, setOpen] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["category"],
    queryFn: fetchAllCategories,
  });

  const formattedRows =
    data?.map((exam: any, index: number) => ({
      id: exam._id || index,
      name: exam.name,
      isActive: exam.isActive,
      createdAt: new Date(exam.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="categories">
      <div className="info">
        <h1>Categories</h1>
        <button onClick={() => setOpen(true)}>Add New Category</button>
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

      {open && <AddExamDialog setOpen={setOpen} />}
    </div>
  );
};

export default Categories;
