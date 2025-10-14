import { useState, useEffect } from "react";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
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
    exams: [] as string[],
    faculty: [] as string[],
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: examOptions = [], isLoading: loadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchAllExams,
  });

  const { data: facultyOptions = [], isLoading: loadingFaculty } = useQuery({
    queryKey: ["faculty"],
    queryFn: fetchAllFaculty,
  });

  // Duration logic updates
  useEffect(() => {
    const durationNum = Number(formData.duration);

    // If duration = 0, clear start and end
    if (durationNum === 0) {
      setFormData((prev) => ({
        ...prev,
        startDate: "",
        endDate: "",
      }));
      return;
    }

    // If duration > 0 and startDate not set, default to today
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

    // If startDate exists, update endDate based on duration
    if (formData.startDate && durationNum > 0) {
      const end = new Date(formData.startDate);
      end.setDate(end.getDate() + durationNum);
      setFormData((prev) => ({
        ...prev,
        endDate: end.toISOString().split("T")[0],
      }));
    }
  }, [formData.duration]);

  // When startDate changes, update endDate if duration > 0
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

  // When endDate changes manually, recalc duration only if user really changed it
  useEffect(() => {
    // Don't recalc duration for lifetime courses or missing dates
    if (Number(formData.duration) === 0) return;
    if (!formData.startDate || !formData.endDate) return;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
    );

    // Only update if changed
    if (diff !== Number(formData.duration)) {
      setFormData((prev) => ({
        ...prev,
        duration: diff.toString(),
      }));
    }
  }, [formData.endDate]);

  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (["exams", "faculty", "includes"].includes(key)) {
          form.append(key, JSON.stringify(val));
        } else {
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIncludesChange = (item: string) => {
    setFormData((prev) => {
      const includes = prev.includes.includes(item)
        ? prev.includes.filter((i) => i !== item)
        : [...prev.includes, item];
      return { ...prev, includes };
    });
  };

  const handleThumbnail = (file: File) => {
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
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

          <div className="item">
            <label>Discount Start Date (Optional)</label>
            <input
              type="date"
              name="discountStartDate"
              value={formData.discountStartDate}
              onChange={handleChange}
            />
          </div>

          <div className="item">
            <label>Discount End Date (Optional)</label>
            <input
              type="date"
              name="discountEndDate"
              value={formData.discountEndDate}
              onChange={handleChange}
            />
          </div>
        </div>

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
            disabled={Number(formData.duration) === 0}
          />
        </div>

        <div className="item">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            disabled={Number(formData.duration) === 0}
          />
        </div>

        {/* Includes */}
        <div className="item">
          <label>Course Includes</label>
          <div className="checkbox-group">
            {[
              "Live Class",
              "Recorded Class",
              "Prelims Test Series",
              "Downloadable Resources",
            ].map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={formData.includes.includes(item)}
                    onChange={() => handleIncludesChange(item)}
                    sx={{ color: "white" }}
                  />
                }
                label={item}
              />
            ))}
          </div>
        </div>

        {/* Exams */}
        <div className="item">
          <label>Exams (Optional)</label>
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
              />
            )}
          />
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
