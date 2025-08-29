import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllFaqs,
  createFaq,
  deleteFaq,
} from "../../api/services/faqService";
import { TextField, Button, Typography, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import "./faq.scss";

export default function FaqPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ question: "", answer: "" });

  // GET FAQs
  const {
    data: faqs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: fetchAllFaqs,
  });

  // ADD FAQ
  const { mutate: addFaq, isPending } = useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      toast.success("FAQ added successfully!");
      setFormData({ question: "", answer: "" });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
    onError: () => toast.error("Failed to add FAQ"),
  });

  // DELETE FAQ
  const { mutate: removeFaq } = useMutation({
    mutationFn: (id: string) => deleteFaq(id),
    onSuccess: () => {
      toast.success("FAQ deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
    onError: () => toast.error("Failed to delete FAQ"),
  });

  const handleSubmit = () => {
    if (!formData.question || !formData.answer) {
      toast.error("Both fields are required!");
      return;
    }
    addFaq(formData);
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm("Delete this FAQ?");
    if (confirmDelete) removeFaq(id);
  };

  return (
    <div className="faq-page">
      <Typography variant="h4" gutterBottom>
        Manage FAQs
      </Typography>

      {/* Add FAQ */}
      <Box className="faq-form">
        <TextField
          label="Question"
          fullWidth
          margin="normal"
          value={formData.question}
          onChange={(e) =>
            setFormData({ ...formData, question: e.target.value })
          }
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
        />
        <TextField
          label="Answer"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
          sx={{ mt: 2 }}
        >
          Add FAQ
        </Button>
      </Box>

      {/* List FAQs */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        All FAQs
      </Typography>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        faqs?.map((faq: any) => (
          <Box
            key={faq._id}
            className="faq-card"
            sx={{
              border: "1px solid #444",
              padding: 2,
              borderRadius: 2,
              mt: 2,
              background: "#1c2535",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Typography variant="subtitle1">{faq.question}</Typography>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                {faq.answer}
              </Typography>
            </div>
            <IconButton
              color="error"
              onClick={() => handleDelete(faq._id)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))
      )}
    </div>
  );
}
