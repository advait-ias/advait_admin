import { useState, useEffect } from "react";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchAllExams } from "../../api/services/examService";
import { fetchAllFaculty } from "../../api/services/facultyService";
import { createCourse } from "../../api/services/courseService";
import "./add.scss";

const AddCoursePage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    discountType: "flat",
    discountStartDate: "",
    discountEndDate: "",
    discountDuration: "",
    duration: "",
    startDate: "",
    endDate: "",
    includes: [] as string[],
    newInclude: "",
    exams: [] as string[],
    faculty: [] as string[],
    courseType: "paid", // new field
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Queries
  const { data: examOptions = [], isLoading: loadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchAllExams,
  });

  const { data: facultyOptions = [], isLoading: loadingFaculty } = useQuery({
    queryKey: ["faculty"],
    queryFn: fetchAllFaculty,
  });

  // 🕒 Duration logic updates
  useEffect(() => {
    const durationNum = Number(formData.duration);

    // Lifetime Course (0 Days)
    if (durationNum === 0) {
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        startDate: prev.startDate || today, // default today if empty
        endDate: "", // clear and disable
      }));
      return;
    }

    // If duration > 0 and startDate not set, set to today
    if (durationNum > 0 && !formData.startDate) {
      const start = new Date();
      const end = new Date(start);
      end.setDate(start.getDate() + durationNum);

      setFormData((prev) => ({
        ...prev,
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      }));
    }

    // Update end date when duration changes
    if (formData.startDate && durationNum > 0) {
      const end = new Date(formData.startDate);
      end.setDate(end.getDate() + durationNum);
      setFormData((prev) => ({
        ...prev,
        endDate: end.toISOString().split("T")[0],
      }));
    }
  }, [formData.duration]);

  useEffect(() => {
    if (formData.startDate && Number(formData.duration) > 0) {
      const end = new Date(formData.startDate);
      end.setDate(end.getDate() + Number(formData.duration));
      setFormData((prev) => ({
        ...prev,
        endDate: end.toISOString().split("T")[0],
      }));
    }
  }, [formData.startDate]);

  useEffect(() => {
    if (Number(formData.duration) === 0) return;
    if (!formData.startDate || !formData.endDate) return;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
    );

    if (diff !== Number(formData.duration)) {
      setFormData((prev) => ({ ...prev, duration: diff.toString() }));
    }
  }, [formData.endDate]);

  // Mutation
  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (["exams", "faculty", "includes"].includes(key)) {
          form.append(key, JSON.stringify(val));
        } else if (key !== "newInclude") {
          form.append(key, val as string);
        }
      });
      if (thumbnail) form.append("coverImage", thumbnail);
      return createCourse(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      navigate("/courses");
    },
  });

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnail = (file: File) => {
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAddInclude = () => {
    if (!formData.newInclude.trim()) return;
    setFormData((prev) => ({
      ...prev,
      includes: [...prev.includes, prev.newInclude.trim()],
      newInclude: "",
    }));
  };

  const handleRemoveInclude = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const discountSuffix = formData.discountType === "flat" ? "₹" : "%";

  return (
    <div className="add-course-page">
      <button className="close-btn" onClick={() => navigate("/courses")}>
        ×
      </button>
      <h1>Add New Course</h1>

      <form onSubmit={handleSubmit}>
        {/* Exams (Required and Moved to Top) */}
        <div className="item required">
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
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingExams && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                // ✅ Custom visual error when exams not selected
                error={mutation.isError && formData.exams.length === 0}
                helperText={
                  formData.exams.length === 0
                    ? "Please select at least one exam"
                    : ""
                }
              />
            )}
          />
        </div>

        {/* Course Type */}
        <div className="item required">
          <label>Course Type</label>
          <select
            name="courseType"
            value={formData.courseType}
            onChange={handleChange}
          >
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>
        </div>

        {/* Required Fields */}
        <div className="item required">
          <label>Course Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="item required">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Show price/discount only for paid courses */}
        {formData.courseType === "paid" && (
          <>
            <div className="item required">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Discount Section */}
            <div className="discount-section">
              <h3>Discount (Optional)</h3>
              <div className="item">
                <label>Discount Type</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                >
                  <option value="flat">Flat</option>
                  <option value="percent">Percent</option>
                </select>
              </div>

              <div className="item">
                <label>Discount {discountSuffix}</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder={`Enter value in ${discountSuffix}`}
                />
              </div>
            </div>
          </>
        )}

        {/* Duration */}
        <div className="item required">
          <label>Course Duration (Days, 0 for Lifetime)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="item">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="item">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            disabled={Number(formData.duration) === 0} // ✅ Only End Date disabled
          />
        </div>

        {/* Course Includes (Dynamic) */}
        <div className="item">
          <label>Course Includes</label>
          <div className="includes-input">
            <input
              type="text"
              placeholder="Add inclusion (e.g. Live Class)"
              name="newInclude"
              value={formData.newInclude}
              onChange={handleChange}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddInclude())
              }
            />
            <IconButton color="success" onClick={handleAddInclude}>
              <AddCircle />
            </IconButton>
          </div>
          <ul className="includes-list">
            {formData.includes.map((item, index) => (
              <li key={index}>
                {item}
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleRemoveInclude(index)}
                >
                  <RemoveCircle />
                </IconButton>
              </li>
            ))}
          </ul>
        </div>

        {/* Faculty */}
        <div className="item">
          <label>Faculty (Optional)</label>
          <Autocomplete
            multiple
            options={facultyOptions}
            loading={loadingFaculty}
            getOptionLabel={(option: any) => option.name}
            onChange={(e, value) =>
              setFormData((prev) => ({
                ...prev,
                faculty: value.map((v: any) => v._id),
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Faculties"
                placeholder="Faculties"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingFaculty && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* Thumbnail */}
        <div className="item required">
          <label>Course Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) handleThumbnail(e.target.files[0]);
            }}
            required
          />
          {preview && (
            <img src={preview} alt="Preview" className="thumbnail-preview" />
          )}
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddCoursePage;
