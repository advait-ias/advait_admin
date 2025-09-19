import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addWhatsNew,
  deleteWhatsNew,
  fetchAllWhatsNew,
} from "../../api/services/whatsNew";
import "./whatsnew.scss";

const WhatsNewPage = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string[]>([]);

  // Get all articles
  const { data: articles = [], isLoading: loadingArticles } = useQuery({
    queryKey: ["whatsNewArticles"],
    queryFn: fetchAllWhatsNew,
  });

  // Get existing WhatsNew
  const { data: whatsNew = [], isLoading: loadingWhatsNew } = useQuery({
    queryKey: ["whatsNew"],
    queryFn: fetchAllWhatsNew,
  });

  // Add mutation
  const { mutate: addMutation } = useMutation({
    mutationFn: (id: string) => addWhatsNew(id),
    onSuccess: () => {
      toast.success("Added to WhatsNew!");
      queryClient.invalidateQueries({ queryKey: ["whatsNew"] });
    },
    onError: () => toast.error("Failed to add"),
  });

  // Delete mutation
  const { mutate: deleteMutation } = useMutation({
    mutationFn: (id: string) => deleteWhatsNew(id),
    onSuccess: () => {
      toast.success("Removed from WhatsNew!");
      queryClient.invalidateQueries({ queryKey: ["whatsNew"] });
    },
    onError: () => toast.error("Failed to remove"),
  });

  // Initialize selected checkboxes from whatsNew data
  useEffect(() => {
    if (whatsNew) {
      const ids = whatsNew.map((w: any) => w._id);
      setSelected(ids);
    }
  }, [whatsNew]);

  // Handle toggle
  const handleToggle = (id: string, checked: boolean) => {
    if (checked) {
      setSelected((prev) => [...prev, id]);
      addMutation(id);
    } else {
      setSelected((prev) => prev.filter((i) => i !== id));
      deleteMutation(id);
    }
  };

  if (loadingArticles || loadingWhatsNew) return <p>Loading...</p>;

  return (
    <div className="whats-new-page">
      <h2>Manage What's New Content</h2>
      <div className="article-list">
        {articles.map((article: any) => (
          <div key={article._id} className="article-item">
            <input
              type="checkbox"
              checked={selected.includes(article._id)}
              onChange={(e) => handleToggle(article._id, e.target.checked)}
            />
            <img src={article.image} alt={article.headline} width={60} />
            <div className="info">
              <h4>{article.headline}</h4>
              <p>
                {article.category?.name} → {article.subCategory?.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatsNewPage;
