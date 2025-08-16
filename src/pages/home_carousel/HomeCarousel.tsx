import toast from "react-hot-toast";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllHomeCarousel,
  addHomeCarousel,
  deleteHomeCarousel,
} from "../../api/services/homeCarouselService";
import "./homecarousel.scss";

const HomeCarousel = () => {
  const queryClient = useQueryClient();
  const [images, setImages] = useState<File[]>([]);

  const { data: carouselImages, isLoading } = useQuery({
    queryKey: ["homeCarousel"],
    queryFn: fetchAllHomeCarousel,
  });

  const { mutate: uploadImage } = useMutation({
    mutationFn: (file: File) => addHomeCarousel(file),
    onSuccess: () => {
      toast.success("Image uploaded!");
      queryClient.invalidateQueries({ queryKey: ["homeCarousel"] });
      setImages([]);
    },
    onError: () => toast.error("Upload failed"),
  });

  const { mutate: removeImage } = useMutation({
    mutationFn: (id: string) => deleteHomeCarousel(id),
    onSuccess: () => {
      toast.success("Image deleted!");
      queryClient.invalidateQueries({ queryKey: ["homeCarousel"] });
    },
    onError: () => toast.error("Delete failed"),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = () => {
    if (images.length === 0) {
      toast.error("Please pick an image first");
      return;
    }
    images.forEach((img) => uploadImage(img));
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) removeImage(id);
  };

  return (
    <div className="home-carousel">
      <h2 className="title">Home Carousel</h2>

      {/* Upload Section */}
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <button
          className="btn upload-btn"
          onClick={handleSubmit}
          disabled={images.length === 0}
        >
          Upload Selected
        </button>
      </div>

      {/* Preview Section */}
      {images.length > 0 && (
        <div className="preview-section">
          {images.map((file, idx) => (
            <div key={idx} className="preview-card">
              <img src={URL.createObjectURL(file)} alt="preview" />
            </div>
          ))}
        </div>
      )}

      <h3>Uploaded Carousel</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="uploaded-list">
          {carouselImages?.map((img: any) => (
            <div key={img._id} className="uploaded-card">
              <img src={img.imageUrl} alt="carousel" />
              <button
                className="delete-btn"
                onClick={() => handleDelete(img._id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeCarousel;
