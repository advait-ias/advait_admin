import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAllExams } from "../../api/services/examService";
import { createCourse } from "../../api/services/courseService";
import "./add.scss";

const AddCoursePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    duration: "",
    startDate: "",
    endDate: "",
    exams: [] as string[],
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: examOptions = [], isLoading: loadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchAllExams,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "exams") {
          form.append("exams", JSON.stringify(val));
        } else {
          form.append(key, val as string);
        }
      });

      if (thumbnail) {
        form.append("coverImage", thumbnail);
      }

      return createCourse(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      navigate("/courses");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="add-course-page">
      <button className="close-btn" onClick={() => navigate("/courses")}>
        ×
      </button>
      <h1>Add New Course</h1>
      <form onSubmit={handleSubmit}>
        {[
          { name: "title", label: "Course Title" },
          { name: "description", label: "Description" },
          { name: "price", label: "Price", type: "number" },
          { name: "discount", label: "Discount", type: "number" },
          {
            name: "duration",
            label: "Duration (in Days) — 0 for Lifetime",
            type: "number",
          },
          { name: "startDate", label: "Start Date", type: "date" },
          { name: "endDate", label: "End Date", type: "date" },
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

        {/* Exams Multi-Select */}
        <div className="item">
          <label>Exams</label>
          <Autocomplete
            multiple
            options={examOptions}
            loading={loadingExams}
            getOptionLabel={(option: any) => option.name}
            onChange={(e, value) =>
              setFormData((prev) => ({
                ...prev,
                exams: value.map((v: any) => v._id),
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Exams"
                placeholder="Exams"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingExams && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* Course Thumbnail */}
        <div className="item">
          <label>Course Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setThumbnail(e.target.files[0]);
              }
            }}
          />
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddCoursePage;
