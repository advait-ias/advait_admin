import toast from "react-hot-toast";
import RichEditor from "../../components/RichEditor/RichEditor";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { createBlog } from "../../api/services/blogService"; // replace with your actual paths
import { fetchAllTags } from "../../api/services/tagService";
import { useNavigate } from "react-router-dom";
import "./add.scss"; // updated stylesheet path

const AddBlogPage = () => {
  const [formData, setFormData] = useState({
    headline: "",
    url: "",
    content: "",
    imageAlt: "",
    tags: [] as string[],
    markAsNew: false,
  });
  const [useRichEditor, setUseRichEditor] = useState(true);
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
      form.append("url", formData.url);
      form.append("content", formData.content);
      form.append("imageAlt", formData.imageAlt);
      form.append("tags", JSON.stringify(formData.tags));
      form.append("markAsNew", formData.markAsNew.toString());
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

  const formatURL = (str: string) =>
    str.trim().toLowerCase().replace(/\s+/g, "-"); // or remove spaces: .replace(/\s+/g, "")

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

        {/* URL Slug (Auto-filled from headline, but editable) */}
        <div className="item">
          <label>URL Slug (Blog URL) </label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={(e) => {
              const noSpaces = e.target.value.replace(/\s/g, ""); // Remove spaces
              setFormData((prev) => ({ ...prev, url: noSpaces }));
            }}
            onFocus={() => {
              // If user hasn’t edited URL, auto-fill from headline
              if (
                !formData.url ||
                formData.url === formatURL(formData.headline)
              ) {
                setFormData((prev) => ({
                  ...prev,
                  url: formatURL(prev.headline),
                }));
              }
            }}
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
        {/* Image Alt */}
        <div className="item">
          <label>Image Alt</label>
          <input
            type="text"
            name="imageAlt"
            value={formData.imageAlt}
            onChange={handleChange}
          />
        </div>
        {/* Markdown Content */}
        <div className="item blog-editor">
          <div className="editor-toggle">
            <label className={`toggle-label ${useRichEditor ? "active" : ""}`}>
              <input
                type="radio"
                name="blogEditorMode"
                checked={useRichEditor}
                onChange={() => setUseRichEditor(true)}
              />
              Rich Editor
            </label>
            <label className={`toggle-label ${!useRichEditor ? "active" : ""}`}>
              <input
                type="radio"
                name="blogEditorMode"
                checked={!useRichEditor}
                onChange={() => setUseRichEditor(false)}
              />
              Textarea
            </label>
          </div>

          <label>Blog Content</label>
          <div className="editor-body">
            {useRichEditor ? (
              <RichEditor
                content={formData.content}
                onChange={(html: string) =>
                  setFormData((prev: any) => ({ ...prev, content: html }))
                }
              />
            ) : (
              <textarea
                name="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                rows={20}
                className="plain-textarea"
              />
            )}
          </div>
        </div>
        {/* Mark as New */}
        <div className="item">
          <label>Mark as New</label>
          <input
            type="checkbox"
            name="markAsNew"
            checked={formData.markAsNew}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, markAsNew: e.target.checked }))
            }
          />
        </div>
        {/* <div className="item">
          <label>Blog Content</label>
          <RichEditor
            content={formData.content}
            onChange={(html: any) =>
              setFormData((prev) => ({ ...prev, content: html }))
            }
          />
        </div> */}
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddBlogPage;
