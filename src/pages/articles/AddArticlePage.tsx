import toast from "react-hot-toast";
import RichEditor from "../../components/RichEditor/RichEditor";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../../api/services/articleService";
import { fetchAllLanguages } from "../../api/services/languageService";
import { fetchAllCategories } from "../../api/services/categoryService";
import { fetchAllSubCategories } from "../../api/services/subCategoryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  TextField,
} from "@mui/material";
import "./add.scss";

const AddArticlePage = () => {
  const [formData, setFormData] = useState({
    category: null as any,
    subCategory: null as any,
    language: null as any,
    metaTitle: "",
    headline: "",
    metaDescription: "",
    url: "",
    subHeadline: "",
    content: "",
    imageAlt: "",
    tags: [] as any[],
    markAsNew: false,
  });
  const [newTag, setNewTag] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const queryClient = useQueryClient();
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

  // Mutation
  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();

      form.append("category", formData.category?._id);
      form.append("subCategory", formData.subCategory?._id);
      form.append("language", formData.language?._id);
      form.append("metaTitle", formData.metaTitle);
      form.append("metaDescription", formData.metaDescription);
      form.append("headline", formData.headline);
      form.append("url", formData.url);
      form.append("subHeadline", formData.subHeadline);
      form.append("content", formData.content);
      form.append("imageAlt", formData.imageAlt);
      form.append(
        "tags",
        JSON.stringify(
          formData.tags.map((tag: any) =>
            typeof tag === "string" ? tag : tag.name
          )
        )
      );

      form.append("markAsNew", formData.markAsNew.toString());

      if (image) form.append("image", image);

      return createArticle(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/articles");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        "Something went wrong. Please try again.";
      toast.error(message);
    },
  });

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
      setNewTag("");
    }
  };

  const formatURL = (str: string) =>
    str.trim().toLowerCase().replace(/\s+/g, "-"); // or remove spaces: .replace(/\s+/g, "")

  return (
    <div className="add-article-page">
      <button className="close-btn" onClick={() => navigate("/articles")}>
        ×
      </button>
      <h1>Add New Article</h1>
      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div className="item">
          <label>Article Category*</label>
          <Autocomplete
            options={categoryOptions}
            getOptionLabel={(opt: any) => opt.name}
            loading={loadingCategory}
            onChange={(e, val) =>
              setFormData((prev) => ({ ...prev, category: val }))
            }
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
                      {loadingCategory && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* SubCategory */}
        <div className="item">
          <label>Article Sub Category*</label>
          <Autocomplete
            options={subCategoryOptions}
            getOptionLabel={(opt: any) => opt.name}
            loading={loadingSubCategory}
            onChange={(e, val) =>
              setFormData((prev) => ({ ...prev, subCategory: val }))
            }
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
                      {loadingSubCategory && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* Headline and SubHeadline */}
        {[
          { name: "metaTitle", label: "Meta Title" },
          { name: "metaDescription", label: "Meta Description" },
          { name: "headline", label: "Article Headline*" },
          { name: "subHeadline", label: "Subheadline (Optional)" },
        ].map((field) => (
          <div className="item" key={field.name}>
            <label>{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              required={field.name !== "subHeadline"}
            />
          </div>
        ))}

        {/* URL Slug (Auto-filled from headline, but editable) */}
        <div className="item">
          <label>URL Slug* (Article URL) </label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={(e) => {
              const noSpaces = e.target.value.replace(/\s/g, ""); // Remove spaces
              setFormData((prev) => ({ ...prev, url: noSpaces }));
            }}
            onFocus={() => {
              // If user hasn’t edited URL, auto-fill from headline
              if (
                !formData.url ||
                formData.url === formatURL(formData.headline)
              ) {
                setFormData((prev) => ({
                  ...prev,
                  url: formatURL(prev.headline),
                }));
              }
            }}
            required
          />
        </div>

        {/* Language */}
        <div className="item">
          <label>Article Language*</label>
          <Autocomplete
            options={languageOptions}
            getOptionLabel={(opt: any) => opt.name}
            loading={loadingLanguage}
            onChange={(e, val) =>
              setFormData((prev) => ({ ...prev, language: val }))
            }
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
                      {loadingLanguage && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* Tags */}
        <div className="item">
          <label>Article Tags</label>

          <div className="tag-input-wrapper">
            <TextField
              label="Enter a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              variant="outlined"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission
                  handleAddTag();
                }
              }}
            />

            <Button variant="contained" onClick={handleAddTag}>
              Add Tag
            </Button>
          </div>

          {/* Show Added Tags */}
          <div className="tag-list">
            {formData.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                className="custom-chip"
                onDelete={() =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, newTag.trim()],
                  }))
                }
              />
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="item">
          <label>Article Image*</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImage(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Image Alt */}
        <div className="item">
          <label>Image Alt</label>
          <input
            type="text"
            name="imageAlt"
            value={formData.imageAlt}
            onChange={handleChange}
          />
        </div>

        {/* Mark as New */}
        <div className="item-checkbox">
          <label>Mark as New</label>
          <input
            type="checkbox"
            name="markAsNew"
            checked={formData.markAsNew}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, markAsNew: e.target.checked }))
            }
          />
        </div>

        {/* Content */}
        <div className="item content-editor">
          <label>Article Content*</label>
          <div className="editor-body">
            <RichEditor
              content={formData.content}
              onChange={(html: string) =>
                setFormData((prev: any) => ({ ...prev, content: html }))
              }
            />
          </div>
        </div>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddArticlePage;
