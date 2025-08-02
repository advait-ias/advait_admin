import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "./add.scss";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createQuiz } from "../../api/services/quizService";
import { useNavigate } from "react-router-dom";

interface Question {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

export default function AddQuizPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalTime: 0,
    isPaid: false,
    isActive: true,
    showIn: "",
    questions: [
      {
        questionText: "",
        options: ["", ""], // Only 2 default
        correctOptionIndex: 0,
      },
    ] as Question[],
  });

  const { mutate: submitQuiz } = useMutation({
    mutationFn: createQuiz,
    onSuccess: () => {
      toast.success("Quiz created successfully!");
      navigate("/quizzes");
      // optionally reset form or navigate
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create quiz.");
    },
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    (newQuestions[index] as any)[field] = value;
    handleChange("questions", newQuestions);
  };

  const addQuestion = () => {
    handleChange("questions", [
      ...formData.questions,
      {
        questionText: "",
        options: ["", ""],
        correctOptionIndex: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    handleChange("questions", newQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    setFormData((prev) => {
      const questions = [...prev.questions];
      questions[qIndex].options[optIndex] = value;
      return { ...prev, questions };
    });
  };

  const addOption = (qIndex: number) => {
    setFormData((prev) => {
      const questions = [...prev.questions];
      questions[qIndex] = {
        ...questions[qIndex],
        options: [...questions[qIndex].options, ""],
      };
      return { ...prev, questions };
    });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    setFormData((prev) => {
      const questions = [...prev.questions];
      const newOptions = [...questions[qIndex].options];
      newOptions.splice(optIndex, 1);

      const updatedQuestion = {
        ...questions[qIndex],
        options: newOptions,
        correctOptionIndex: Math.min(
          questions[qIndex].correctOptionIndex,
          newOptions.length - 1
        ),
      };

      questions[qIndex] = updatedQuestion;
      return { ...prev, questions };
    });
  };

  const handleSubmit = () => {
    const payload = {
      title: formData.title,
      description: formData.description,
      totalTime: formData.totalTime,
      isPaid: formData.isPaid,
      isActive: formData.isActive,
      showIn: formData.showIn,
      questions: formData.questions,
    };

    submitQuiz(payload);
  };

  return (
    <div className="add-quiz-page">
      <Typography variant="h4" gutterBottom>
        Add New Quiz
      </Typography>

      <TextField
        label="Quiz Title"
        fullWidth
        margin="normal"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        InputProps={{ style: { color: "white" } }}
        InputLabelProps={{ style: { color: "white" } }}
      />

      <TextField
        label="Description"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        InputProps={{ style: { color: "white" } }}
        InputLabelProps={{ style: { color: "white" } }}
      />

      <TextField
        label="Total Time (in minutes)"
        fullWidth
        type="number"
        margin="normal"
        value={formData.totalTime}
        onChange={(e) => {
          const val = Math.max(0, parseInt(e.target.value));
          handleChange("totalTime", val);
        }}
        inputProps={{ min: 0 }}
        InputProps={{ style: { color: "white" } }}
        InputLabelProps={{ style: { color: "white" } }}
      />

      <div className="switch-group">
        <FormControlLabel
          control={
            <Switch
              checked={formData.isPaid}
              onChange={(e) => handleChange("isPaid", e.target.checked)}
            />
          }
          label="Is Paid"
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
            />
          }
          label="Is Active"
        />
      </div>

      <FormControl fullWidth margin="normal">
        <InputLabel style={{ color: "white" }}>Show In</InputLabel>
        <Select
          value={formData.showIn}
          label="Show In"
          onChange={(e) => handleChange("showIn", e.target.value)}
          style={{ color: "white" }}
        >
          <MenuItem value="web">Web</MenuItem>
          <MenuItem value="app">App</MenuItem>
          <MenuItem value="both">Both</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Questions
      </Typography>

      {formData.questions.map((q, qIndex) => (
        <Box
          key={qIndex}
          sx={{
            border: "1px solid #ccc",
            padding: 2,
            marginY: 2,
            borderRadius: 2,
            background: "#f9f9f9",
          }}
        >
          <TextField
            label={`Question ${qIndex + 1}`}
            fullWidth
            margin="normal"
            value={q.questionText}
            onChange={(e) =>
              handleQuestionChange(qIndex, "questionText", e.target.value)
            }
          />

          {q.options.map((opt, optIndex) => (
            <div
              key={optIndex}
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <TextField
                label={`Option ${optIndex + 1}`}
                value={opt}
                fullWidth
                onChange={(e) =>
                  handleOptionChange(qIndex, optIndex, e.target.value)
                }
              />
              {q.options.length > 2 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeOption(qIndex, optIndex)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="contained"
            onClick={() => addOption(qIndex)}
            sx={{ mt: 1, mb: 4 }}
          >
            ➕ Add Option
          </Button>

          <TextField
            label={`Correct Option Index (1-${q.options.length})`}
            type="number"
            fullWidth
            margin="dense"
            inputProps={{ min: 1, max: q.options.length }}
            value={q.correctOptionIndex + 1} // Add 1 for display
            onChange={(e) => {
              const inputVal = parseInt(e.target.value);
              const clampedVal = Math.max(
                1,
                Math.min(inputVal, q.options.length)
              );
              handleQuestionChange(
                qIndex,
                "correctOptionIndex",
                clampedVal - 1
              ); // Subtract 1 for storage
            }}
          />

          <IconButton
            color="error"
            onClick={() => removeQuestion(qIndex)}
            sx={{ mt: 1 }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <div className="button-actions">
        <Button variant="contained" onClick={addQuestion}>
          ➕ Add Question
        </Button>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Submit Quiz
        </Button>
      </div>
    </div>
  );
}
