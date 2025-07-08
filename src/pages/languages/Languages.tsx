import AddLanguageDialog from "./AddLanguageDialog";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllLanguages } from "../../api/services/languageService";
import "./languages.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Language Name",
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

const Languages = () => {
  const [open, setOpen] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["language"],
    queryFn: fetchAllLanguages,
  });

  const formattedRows =
    data?.map((tag: any, index: number) => ({
      id: tag._id || index,
      name: tag.name,
      isActive: tag.isActive,
      createdAt: new Date(tag.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="languages">
      <div className="info">
        <h1>Languages</h1>
        <button onClick={() => setOpen(true)}>Add New Language</button>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="language"
          route="languages"
          columns={columns}
          rows={formattedRows}
        />
      )}

      {open && <AddLanguageDialog setOpen={setOpen} />}
    </div>
  );
};

export default Languages;
