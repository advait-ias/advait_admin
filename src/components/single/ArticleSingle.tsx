import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Chip, Button } from "@mui/material";
import { updateArticle } from "../../api/services/articleService";
import toast from "react-hot-toast";
import RichEditor from "../RichEditor/RichEditor";
import "./articleSingle.scss";

const ArticleSingle = ({ article }: any) => {
  const [editableData, setEditableData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (article) setEditableData(article);
  }, [article]);

  if (!editableData) {
    return (
      <div className="single">
        <h1>Loading...</h1>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    setEditableData((prev: any) => ({ ...prev, [key]: value }));
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateArticle(editableData._id, editableData);
      toast.success("Article updated successfully!");
      setIsEditing(false);
      navigate("/articles"); // Adjust this path as needed
    } catch (err) {
      toast.error("Failed to update article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="topInfo">
            <h1>Edit Article</h1>
            {editableData.image && <img src={editableData.image} alt="" />}
          </div>
          <div className="details">
            <div className="items">
              {["headline", "url", "subHeadline"].map((field) => (
                <div className="item" key={field}>
                  <span className="itemTitle">{field}</span>
                  <TextField
                    className="itemInput"
                    value={editableData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                </div>
              ))}

              <div className="item" key="content">
                <span className="itemTitle">Content</span>
                <RichEditor
                  content={editableData.content}
                  onChange={(html: string) => handleChange("content", html)}
                />
              </div>

              {/* {["category", "subCategory", "language"].map((field) => (
                <div className="item" key={field}>
                  <span className="itemTitle">{field}</span>
                  <TextField
                    className="itemInput"
                    value={editableData[field]?.name || ""}
                    onChange={(e) =>
                      handleChange(field, {
                        ...editableData[field],
                        name: e.target.value,
                      })
                    }
                  />
                </div>
              ))} */}
              {["category", "subCategory", "language"].map((field) => (
                <div className="item" key={field}>
                  <span className="itemTitle">{field}</span>
                  <TextField
                    className="itemInput"
                    value={editableData[field]?.name || ""}
                    disabled
                  />
                </div>
              ))}

              {/* <div className="item">
                <span className="itemTitle">Add Tag</span>
                <TextField
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTag.trim()) {
                      if (!editableData.tags.includes(newTag.trim())) {
                        handleChange("tags", [
                          ...editableData.tags,
                          newTag.trim(),
                        ]);
                        setNewTag("");
                      }
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    if (
                      newTag.trim() &&
                      !editableData.tags.includes(newTag.trim())
                    ) {
                      handleChange("tags", [
                        ...editableData.tags,
                        newTag.trim(),
                      ]);
                      setNewTag("");
                    }
                  }}
                >
                  Add
                </Button>
              </div> */}

              {/* <div className="item">
                <span className="itemTitle">Add Tag</span>
                <TextField value={newTag} className="itemInput" disabled />
                <Button variant="contained" disabled>
                  Add
                </Button>
              </div> */}

              <div className="item">
                <span className="itemTitle">Tags</span>
                <div className="tag-list">
                  {editableData.tags.map((tag: string, index: number) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() =>
                        handleChange(
                          "tags",
                          editableData.tags.filter((t: string) => t !== tag)
                        )
                      }
                      className="custom-chip"
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              className="saveButton"
              onClick={handleSave}
              disabled={!isEditing || loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSingle;
