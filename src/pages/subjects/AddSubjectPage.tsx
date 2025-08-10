import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createSubject } from "../../api/services/subjectService";
import "./add.scss";

const AddSubjectsPage = () => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      navigate("/subjects"); // go back after adding
    },
    onError: (err) => console.error("Error adding category:", err),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  return (
    <div className="add-category-page">
      <button className="close-btn" onClick={() => navigate("/subjects")}>
        ❌
      </button>
      <h1>Add New Subject</h1>
      <form onSubmit={handleSubmit}>
        <div className="item">
          <label>Subject Name</label>
          <input
            type="text"
            placeholder="Enter subject name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding..." : "Add Subject"}
        </button>
      </form>
    </div>
  );
};

export default AddSubjectsPage;
