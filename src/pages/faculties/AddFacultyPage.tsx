import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createFaculty } from "../../api/services/facultyService";
import {
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import toast from "react-hot-toast";
import "./add.scss";

export default function AddFacultyPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    gender: "",
    experience: 0,
    education: "",
    interviewAppeared: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("bio", formData.bio);
      form.append("gender", formData.gender);
      form.append("experience", formData.experience.toString());
      form.append("education", formData.education);
      form.append("interviewAppeared", formData.interviewAppeared);
      if (image) form.append("profilePic", image);
      return createFaculty(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      navigate("/faculties"); // redirect back to blog list
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        "Something went wrong. Please try again.";
      toast.error(message);
    },
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="add-faculty-page">
      <Typography variant="h4" gutterBottom>
        Add New Faculty
      </Typography>

      {/* Image Upload */}
      <div className="item">
        <InputLabel style={{ color: "white" }}>Image</InputLabel>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setImage(e.target.files[0]);
            }
          }}
        />
      </div>

      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        InputProps={{ style: { color: "white" } }}
        InputLabelProps={{ style: { color: "white" } }}
      />

      <TextField
        label="Bio"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={formData.bio}
        onChange={(e) => handleChange("bio", e.target.value)}
        InputProps={{ style: { color: "white" } }}
        InputLabelProps={{ style: { color: "white" } }}
      />

      <TextField
        label="Experience"
        fullWidth
        type="number"
        margin="normal"
        value={formData.experience}
        onChange={(e) => {
          const val = Math.max(0, parseInt(e.target.value));
          handleChange("experience", val);
        }}
        inputProps={{ min: 0 }}
        InputProps={{ style: { color: "white" } }}
        InputLabelProps={{ style: { color: "white" } }}
      />

      <TextField
        label="Education"
        fullWidth
        margin="normal"
        value={formData.education}
        onChange={(e) => handleChange("education", e.target.value)}
        InputProps={{ style: { color: "white" } }}
        InputLabelProps={{ style: { color: "white" } }}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel style={{ color: "white" }}>Gender</InputLabel>
        <Select
          value={formData.gender}
          label="Gender"
          onChange={(e) => handleChange("gender", e.target.value)}
          style={{ color: "white" }}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel style={{ color: "white" }}>Interview Appeared</InputLabel>
        <Select
          value={formData.interviewAppeared}
          label="Interview Appeared"
          onChange={(e) => handleChange("interviewAppeared", e.target.value)}
          style={{ color: "white" }}
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
          <MenuItem value="not-applicable">Not Applicable</MenuItem>
        </Select>
      </FormControl>

      <div className="button-actions">
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Submit Quiz
        </Button>
      </div>
    </div>
  );
}
