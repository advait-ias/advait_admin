import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../api/services/categoryService";
import "./add.scss";

const AddCategoryPage = () => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/categories"); // go back after adding
    },
    onError: (err) => console.error("Error adding category:", err),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  return (
    <div className="add-category-page">
      <button className="close-btn" onClick={() => navigate("/categories")}>
        ❌
      </button>
      <h1>Add New Category</h1>
      <form onSubmit={handleSubmit}>
        <div className="item">
          <label>Category Name</label>
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryPage;
