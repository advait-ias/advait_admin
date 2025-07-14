import AddExamDialog from "./AddSubCategoryDialog";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
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
    field: "subCategory",
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
  const [open, setOpen] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["sub-category"],
    queryFn: fetchAllSubCategories,
  });

  const formattedRows =
    data?.map((exam: any, index: number) => ({
      id: exam._id || index,
      category: exam.category,
      name: exam.name,
      isActive: exam.isActive,
      createdAt: new Date(exam.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="sub-categories">
      <div className="info">
        <h1>Sub Categories</h1>
        <button onClick={() => setOpen(true)}>Add New Sub Category</button>
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

      {open && <AddExamDialog setOpen={setOpen} />}
    </div>
  );
};

export default SubCategories;
