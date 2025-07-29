import axios from "axios";
import { useEffect, useState } from "react";
import "./blogSingle.scss";

const BlogSingle = ({ blog }: { blog: any }) => {
  const [blogData, setBlogData] = useState<any>(null);

  useEffect(() => {
    setBlogData(blog);
  }, [blog]);

  if (!blogData) return <div className="single">Loading blog...</div>;

  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="topInfo">
            <h1>{blogData.headline}</h1>
            {blogData.image && (
              <img
                src={blogData.image}
                alt={blogData.headline}
                className="blog-image"
              />
            )}
          </div>

          <div className="details">
            <div className="items">
              <div className="item">
                <span className="itemTitle">URL Slug</span>
                <p className="itemValue">{blogData.url}</p>
              </div>

              <div className="item">
                <span className="itemTitle">Tags</span>
                <div className="tag-list">
                  {blogData.tags.map((tag: any, idx: number) => (
                    <span className="tag-chip" key={idx}>
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="item">
                <span className="itemTitle">Created</span>
                <p className="itemValue">
                  {new Date(blogData.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="item">
                <span className="itemTitle">Content</span>
                <div
                  className="itemContent"
                  dangerouslySetInnerHTML={{ __html: blogData.content }}
                />
              </div>
            </div>
          </div>

          <hr />
        </div>
        <hr />
      </div>
    </div>
  );
};

export default BlogSingle;
