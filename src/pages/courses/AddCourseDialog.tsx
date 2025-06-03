import React, { useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "../../api/services/courseService";
import { fetchAllExams } from "../../api/services/examService";

const AddCourseDialog = ({ setOpen }: { setOpen: (val: boolean) => void }) => {
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

  // Fetch exams
  const { data: examOptions = [], isLoading: loadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchAllExams,
  });

  // Submit course (with image)
  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("price", String(formData.price));
      form.append("discount", String(formData.discount));
      form.append("duration", String(formData.duration));
      form.append("startDate", formData.startDate);
      form.append("endDate", formData.endDate);
      form.append("exams", JSON.stringify(formData.exams));

      if (thumbnail) {
        form.append("coverImage", thumbnail);
      }

      return createCourse(form); // call your exported API function here
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setOpen(false);
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
              options={examOptions || []}
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
                        {loadingExams ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </div>

          {/* Thumbnail Upload */}
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
    </div>
  );
};

export default AddCourseDialog;
