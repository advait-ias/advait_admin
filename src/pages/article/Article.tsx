import UserSingle from "../../components/single/UserSingle";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getArticleById } from "../../api/services/articleService";
import "./article.scss";

const Article = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id as string),
    enabled: !!id, // don't run until id is available
  });

  if (isLoading) return <p>Loading article...</p>;
  if (isError) return <p>Something went wrong fetching the article.</p>;

  return (
    <div className="article">
      <UserSingle user={data?.data} />
    </div>
  );
};

export default Article;
