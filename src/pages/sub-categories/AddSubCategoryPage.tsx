import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAllCategories } from "../../api/services/categoryService";
import { createSubCategory } from "../../api/services/subCategoryService";
import "./add.scss"; // updated stylesheet path

const AddSubCategoryPage = () => {
  const [formData, setFormData] = useState({
    category: "", // single category ID
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
      form.append("category", formData.category); // single string now
      form.append("name", formData.name);
      return createSubCategory(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-category"] });
      navigate("/sub-categories");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="add-sub-category-page">
      <button className="close-btn" onClick={() => navigate("/sub-categories")}>
        ×
      </button>
      <h1>Add New Sub Category</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        {/* Single Category Select */}
        <div className="item">
          <label>Category</label>
          <Autocomplete
            options={categoryOptions}
            loading={loadingCategory}
            getOptionLabel={(option: any) => option.name}
            value={
              categoryOptions.find(
                (opt: any) => opt._id === formData.category
              ) || null
            }
            onChange={(e, value) =>
              setFormData((prev) => ({
                ...prev,
                category: value?._id || "",
              }))
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
                      {loadingCategory ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* Sub Category Name */}
        <div className="item">
          <label>Sub Category Name</label>
          <input
            type="text"
            name="name"
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
