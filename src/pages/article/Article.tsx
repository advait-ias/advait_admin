import AddArticleDialog from "./AddArticleDialog";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllArticles } from "../../api/services/articleService";
import "./article.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "img",
    headerName: "Image",
    width: 75,
    renderCell: () => <img src={"/noavatar.png"} alt="" />,
  },
  { field: "headline", headerName: "Headline", width: 200 },
  { field: "subHeadline", headerName: "Sub Headline", width: 200 },
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
  const [open, setOpen] = useState(false);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchAllArticles,
  });

  const formattedRows =
    data?.map((article: any, index: number) => ({
      id: article._id || index,
      image: article.image,
      headline: article.headline,
      subHeadline: article.subHeadline,
      content: article.content,
      createdAt: new Date(article.createdAt).toLocaleDateString("en-GB"),
      isActive: article.isisActive,
    })) || [];

  return (
    <div className="articles">
      <div className="info">
        <h1>Articles</h1>
        <button onClick={() => setOpen(true)}>Add New Article</button>
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

      {open && <AddArticleDialog setOpen={setOpen} />}
    </div>
  );
};

export default Articles;
