// src/components/addExamDialog/AddExamDialog.tsx

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExam } from "../../api/services/examService";
import "./add.scss";

interface AddExamDialogProps {
  setOpen: (open: boolean) => void;
}

const AddExamDialog = ({ setOpen }: AddExamDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to create exam:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, description });
    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>
          ❌
        </span>
        <h1>Add New Exam</h1>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Exam Name</label>
            <input
              type="text"
              placeholder="Enter exam name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Exam Description (optional)</label>
            <input
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Adding..." : "Add Exam"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExamDialog;
