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
    category: [] as string[],
    subCategory: [] as string[],
    language: [] as string[],
    headline: "",
    subHeadline: "",
    content: "",
    tags: [] as string[],
  });
  const [image, setImage] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();

      Object.entries(formData).forEach(([key, val]) => {
        if (
          key === "tags" ||
          key === "category" ||
          key === "subCategory" ||
          key === "language"
        ) {
          form.append(key, JSON.stringify(val)); // Convert array to JSON string
        } else {
          form.append(key, val as string); // Explicitly cast to string
        }
      });

      if (image) form.append("image", image);

      return createArticle(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/articles");
    },
  });

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
        <div className="item">
          <label>Article Category</label>
          <Autocomplete
            multiple
            options={categoryOptions}
            loading={loadingCategory}
            getOptionLabel={(option: any) => option.name}
            onChange={(e, value) =>
              setFormData((prev) => ({
                ...prev,
                tags: value.map((v: any) => v._id),
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Categories"
                placeholder="Categories"
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

        <div className="item">
          <label>Article Sub Category</label>
          <Autocomplete
            multiple
            options={subCategoryOptions}
            loading={loadingSubCategory}
            getOptionLabel={(option: any) => option.name}
            onChange={(e, value) =>
              setFormData((prev) => ({
                ...prev,
                tags: value.map((v: any) => v._id),
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Sub Categories"
                placeholder="Sub Categories"
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

        <div className="item">
          <label>Article Language</label>
          <Autocomplete
            multiple
            options={languageOptions}
            loading={loadingLanguage}
            getOptionLabel={(option: any) => option.name}
            onChange={(e, value) =>
              setFormData((prev) => ({
                ...prev,
                tags: value.map((v: any) => v._id),
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Languages"
                placeholder="Languages"
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

        <div className="item">
          <label>Article Tags</label>
          <Autocomplete
            multiple
            options={tagOptions}
            loading={loadingTags}
            getOptionLabel={(option: any) => option.name}
            onChange={(e, value) =>
              setFormData((prev) => ({
                ...prev,
                tags: value.map((v: any) => v._id),
              }))
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

        <div className="item">
          <label>Article Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
          />
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddArticlePage;
