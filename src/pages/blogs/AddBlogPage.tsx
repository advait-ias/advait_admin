import toast from "react-hot-toast";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { createBlog } from "../../api/services/blogService"; // replace with your actual paths
import { fetchAllTags } from "../../api/services/tagService";
import { useNavigate } from "react-router-dom";
import "./add.scss"; // updated stylesheet path
import RichEditor from "../../components/RichEditor/RichEditor";

const AddBlogPage = () => {
  const [formData, setFormData] = useState({
    headline: "",
    content: "",
    tags: [] as string[],
  });
  const [image, setImage] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: tagOptions = [], isLoading: loadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchAllTags,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("headline", formData.headline);
      form.append("content", formData.content);
      form.append("tags", JSON.stringify(formData.tags));
      if (image) form.append("image", image);
      return createBlog(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate("/blogs"); // redirect back to blog list
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        "Something went wrong. Please try again.";
      toast.error(message);
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
    <div className="add-blog-page">
      <button className="close-btn" onClick={() => navigate("/blogs")}>
        ×
      </button>
      <h1>Add New Blog</h1>
      <form onSubmit={handleSubmit}>
        {/* Headline */}
        <div className="item">
          <label>Blog Headline</label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            required
          />
        </div>

        {/* Tags */}
        <div className="item">
          <label>Blog Tags</label>
          <Autocomplete
            multiple
            options={tagOptions}
            loading={loadingTags}
            getOptionLabel={(option: any) => option.name}
            onChange={(e, value) =>
              setFormData((prev) => ({
                ...prev,
                tags: value.map((v: any) => v._id),
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Tags"
                placeholder="Tags"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingTags ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* Image Upload */}
        <div className="item">
          <label>Blog Image</label>
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

        {/* Markdown Content */}
        <div className="item">
          <label>Blog Content</label>
          <RichEditor
            content={formData.content}
            onChange={(html: any) =>
              setFormData((prev) => ({ ...prev, content: html }))
            }
          />
        </div>

        {/* <div className="item">
          <label>Blog Content</label>
          <div data-color-mode="light">
            <MDEditor
              value={formData.content}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, content: val || "" }))
              }
              height={1000}
            />
          </div>
        </div> */}

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddBlogPage;
