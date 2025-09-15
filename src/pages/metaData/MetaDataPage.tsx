import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMetaData,
  createMetaData,
  updateMetaData,
} from "../../api/services/metaDataService";
import toast from "react-hot-toast";
import "./metaData.scss";

export default function MetaData() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["metaData"],
    queryFn: fetchMetaData,
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        description: data.description || "",
      });
    }
  }, [data]);

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => createMetaData(fd),
    onSuccess: () => {
      toast.success("Meta Data created");
      queryClient.invalidateQueries({ queryKey: ["metaData"] });
      setImage(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Create failed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, fd }: { id: string; fd: FormData }) =>
      updateMetaData(id, fd),
    onSuccess: () => {
      toast.success("Meta Data updated");
      queryClient.invalidateQueries({ queryKey: ["metaData"] });
      setImage(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Update failed");
    },
  });

  const handleChange = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (image) fd.append("image", image);

    if (data && data._id) {
      updateMutation.mutate({ id: data._id, fd });
    } else {
      createMutation.mutate(fd);
    }
  };

  return (
    <div className="meta-data-page">
      <Typography variant="h4" className="title">
        Meta Data
      </Typography>

      {isLoading ? (
        <div className="loading">
          <CircularProgress />
        </div>
      ) : isError ? (
        <p>Error loading Meta Data</p>
      ) : (
        <div className="form-wrapper">
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
          />

          {/* Image upload */}
          <div className="image-field">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
            />
            {image && (
              <div className="preview">
                <img src={URL.createObjectURL(image)} alt="preview" />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setImage(null)}
                >
                  Remove
                </Button>
              </div>
            )}
            {!image && data?.image && (
              <div className="preview">
                <img src={data.image} alt="current" />
              </div>
            )}
          </div>

          <div className="actions">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              //   disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {data && data._id ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
