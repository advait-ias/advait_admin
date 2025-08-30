import toast from "react-hot-toast";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllHomeCarousel,
  addHomeCarousel,
  deleteHomeCarousel,
  updateHomeCarousel,
} from "../../api/services/homeCarouselService";
import "./homecarousel.scss";

const HomeCarousel = () => {
  const queryClient = useQueryClient();
  const [images, setImages] = useState<{ file: File; routeUrl: string }[]>([]);

  const { data: carouselImages, isLoading } = useQuery({
    queryKey: ["homeCarousel"],
    queryFn: fetchAllHomeCarousel,
  });

  const { mutate: uploadImage } = useMutation({
    mutationFn: ({ file, routeUrl }: { file: File; routeUrl?: string }) =>
      addHomeCarousel(file, routeUrl),
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

  const { mutate: editImage } = useMutation({
    mutationFn: ({
      id,
      index,
      routeUrl,
    }: {
      id: string;
      index?: number;
      routeUrl?: string;
    }) => updateHomeCarousel(id, { index, routeUrl }),
    onSuccess: () => {
      toast.success("Carousel updated!");
      queryClient.invalidateQueries({ queryKey: ["homeCarousel"] });
    },
    onError: () => toast.error("Update failed"),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).map((f) => ({
      file: f,
      routeUrl: "",
    }));
    setImages(files);
  };

  const handleRouteChange = (idx: number, value: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? { ...img, routeUrl: value } : img))
    );
  };

  const handleSubmit = () => {
    if (images.length === 0) {
      toast.error("Please pick an image first");
      return;
    }
    images.forEach(({ file, routeUrl }) => uploadImage({ file, routeUrl }));
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

      {/* Preview Section with routeUrl input */}
      {images.length > 0 && (
        <div className="preview-section">
          {images.map((img, idx) => (
            <div key={idx} className="preview-card">
              <img src={URL.createObjectURL(img.file)} alt="preview" />
              <input
                type="text"
                placeholder="Optional route URL"
                value={img.routeUrl}
                onChange={(e) => handleRouteChange(idx, e.target.value)}
              />
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

              <div className="details">
                <input
                  type="number"
                  min={1}
                  value={img.index}
                  onChange={(e) =>
                    editImage({
                      id: img._id,
                      index: parseInt(e.target.value),
                      routeUrl: img.routeUrl,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Optional route URL"
                  value={img.routeUrl || ""}
                  onChange={(e) =>
                    editImage({
                      id: img._id,
                      index: img.index,
                      routeUrl: e.target.value,
                    })
                  }
                />
              </div>

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
