import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubCategory } from "../../api/services/subCategoryService";
import "./add.scss";

interface AddExamDialogProps {
  setOpen: (open: boolean) => void;
}

const AddExamDialog = ({ setOpen }: AddExamDialogProps) => {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-category"] });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to create exam:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ category, name });
    setName("");
    setCategory("");
    setOpen(false);
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>
          ❌
        </span>
        <h1>Add New Sub Category</h1>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Category</label>
            <input
              type="text"
              placeholder="Select category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter sub category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Adding..." : "Add Sub Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExamDialog;
