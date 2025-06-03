import React, { useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllCourses } from "../../api/services/courseService";
import { fetchAllExams } from "../../api/services/examService";
import { createFaculty } from "../../api/services/facultyService";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const fieldLabels: Record<string, string> = {
  name: "Name",
  email: "Email",
  mobile: "Mobile",
  gender: "Gender",
  experience: "Experience (years)",
  education: "Education",
  interviewAppeared: "Interview Appeared",
  exams: "Exams",
  courses: "Courses",
};

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
    exams: [] as string[],
    courses: [] as string[],
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);

  // Fetch course options
  const { data: courseOptions = [], isLoading: loadingCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchAllCourses,
  });

  // Fetch exam options
  const { data: examOptions = [], isLoading: loadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchAllExams,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("mobile", String(formData.mobile));
      form.append("gender", formData.gender);
      form.append("experience", String(formData.experience));
      form.append("education", formData.education);
      form.append("interviewAppeared", formData.interviewAppeared);
      form.append("exams", JSON.stringify(formData.exams));
      form.append("courses", JSON.stringify(formData.courses));

      if (profilePic) {
        form.append("profilePic", profilePic);
      }

      return createFaculty(form); // Your API function that expects FormData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Create faculty error:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profilePic" && files) {
      setProfilePic(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="add">
      <div className="modal">
        <h1>Add New Faculty</h1>
        <span className="close" onClick={() => setOpen(false)}>
          X
        </span>
        <form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => {
            if (key === "courses") {
              return (
                <div className="item" key={key}>
                  <label>{fieldLabels[key]}</label>
                  <Autocomplete
                    multiple
                    options={courseOptions}
                    getOptionLabel={(option: any) => option.title}
                    value={courseOptions.filter((c: any) =>
                      formData.courses.includes(c._id)
                    )}
                    onChange={(e, selected) => {
                      setFormData((prev) => ({
                        ...prev,
                        courses: selected.map((item) => item._id),
                      }));
                    }}
                    loading={loadingCourses}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select Courses"
                        placeholder="Courses"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingCourses ? (
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
              );
            }

            if (key === "exams") {
              return (
                <div className="item" key={key}>
                  <label>{fieldLabels[key]}</label>
                  <Autocomplete
                    multiple
                    options={examOptions}
                    getOptionLabel={(option: any) => option.name}
                    value={examOptions.filter((e: any) =>
                      formData.exams.includes(e._id)
                    )}
                    onChange={(e, selected) => {
                      setFormData((prev) => ({
                        ...prev,
                        exams: selected.map((item) => item._id),
                      }));
                    }}
                    loading={loadingExams}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select Exams"
                        placeholder="Exams"
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
              );
            }

            return (
              <div className="item" key={key}>
                <label>{fieldLabels[key] || key}</label>
                <input
                  type={
                    key === "mobile" || key === "experience" ? "number" : "text"
                  }
                  name={key}
                  value={value as string}
                  onChange={handleChange}
                />
              </div>
            );
          })}

          <div className="item">
            <label>Profile Picture</label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
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

export default AddFacultyDialog;
