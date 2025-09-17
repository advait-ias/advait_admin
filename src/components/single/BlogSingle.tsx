import toast from "react-hot-toast";
import RichEditor from "../RichEditor/RichEditor";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Chip, Button } from "@mui/material";
import { updateBlog } from "../../api/services/blogService";
import "./blogSingle.scss";

const BlogSingle = ({ blog }: any) => {
  const [editableData, setEditableData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (blog) setEditableData(blog);
  }, [blog]);

  if (!editableData) {
    return (
      <div className="single">
        <h1>Loading...</h1>
      </div>
    );
  }

  // Add Tag
  const addTag = () => {
    if (
      newTag.trim() &&
      !editableData.tags.some((t: { name: string }) => t.name === newTag.trim())
    ) {
      handleChange("tags", [
        ...editableData.tags,
        { _id: Date.now().toString(), name: newTag.trim() }, // temporary id
      ]);
      setNewTag("");
    }
  };

  // Delete Tag
  const deleteTag = (tagName: string) => {
    handleChange(
      "tags",
      editableData.tags.filter((t: { name: string }) => t.name !== tagName)
    );
  };

  const handleChange = (key: string, value: any) => {
    setEditableData((prev: any) => ({ ...prev, [key]: value }));
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateBlog(editableData._id, editableData);
      toast.success("Blog updated successfully!");
      setIsEditing(false);
      navigate("/blogs"); // Adjust this path as needed
    } catch (err) {
      toast.error("Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="single">
      <div className="view">
        <div className="info">
          <div className="topInfo">
            <h1>Edit Blog</h1>
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

              <div className="item">
                <label>Blog Tags</label>
                <div className="tag-input-wrapper">
                  <TextField
                    label="Enter a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    variant="outlined"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button variant="contained" onClick={addTag}>
                    Add Tag
                  </Button>
                </div>

                <div className="tag-list">
                  {editableData.tags.map(
                    (tag: { _id: string; name: string }) => (
                      <Chip
                        key={tag._id}
                        label={tag.name}
                        className="custom-chip"
                        onDelete={() => deleteTag(tag.name)}
                      />
                    )
                  )}
                </div>
              </div>

              {["metaTitle", "metaDescription", "imageAlt"].map((field) => (
                <div className="item" key={field}>
                  <span className="itemTitle">{field}</span>
                  <TextField
                    className="itemInput"
                    value={editableData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                </div>
              ))}
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

export default BlogSingle;
