// src/components/addTagDialog/AddTagDialog.tsx

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTag } from "../../api/services/tagService";
import "./add.scss";

interface AddTagDialogProps {
  setOpen: (open: boolean) => void;
}

const AddTagDialog = ({ setOpen }: AddTagDialogProps) => {
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to create tag:", error);
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
        <h1>Add New Tag</h1>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Tag Name</label>
            <input
              type="text"
              placeholder="Enter exam name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Adding..." : "Add Tag"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTagDialog;
