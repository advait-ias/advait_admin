import AddExamDialog from "./AddTagialog";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllTags } from "../../api/services/tagService";
import "./tags.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "tag",
    headerName: "Tag Name",
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

const Tags = () => {
  const [open, setOpen] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["tag"],
    queryFn: fetchAllTags,
  });

  const formattedRows =
    data?.map((tag: any, index: number) => ({
      id: tag._id || index,
      name: tag.name,
      isActive: tag.isActive,
      createdAt: new Date(tag.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="tags">
      <div className="info">
        <h1>Tags</h1>
        <button onClick={() => setOpen(true)}>Add New Tag</button>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="tag"
          route="tags"
          columns={columns}
          rows={formattedRows}
        />
      )}

      {open && <AddExamDialog setOpen={setOpen} />}
    </div>
  );
};

export default Tags;
