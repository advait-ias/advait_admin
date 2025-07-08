import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../../api/services/categoryService";
import "./add.scss";

interface AddCategoryDialogProps {
  setOpen: (open: boolean) => void;
}

const AddCategoryDialog = ({ setOpen }: AddCategoryDialogProps) => {
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name });
    setName("");
    setOpen(false);
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>
          ❌
        </span>
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
    </div>
  );
};

export default AddCategoryDialog;
