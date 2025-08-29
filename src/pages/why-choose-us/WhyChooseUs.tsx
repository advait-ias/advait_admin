import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchWhyChooseUs,
  createWhyChooseUs,
  updateWhyChooseUs,
} from "../../api/services/whyChooseUsService";
import { TextField, Button, Typography, Box } from "@mui/material";
import toast from "react-hot-toast";
import "./whyChooseUs.scss";

export default function WhyChooseUs() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existing, setExisting] = useState<any>(null);

  // Fetch existing
  const { data, isLoading } = useQuery({
    queryKey: ["whyChooseUs"],
    queryFn: fetchWhyChooseUs,
  });

  useEffect(() => {
    if (data) {
      setExisting(data);
      setTitle(data.title);
      setDescription(data.description);
    }
  }, [data]);

  // Create
  const { mutate: addWhyChooseUs } = useMutation({
    mutationFn: createWhyChooseUs,
    onSuccess: () => {
      toast.success("Created successfully!");
      queryClient.invalidateQueries({ queryKey: ["whyChooseUs"] });
      setTitle("");
      setDescription("");
      setImage(null);
    },
    onError: () => toast.error("Failed to create"),
  });

  // Update
  const { mutate: editWhyChooseUs } = useMutation({
    mutationFn: updateWhyChooseUs,
    onSuccess: () => {
      toast.success("Updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["whyChooseUs"] });
    },
    onError: () => toast.error("Failed to update"),
  });

  const handleSubmit = () => {
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    if (existing) {
      editWhyChooseUs(formData);
    } else {
      addWhyChooseUs(formData);
    }
  };

  return (
    <div className="why-choose-us-page">
      <Typography variant="h4" gutterBottom>
        Why Choose Us
      </Typography>

      <Box className="form-section">
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />

        {image && (
          <div className="preview">
            <img src={URL.createObjectURL(image)} alt="preview" />
          </div>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          {existing ? "Update" : "Create"}
        </Button>
      </Box>

      {/* View existing */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Current Entry
      </Typography>
      {isLoading ? (
        <p>Loading...</p>
      ) : existing ? (
        <Box className="existing-card">
          <Typography variant="h6">{existing.title}</Typography>
          <Typography>{existing.description}</Typography>
          {existing.image && <img src={existing.image} alt={existing.title} />}
        </Box>
      ) : (
        <p>No entry found</p>
      )}
    </div>
  );
}
