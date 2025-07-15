import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAllCategories } from "../../api/services/categoryService";
import { createSubCategory } from "../../api/services/subCategoryService";
import "./add.scss"; // updated stylesheet path

const AddSubCategoryPage = () => {
  const [formData, setFormData] = useState({
    category: [] as string[],
    name: "",
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: categoryOptions = [], isLoading: loadingCategory } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("category", JSON.stringify(formData.category));
      form.append("name", formData.name);
      return createSubCategory(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-category"] });
      navigate("/sub-categories"); // redirect back to blog list
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
    <div className="add-sub-category-page">
      <button className="close-btn" onClick={() => navigate("/sub-categories")}>
        ×
      </button>
      <h1>Add New Sub Category</h1>
      <form onSubmit={handleSubmit}>
        {/* Tags */}
        <div className="item">
          <label>Categories</label>
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
                      {loadingCategory ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* Headline */}
        <div className="item">
          <label>Sub Category Name</label>
          <input
            type="text"
            name="headline"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddSubCategoryPage;
