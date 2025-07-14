import { useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllTests } from "../../api/services/testService";
import { createBlog } from "../../api/services/blogService";
import "./add.scss";

const AddBlogDialog = ({ setOpen }: { setOpen: (val: boolean) => void }) => {
  const [formData, setFormData] = useState({
    headline: "",
    content: "",
    tags: [] as string[],
  });
  const [image, setImage] = useState<File | null>(null);

  const queryClient = useQueryClient();

  // Fetch tags
  const { data: tagOptions = [], isLoading: loadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchAllTests,
  });

  // Submit course (with image)
  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("headline", formData.headline);
      form.append("content", formData.content);
      form.append("tags", JSON.stringify(formData.tags));

      if (image) {
        form.append("image", image);
      }

      return createBlog(form); // call your exported API function here
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
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
        <h1>Add New Blog</h1>
        <form onSubmit={handleSubmit}>
          {/* Blog Headline */}
          {[{ name: "headline", label: "Blog headline" }].map((input) => (
            <div className="item" key={input.name}>
              <label>{input.label}</label>
              <input
                type="text"
                name={input.name}
                value={formData[input.name as keyof typeof formData]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Blog Tags */}
          <div className="item">
            <label>Blog Tags</label>
            <Autocomplete
              multiple
              options={tagOptions || []}
              loading={loadingTags}
              getOptionLabel={(option: any) => option.name}
              onChange={(e, value) =>
                setFormData((prev) => ({
                  ...prev,
                  blogs: value.map((v: any) => v._id),
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
                        {loadingTags ? (
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

          {/* Blog Image */}
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

          {/* Blog Content - moved to bottom and textarea */}
          <div className="item">
            <label>Blog Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlogDialog;
