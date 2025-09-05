import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAboutUs,
  createAboutUs,
  updateAboutUs,
} from "../../api/services/aboutUsService.ts";
import toast from "react-hot-toast";
import { Button, TextField, Typography, CircularProgress } from "@mui/material";
import RichEditor from "../../components/RichEditor/RichEditor"; // optional rich HTML editor
import "./aboutUs.scss";

export default function AboutUs() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["aboutUs"],
    queryFn: fetchAboutUs,
    staleTime: 1000 * 60 * 5,
  });

  // Local form state - use the HTML string in content
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (data && typeof data.content === "string") {
      setContent(data.content);
    }
  }, [data]);

  const createMutation = useMutation({
    mutationFn: (payload: { content: string }) => createAboutUs(payload),
    onSuccess: (res) => {
      toast.success("About Us created");
      queryClient.invalidateQueries({ queryKey: ["aboutUs"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Create failed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { content: string }) => updateAboutUs(payload),
    onSuccess: (res) => {
      toast.success("About Us updated");
      queryClient.invalidateQueries({ queryKey: ["aboutUs"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Update failed");
    },
  });

  const handleSubmit = () => {
    if (!content || content.trim() === "") {
      toast.error("Content cannot be empty");
      return;
    }

    if (data && data._id) {
      updateMutation.mutate({ content });
    } else {
      createMutation.mutate({ content });
    }
  };

  return (
    <div className="about-us-page">
      <div className="header">
        <Typography variant="h4">About Us</Typography>
      </div>

      {isLoading ? (
        <div className="loading">
          <CircularProgress />
        </div>
      ) : isError ? (
        <div className="error">Failed to load data</div>
      ) : (
        <div className="form-wrapper">
          <div className="editor-section">
            <label className="editor-label">Content</label>

            {/* Use RichEditor for HTML content editing if available */}
            <RichEditor
              content={content}
              onChange={(html: string) => setContent(html)}
            />

            {/* If you prefer plain text instead of RichEditor, swap with TextField:
              <TextField
                label="Content"
                fullWidth
                multiline
                minRows={6}
                value={content}
                onChange={(e)=>setContent(e.target.value)}
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            */}
          </div>

          <div className="actions">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              //   disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {data && data._id ? "Update" : "Create"}
            </Button>

            {/* {createMutation.isLoading || updateMutation.isLoading ? (
              <CircularProgress size={20} style={{ marginLeft: 12 }} />
            ) : null} */}
          </div>

          <div className="preview">
            <Typography variant="h6" sx={{ mb: 1 }}>
              Preview
            </Typography>
            {/* render HTML safely - assume content is trusted admin HTML */}
            <div
              className="preview-box"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: content || "<p>No content</p>",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
