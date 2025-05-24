// src/components/add/AddStudentDialog.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudent } from "../../api/services/studentService";
import "./add.scss";
import CloseIcon from "@mui/icons-material/Close";

interface AddStudentDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddStudentDialog = ({ open, onClose }: AddStudentDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    exams: "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...formData,
        mobile: parseInt(formData.mobile),
        exams: [formData.exams],
      };
      return createStudent(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onClose();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (!open) return null;

  return (
    <div className="add">
      <div className="modal">
        <h1>Add New Student</h1>
        <span className="close" onClick={onClose}>
          <CloseIcon />
        </span>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="item">
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="item">
            <label>Mobile</label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>
          <div className="item">
            <label>Gender</label>
            <input
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            />
          </div>
          <div className="item">
            <label>Exam ID</label>
            <input
              name="exams"
              value={formData.exams}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentDialog;
