import toast from "react-hot-toast";
import RichEditor from "../../components/RichEditor/RichEditor";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAllTags } from "../../api/services/tagService";
import { createArticle } from "../../api/services/articleService";
import { fetchAllLanguages } from "../../api/services/languageService";
import { fetchAllCategories } from "../../api/services/categoryService";
import { fetchAllSubCategories } from "../../api/services/subCategoryService";
import "./add.scss";

const AddArticlePage = () => {
  const [formData, setFormData] = useState({
    category: null as any,
    subCategory: null as any,
    language: null as any,
    headline: "",
    subHeadline: "",
    content: "",
    tags: [] as any[],
  });
  const [errorMessage, setErrorMessage] = useState("");
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
  const { data: tagOptions = [], isLoading: loadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchAllTags,
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
      form.append("headline", formData.headline);
      form.append("subHeadline", formData.subHeadline);
      form.append("content", formData.content);
      form.append("tags", JSON.stringify(formData.tags.map((tag) => tag._id)));

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

  return (
    <div className="add-article-page">
      <button className="close-btn" onClick={() => navigate("/articles")}>
        ×
      </button>
      <h1>Add New Article</h1>
      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div className="item">
          <label>Article Category</label>
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
          <label>Article Sub Category</label>
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
          { name: "headline", label: "Article Headline" },
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

        {/* Language */}
        <div className="item">
          <label>Article Language</label>
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
          <Autocomplete
            multiple
            options={tagOptions}
            getOptionLabel={(opt: any) => opt.name}
            loading={loadingTags}
            onChange={(e, val) =>
              setFormData((prev) => ({ ...prev, tags: val }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Tags"
                placeholder="Tags"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingTags && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* Image Upload */}
        <div className="item">
          <label>Article Image</label>
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

        {/* Content */}
        <div className="item">
          <label>Article Content</label>
          <div data-color-mode="light">
            <RichEditor
                        content={formData.content}
                        onChange={(html: any) =>
                          setFormData((prev) => ({ ...prev, content: html }))
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
