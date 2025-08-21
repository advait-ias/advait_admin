import toast from "react-hot-toast";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "./add.scss"; // updated stylesheet path
import { createTestimonial } from "../../api/services/testimonialService";

const AddTestimonialPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    message: "",
    rating: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("designation", formData.designation);
      form.append("message", formData.message);
      form.append("rating", Number(formData.rating).toString());
      if (image) form.append("image", image);
      return createTestimonial(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      navigate("/testimonials"); // redirect back to blog list
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
      <h1>Add New Testimonial</h1>
      <form onSubmit={handleSubmit}>
        {/* Headline */}
        <div className="item">
          <label>Reviewer Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="item">
          <label>Reviewer Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>
        <div className="item">
          <label>Message</label>
          <input
            type="text"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <div className="item">
          <label>Rating</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="item">
          <label>Reviewer Image</label>
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
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddTestimonialPage;
