import { useState } from "react";
import "./add.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFaculty } from "../../api/services/facultyService";

interface Props {
  setOpen: (open: boolean) => void;
}

const AddFacultyDialog = ({ setOpen }: Props) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    experience: "",
    education: "",
    interviewAppeared: "",
    exams: "",
    courses: "",
    tests: "",
  });

  const mutation = useMutation({
    mutationFn: createFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] }); // ✅ refetch faculty list
      setOpen(false); // ✅ close the modal
    },
    onError: (error) => {
      console.error("Create faculty error:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      mobile: Number(formData.mobile),
      experience: Number(formData.experience),
      exams: [formData.exams],
      courses: [formData.courses],
      tests: [formData.tests],
    };
    mutation.mutate(payload); // 🔁 trigger mutation
  };

  return (
    <div className="add">
      <div className="modal">
        <h1>Add New Faculty</h1>
        <span className="close" onClick={() => setOpen(false)}>X</span>
        <form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <div className="item" key={key}>
              <label>{key}</label>
              <input
                type={key === "mobile" || key === "experience" ? "number" : "text"}
                name={key}
                value={value}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFacultyDialog;
