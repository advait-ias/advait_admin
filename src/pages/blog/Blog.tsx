import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "../../api/services/blogService";
import BlogSingle from "../../components/single/BlogSingle";
import "./blog.scss";

const Blog = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id as string),
    enabled: !!id, // don't run until id is available
  });

  if (isLoading) return <p>Loading blog...</p>;
  if (isError) return <p>Something went wrong fetching the blog.</p>;

  return (
    <div className="blog">
      <BlogSingle blog={data?.data} />
    </div>
  );
};

export default Blog;
