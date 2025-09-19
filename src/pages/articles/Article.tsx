import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GridColDef } from "@mui/x-data-grid";
import { fetchAllArticles } from "../../api/services/articleService";
import "./article.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 220 },
  { field: "category", headerName: "Category Name", width: 140 },
  { field: "subCategory", headerName: "Sub Category", width: 100 },
  { field: "headline", headerName: "Headline", width: 200 },
  { field: "url", headerName: "Url", width: 200 },
  { field: "createdAt", headerName: "Created At", width: 100 },
  { field: "isActive", headerName: "Active", type: "boolean", width: 100 },
];

const Articles = () => {
  const [page, setPage] = useState(0); // MUI is 0-based, backend also 0-based now
  const [pageSize, setPageSize] = useState(10);

  const { isLoading, data } = useQuery({
    queryKey: ["articles", page, pageSize],
    queryFn: () => fetchAllArticles(page, pageSize),
    placeholderData: keepPreviousData, // 👈 replaces keepPreviousData
  });

  const formattedRows =
    data?.data?.map((article: any) => ({
      id: article._id, // ✅ use only MongoDB _id (unique across pages)
      category: article.category?.name,
      subCategory: article.subCategory?.name,
      headline: article.headline,
      url: article.url,
      createdAt: new Date(article.createdAt).toLocaleDateString("en-GB"),
      isActive: article.isActive,
    })) || [];

  return (
    <div className="articles">
      <div className="info">
        <h1>Articles</h1>
        <Link to="/articles/add">
          <button>Add New Article</button>
        </Link>
      </div>

      <DataTable
        slug="article"
        route="articles"
        columns={columns}
        rows={formattedRows}
        rowCount={data?.pagination?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={isLoading}
      />
    </div>
  );
};

export default Articles;
