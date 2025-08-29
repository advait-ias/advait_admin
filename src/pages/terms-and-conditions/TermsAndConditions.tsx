import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTerms, createTerms, updateTerms } from "../../api/services/termsService";
import { TextField, Button, Typography, Box } from "@mui/material";
import toast from "react-hot-toast";
import "./terms.scss";

export default function TermsAndConditions() {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  // Fetch existing Terms
  const { data: terms, isLoading } = useQuery({
    queryKey: ["terms"],
    queryFn: fetchTerms,
  });

  // Populate state when terms are loaded
  useEffect(() => {
    if (terms?.content) setContent(terms.content);
  }, [terms]);

  // Create mutation
  const { mutate: addTerms } = useMutation({
    mutationFn: createTerms,
    onSuccess: () => {
      toast.success("Terms & Conditions created!");
      queryClient.invalidateQueries({ queryKey: ["terms"] });
    },
    onError: () => toast.error("Failed to create Terms."),
  });

  // Update mutation
  const { mutate: editTerms } = useMutation({
    mutationFn: updateTerms,
    onSuccess: () => {
      toast.success("Terms & Conditions updated!");
      queryClient.invalidateQueries({ queryKey: ["terms"] });
    },
    onError: () => toast.error("Failed to update Terms."),
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }
    if (terms?._id) {
      editTerms({ content });
    } else {
      addTerms({ content });
    }
  };

  return (
    <div className="terms-page">
      <Typography variant="h4" gutterBottom>
        Terms & Conditions
      </Typography>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Box className="terms-form">
          <TextField
            label="Terms & Conditions Content"
            fullWidth
            multiline
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            {terms?._id ? "Update Terms" : "Create Terms"}
          </Button>
        </Box>
      )}
    </div>
  );
}
