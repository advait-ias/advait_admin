import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAllSubjects } from "../../api/services/subjectService";
import { createPYQ } from "../../api/services/pyqService";
import "./add.scss"; // updated stylesheet path

const AddPYQsPage = () => {
  const [formData, setFormData] = useState({
    subject: "", // single subject ID
    name: "",
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: subjectOptions = [], isLoading: loadingSubject } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchAllSubjects,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("subject", formData.subject); // single string now
      form.append("name", formData.name);
      return createPYQ(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pyqs"] });
      navigate("/pyqs");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="add-pyq-page">
      <button className="close-btn" onClick={() => navigate("/pyqs")}>
        ×
      </button>
      <h1>Add New PYQ</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        {/* Single Subject Select */}
        <div className="item">
          <label>Select Subject</label>
          <Autocomplete
            options={subjectOptions}
            loading={loadingSubject}
            getOptionLabel={(option: any) => option.name}
            value={
              subjectOptions.find((opt: any) => opt._id === formData.subject) ||
              null
            }
            onChange={(e, value) =>
              setFormData((prev) => ({
                ...prev,
                subject: value?._id || "",
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Subject"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingSubject ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* PYQ Name */}
        <div className="item">
          <label>PYQ Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddPYQsPage;
