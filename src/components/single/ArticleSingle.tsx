import toast from "react-hot-toast";
import RichEditor from "../RichEditor/RichEditor";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateArticle } from "../../api/services/articleService";
import { fetchAllCategories } from "../../api/services/categoryService";
import { fetchAllSubCategories } from "../../api/services/subCategoryService";
import { fetchAllLanguages } from "../../api/services/languageService";
import { useQuery } from "@tanstack/react-query";
import {
  TextField,
  Chip,
  Button,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import "./articleSingle.scss";

const ArticleSingle = ({ article }: any) => {
  const [editableData, setEditableData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();

  // Queries
  const { data: categoryOptions = [], isLoading: loadingCategory } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });
  const { data: subCategoryOptions = [], isLoading: loadingSubCategory } =
    useQuery({
      queryKey: ["sub-category"],
      queryFn: fetchAllSubCategories,
    });
  const { data: languageOptions = [], isLoading: loadingLanguage } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchAllLanguages,
  });

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

              {/* Category */}
              <div className="item">
                <label>Article Category</label>
                <div className="itemInput">
                  <Autocomplete
                    fullWidth
                    options={categoryOptions}
                    getOptionLabel={(opt: any) => opt.name}
                    loading={loadingCategory}
                    value={editableData.category || null}
                    onChange={(e, val) => handleChange("category", val)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Category"
                        placeholder="Category"
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingCategory && (
                                <CircularProgress size={20} />
                              )}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              {/* SubCategory */}
              <div className="item">
                <label>Article Sub Category</label>
                <div className="itemInput">
                  <Autocomplete
                    fullWidth
                    options={subCategoryOptions}
                    getOptionLabel={(opt: any) => opt.name}
                    loading={loadingSubCategory}
                    value={editableData.subCategory || null}
                    onChange={(e, val) => handleChange("subCategory", val)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Sub Category"
                        placeholder="Sub Category"
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingSubCategory && (
                                <CircularProgress size={20} />
                              )}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Language */}
              <div className="item">
                <label>Article Language</label>
                <div className="itemInput">
                  <Autocomplete
                    fullWidth
                    options={languageOptions}
                    getOptionLabel={(opt: any) => opt.name}
                    loading={loadingLanguage}
                    value={editableData.language || null}
                    onChange={(e, val) => handleChange("language", val)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Language"
                        placeholder="Language"
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingLanguage && (
                                <CircularProgress size={20} />
                              )}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="item">
                <label>Article Tags</label>
                <div className="tag-input-wrapper">
                  <TextField
                    label="Enter a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    variant="outlined"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTag.trim()) {
                        e.preventDefault();
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
                    Add Tag
                  </Button>
                </div>

                <div className="tag-list">
                  {editableData.tags.map((tag: string, index: number) => (
                    <Chip
                      key={index}
                      label={tag}
                      className="custom-chip"
                      onDelete={() =>
                        handleChange(
                          "tags",
                          editableData.tags.filter((t: string) => t !== tag)
                        )
                      }
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
