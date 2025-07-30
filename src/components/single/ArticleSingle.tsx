import axios from "axios";
import { useEffect, useState } from "react";
import "./articleSingle.scss";

const ArticleSingle = ({ article }: { article: any }) => {
  const [editableArticle, setEditableArticle] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `https://api.advaitias.co.in/article/${editableArticle._id}`,
        {
          category: editableArticle.category._id,
          subCategory: editableArticle.subCategory._id,
          language: editableArticle.language._id,
          headline: editableArticle.headline,
          url: editableArticle.url,
          subHeadline: editableArticle.subHeadline,
          content: editableArticle.content,
          tags: editableArticle.tags, // ensure it's an array of strings
        }
      );

      if (res.status === 200) {
        alert("Article updated successfully!");
      }
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update article");
    }
  };

  useEffect(() => {
    if (article) {
      setEditableArticle(article);
    }
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
          <button
            className="saveButton"
            onClick={handleUpdate}
            disabled={!editableArticle}
          >
            Update Article
          </button>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default ArticleSingle;
