import { useState } from "react";
import "./add.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "../../api/services/courseService"; // ✅ import your service

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddCourseDialog = ({ setOpen }: Props) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    duration: "",
    startDate: "",
    endDate: "",
    faculties: "",
    exams: "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      createCourse({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        discount: Number(formData.discount),
        duration: Number(formData.duration),
        startDate: formData.startDate,
        endDate: formData.endDate,
        faculties: [formData.faculties],
        exams: [formData.exams],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setOpen(false);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>
          X
        </span>
        <h1>Add New Course</h1>
        <form onSubmit={handleSubmit}>
          {[
            { name: "title", label: "Course Title" },
            { name: "description", label: "Description" },
            { name: "price", label: "Price", type: "number" },
            { name: "discount", label: "Discount", type: "number" },
            { name: "duration", label: "Duration (months)", type: "number" },
            { name: "startDate", label: "Start Date", type: "date" },
            { name: "endDate", label: "End Date", type: "date" },
            { name: "faculties", label: "Faculty ID" },
            { name: "exams", label: "Exam ID" },
          ].map((input) => (
            <div className="item" key={input.name}>
              <label>{input.label}</label>
              <input
                type={input.type || "text"}
                name={input.name}
                value={formData[input.name as keyof typeof formData]}
                onChange={handleChange}
                required
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

export default AddCourseDialog;
