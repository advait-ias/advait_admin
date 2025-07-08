import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLanguage } from "../../api/services/languageService";
import "./add.scss";

interface AddLanguageDialogProps {
  setOpen: (open: boolean) => void;
}

const AddLanguageDialog = ({ setOpen }: AddLanguageDialogProps) => {
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["languages"] });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to create exam:", error);
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
        <h1>Add New Language</h1>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Language Name</label>
            <input
              type="text"
              placeholder="Enter language name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Adding..." : "Add Language"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLanguageDialog;
