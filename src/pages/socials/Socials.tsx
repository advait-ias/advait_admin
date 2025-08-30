import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSocials, createSocial } from "../../api/services/socialsService";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import toast from "react-hot-toast";
import "./socials.scss";

export default function Socials() {
  const queryClient = useQueryClient();
  const [platform, setPlatform] = useState("");
  const [link, setLink] = useState("");

  // Fetch socials
  const { data: socials, isLoading } = useQuery({
    queryKey: ["socials"],
    queryFn: fetchSocials,
  });

  // Mutation for creating social
  const { mutate: addSocial } = useMutation({
    mutationFn: createSocial,
    onSuccess: () => {
      toast.success("Social link added!");
      queryClient.invalidateQueries({ queryKey: ["socials"] });
      setPlatform("");
      setLink("");
    },
    onError: () => toast.error("Failed to add social link."),
  });

  const handleSubmit = () => {
    if (!platform || !link) {
      toast.error("Both platform and link are required");
      return;
    }
    addSocial({ platform, link });
  };

  return (
    <div className="socials-page">
      <Typography variant="h4" gutterBottom>
        Manage Socials
      </Typography>

      {/* Add Social */}
      <Box className="social-form">
        <FormControl fullWidth margin="normal">
          <InputLabel style={{ color: "white" }}>Platform</InputLabel>
          <Select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            style={{ color: "white" }}
          >
            <MenuItem value="facebook">Facebook</MenuItem>
            <MenuItem value="instagram">Instagram</MenuItem>
            <MenuItem value="twitter">Twitter</MenuItem>
            <MenuItem value="linkedin">LinkedIn</MenuItem>
            <MenuItem value="youtube">YouTube</MenuItem>
            <MenuItem value="telegram">Telegram</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Link"
          fullWidth
          margin="normal"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
        />

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Social
        </Button>
      </Box>

      {/* View Socials */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Existing Socials
      </Typography>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="socials-list">
          {socials?.map((item: any) => (
            <Box key={item._id} className="social-card">
              {Object.keys(item).map((key) => {
                if (["_id", "__v"].includes(key)) return null;
                const social = (item as any)[key];
                return (
                  <div key={key} className="social-item">
                    <Typography variant="subtitle1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>
                    <a
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.link}
                    </a>
                    <span className="status">
                      {social.isActive ? "✅ Active" : "❌ Inactive"}
                    </span>
                  </div>
                );
              })}
            </Box>
          ))}
        </div>
      )}
    </div>
  );
}
