import axios from "axios";
import { useEffect, useState } from "react";
import "./articleSingle.scss";

const ArticleSingle = ({ article }: { article: any }) => {
  const [editableArticle, setEditableArticle] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditableArticle(article);
  }, [article]);

  if (!editableArticle) {
    return <div className="single">Loading article...</div>;
  }

  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="topInfo">
            <h1>{editableArticle.headline}</h1>
            {editableArticle.image && (
              <img
                src={editableArticle.image}
                alt={editableArticle.headline}
                className="article-image"
              />
            )}
          </div>

          <div className="details">
            <div className="items">
              <div className="item">
                <span className="itemTitle">Sub-headline</span>
                <p className="itemValue">
                  {editableArticle.subHeadline || "—"}
                </p>
              </div>

              <div className="item">
                <span className="itemTitle">Category</span>
                <p className="itemValue">{editableArticle.category?.name}</p>
              </div>

              <div className="item">
                <span className="itemTitle">SubCategory</span>
                <p className="itemValue">{editableArticle.subCategory?.name}</p>
              </div>

              <div className="item">
                <span className="itemTitle">Language</span>
                <p className="itemValue">{editableArticle.language?.name}</p>
              </div>

              <div className="item">
                <span className="itemTitle">Tags</span>
                <div className="tag-list">
                  {editableArticle.tags.map((tag: string, idx: number) => (
                    <span className="tag-chip" key={idx}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="item">
                <span className="itemTitle">Published</span>
                <p className="itemValue">
                  {new Date(editableArticle.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="item">
                <span className="itemTitle">Content</span>
                <div
                  className="itemContent"
                  dangerouslySetInnerHTML={{ __html: editableArticle.content }}
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

export default ArticleSingle;
