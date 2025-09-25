import { useEffect, useState } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchContact,
  createContact,
  updateContact,
} from "../../api/services/contactService";
import toast from "react-hot-toast";
import "./contact.scss";

export default function Contact() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contact"],
    queryFn: fetchContact,
  });

  const [form, setForm] = useState({
    address: "",
    contactNumber: "",
    email: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        address: data.address || "",
        contactNumber: data.contactNumber || "",
        email: data.email || "",
      });
    }
  }, [data]);

  const createMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      toast.success("Contact created!");
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Create failed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateContact,
    onSuccess: () => {
      toast.success("Contact updated!");
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Update failed");
    },
  });

  const handleChange = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = () => {
    if (!form.address || !form.contactNumber || !form.email) {
      toast.error("All fields are required");
      return;
    }

    if (data && data._id) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="contact-page">
      <Typography variant="h4" className="title">
        Contact Info
      </Typography>

      {isLoading ? (
        <div className="loading">
          <CircularProgress />
        </div>
      ) : isError ? (
        <p>Error loading contact info</p>
      ) : (
        <div className="form-wrapper">
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
            multiline
            rows={3}
          />

          <TextField
            label="Contact Number"
            fullWidth
            margin="normal"
            value={form.contactNumber}
            onChange={(e) => handleChange("contactNumber", e.target.value)}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
          />

          <div className="actions">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            //   disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {data && data._id ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
