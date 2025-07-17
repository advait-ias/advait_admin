import DataTable from "../../components/dataTable/DataTable";
import { Link } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllArticles } from "../../api/services/articleService";
import "./article.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "category",
    headerName: "Category Name",
    width: 150,
  },
  { field: "subCategory", headerName: "Sub Category", width: 150 },
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

const Articles = () => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchAllArticles,
  });

  const formattedRows =
    data?.map((article: any, index: number) => ({
      id: article._id || index,
      category: article.category.name,
      subCategory: article.subCategory.name,
      headline: article.headline,
      content: article.content,
      createdAt: new Date(article.createdAt).toLocaleDateString("en-GB"),
      isActive: article.isisActive,
    })) || [];

  return (
    <div className="articles">
      <div className="info">
        <h1>Articles</h1>
        <Link to="/articles/add">
          <button>Add New Article</button>
        </Link>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="article"
          route="articles"
          columns={columns}
          rows={formattedRows}
        />
      )}
    </div>
  );
};

export default Articles;
