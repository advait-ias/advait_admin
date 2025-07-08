import AddArticleDialog from "./AddArticleDialog";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCourses } from "../../api/services/courseService";
import "./article.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "category",
    headerName: "Category Name",
    width: 150,
    type: "string",
  },
  {
    field: "subCategory",
    headerName: "Sub Category Name",
    width: 150,
    type: "string",
  },
  {
    field: "language",
    headerName: "Language",
    width: 150,
    type: "string",
  },
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
    field: "createdAt",
    headerName: "Created At",
    width: 150,
  },
  {
    field: "isActive",
    headerName: "Active",
    type: "boolean",
    width: 100,
  },
];

const Articles = () => {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["article"],
    queryFn: fetchAllCourses,
  });

  const rows =
    data?.map((article: any) => ({
      id: article._id,
      category: article.category,
      subCategory: article.subCategory,
      language: article.language,
      headline: article.headline,
      content: article.content,
      isActive: article.isActive,
      createdAt: new Date(article.createdAt).toLocaleDateString("en-GB"),
    })) || [];

  return (
    <div className="articles">
      <div className="info">
        <h1>Articles</h1>
        <button onClick={() => setOpen(true)}>Add New Article</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="error">Failed to fetch articles.</p>
      ) : rows.length === 0 ? (
        <p className="noData">No data available.</p>
      ) : (
        <DataTable
          slug="article"
          route="articles"
          columns={columns}
          rows={rows}
        />
      )}

      {open && <AddArticleDialog setOpen={setOpen} />}
    </div>
  );
};

export default Articles;
