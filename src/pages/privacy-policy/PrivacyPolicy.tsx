import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPrivacyPolicy,
  createPrivacyPolicy,
  updatePrivacyPolicy,
} from "../../api/services/privacyService";
import { TextField, Button, Typography, Box } from "@mui/material";
import toast from "react-hot-toast";
import "./privacy.scss";

export default function PrivacyPolicy() {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  // Fetch existing privacy policy
  const { data: policy, isLoading } = useQuery({
    queryKey: ["privacyPolicy"],
    queryFn: fetchPrivacyPolicy,
  });

  useEffect(() => {
    if (policy?.content) setContent(policy.content);
  }, [policy]);

  // Create
  const { mutate: addPolicy } = useMutation({
    mutationFn: createPrivacyPolicy,
    onSuccess: () => {
      toast.success("Privacy Policy created!");
      queryClient.invalidateQueries({ queryKey: ["privacyPolicy"] });
    },
    onError: () => toast.error("Failed to create Privacy Policy."),
  });

  // Update
  const { mutate: editPolicy } = useMutation({
    mutationFn: updatePrivacyPolicy,
    onSuccess: () => {
      toast.success("Privacy Policy updated!");
      queryClient.invalidateQueries({ queryKey: ["privacyPolicy"] });
    },
    onError: () => toast.error("Failed to update Privacy Policy."),
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }
    if (policy?._id) {
      editPolicy({ content });
    } else {
      addPolicy({ content });
    }
  };

  return (
    <div className="privacy-page">
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Box className="privacy-form">
          <TextField
            label="Privacy Policy Content"
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
            {policy?._id ? "Update Policy" : "Create Policy"}
          </Button>
        </Box>
      )}
    </div>
  );
}
