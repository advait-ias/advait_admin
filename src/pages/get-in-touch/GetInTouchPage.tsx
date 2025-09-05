import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchGetInTouch,
  createGetInTouch,
  updateGetInTouch,
} from "../../api/services/getInTouchService";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import "./getInTouch.scss";

export default function GetInTouch() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getInTouch"],
    queryFn: fetchGetInTouch,
    staleTime: 1000 * 60 * 5,
  });

  const [form, setForm] = useState({
    address: "",
    contactNumber: "",
    email: "",
  });

  useEffect(() => {
    if (data) {
      // backend returns either object or array — handle typical object response
      const payload = Array.isArray(data) ? data[0] : data;
      if (payload) {
        setForm({
          address: payload.address || "",
          contactNumber: payload.contactNumber || "",
          email: payload.email || "",
        });
      }
    }
  }, [data]);

  const createMutation = useMutation({
    mutationFn: (payload: typeof form) => createGetInTouch(payload),
    onSuccess: () => {
      toast.success("Get In Touch created");
      queryClient.invalidateQueries({ queryKey: ["getInTouch"] });
      // navigate back or keep on page
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Create failed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: typeof form) => updateGetInTouch(payload),
    onSuccess: () => {
      toast.success("Get In Touch updated");
      queryClient.invalidateQueries({ queryKey: ["getInTouch"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Update failed");
    },
  });

  const handleChange = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    if (!form.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!form.contactNumber.trim()) {
      toast.error("Contact number is required");
      return false;
    }
    // simple phone validation (digits only, min 6)
    if (!/^\+?[0-9\s-]{6,}$/.test(form.contactNumber.trim())) {
      toast.error("Please enter a valid contact number");
      return false;
    }
    // email optional? backend expects email; validate if present
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (data && (data._id || (Array.isArray(data) && data.length > 0))) {
      // update
      updateMutation.mutate(form);
    } else {
      // create
      createMutation.mutate(form);
    }
  };

  return (
    <div className="get-in-touch-page">
      <div className="header">
        <Typography variant="h4">Get In Touch</Typography>
      </div>

      {isLoading ? (
        <div className="loading">
          <CircularProgress />
        </div>
      ) : isError ? (
        <div className="error">Failed to load data</div>
      ) : (
        <div className="form-wrapper">
          <Box className="field">
            <label className="label">Address</label>
            <TextField
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Address"
              fullWidth
              variant="outlined"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          </Box>

          <Box className="field">
            <label className="label">Contact Number</label>
            <TextField
              value={form.contactNumber}
              onChange={(e) => handleChange("contactNumber", e.target.value)}
              placeholder="e.g. +91 9876543210"
              fullWidth
              variant="outlined"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          </Box>

          <Box className="field">
            <label className="label">Email</label>
            <TextField
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="admin@example.com"
              fullWidth
              variant="outlined"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          </Box>

          <div className="actions">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              //   disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {data && (data._id || (Array.isArray(data) && data.length > 0))
                ? "Update"
                : "Create"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                // reset to original data fetched
                const payload = Array.isArray(data) ? data[0] : data;
                setForm({
                  address: payload?.address || "",
                  contactNumber: payload?.contactNumber || "",
                  email: payload?.email || "",
                });
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
