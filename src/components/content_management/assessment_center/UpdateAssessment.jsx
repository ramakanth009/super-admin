import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  FormHelperText,
  Divider,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as MoveUpIcon,
  ArrowDownward as MoveDownIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  formSection: {
    marginBottom: '24px',
  },
  sectionTitle: {
    color: '#1a237e',
    fontWeight: 600,
    marginBottom: '16px',
  },
  questionCard: {
    marginBottom: '24px',
    position: 'relative',
    border: '1px solid #e0e7ff',
  },
  questionHeader: {
    backgroundColor: '#f8fafd',
    padding: '12px 16px',
    borderBottom: '1px solid #e0e7ff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionContent: {
    padding: '16px',
  },
  deleteButton: {
    color: '#f44336',
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  optionField: {
    flexGrow: 1,
    marginRight: '8px',
  },
  optionLabel: {
    minWidth: '80px',
    marginRight: '8px',
    color: '#666',
  },
  addButton: {
    marginTop: '16px',
    backgroundColor: '#1a237e',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#0d147a',
    },
  },
  saveButton: {
    backgroundColor: '#1a237e',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#0d147a',
    },
  },
  moveButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  errorText: {
    color: '#f44336',
    marginTop: '8px',
    fontSize: '0.75rem',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  formField: {
    marginBottom: '16px',
  },
});

const questionTypes = [
  { value: 'mcq', label: 'Multiple Choice (MCQ)' },
  // { value: 'descriptive', label: 'Descriptive' },
  // { value: 'coding', label: 'Coding' }
];

const roles = [
  { value: 'student', label: 'Student' },
  { value: 'software_developer', label: 'Software Developer' },
  { value: 'data_scientist', label: 'Data Scientist' },
  { value: 'network_engineer', label: 'Network Engineer' }
];

const UpdateAssessment = ({ assessment, onSuccess, onCancel }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    role: '',
    title: '',
    description: '',
    questions: [
      {
        question_text: '',
        type: 'mcq',
        marks: '',
        options: ['', ''],
        correct_answer: ''
      }
    ],
    total_marks: '',
    duration_minutes: '',
    institution: ''
  });

  useEffect(() => {
    // Initialize form data with assessment data if available
    if (assessment) {
      initializeFormData(assessment);
    }
  }, [assessment]);

  const initializeFormData = (data) => {
    setFormData({
      role: data.role || '',
      title: data.title || '',
      description: data.description || '',
      questions: data.questions || [{
        question_text: '',
        type: 'mcq',
        marks: '',
        options: ['', ''],
        correct_answer: ''
      }],
      total_marks: data.total_marks || '',
      duration_minutes: data.duration_minutes || '',
      institution: data.institution || ''
    });
    
    setInitialLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    setFormData(prevData => ({
      ...prevData,
      questions: updatedQuestions
    }));
    
    // Clear question-specific error
    if (errors[`questions.${index}.${field}`]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`questions.${index}.${field}`]: ''
      }));
    }
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    };
    
    setFormData(prevData => ({
      ...prevData,
      questions: updatedQuestions
    }));
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push('');
    
    setFormData(prevData => ({
      ...prevData,
      questions: updatedQuestions
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    
    setFormData(prevData => ({
      ...prevData,
      questions: updatedQuestions
    }));
  };

  const addQuestion = () => {
    setFormData(prevData => ({
      ...prevData,
      questions: [
        ...prevData.questions,
        {
          question_text: '',
          type: 'mcq',
          marks: '',
          options: ['', ''],
          correct_answer: ''
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length === 1) {
      return; // Prevent removing the last question
    }
    
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    
    setFormData(prevData => ({
      ...prevData,
      questions: updatedQuestions
    }));
  };

  const moveQuestion = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === formData.questions.length - 1)
    ) {
      return; // Prevent invalid moves
    }
    
    const updatedQuestions = [...formData.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap questions
    [updatedQuestions[index], updatedQuestions[targetIndex]] = 
      [updatedQuestions[targetIndex], updatedQuestions[index]];
    
    setFormData(prevData => ({
      ...prevData,
      questions: updatedQuestions
    }));
  };

  const calculateTotalMarks = () => {
    return formData.questions.reduce((total, q) => {
      const marks = parseInt(q.marks) || 0;
      return total + marks;
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate basic fields
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.duration_minutes) newErrors.duration_minutes = 'Duration is required';
    if (!formData.institution) newErrors.institution = 'Institution ID is required';
    
    // Auto-calculate total marks from questions
    const calculatedMarks = calculateTotalMarks();
    if (calculatedMarks <= 0) {
      newErrors.total_marks = 'Total marks must be greater than 0';
    }
    
    // Validate questions
    formData.questions.forEach((question, idx) => {
      if (!question.question_text) {
        newErrors[`questions.${idx}.question_text`] = 'Question text is required';
      }
      
      if (!question.marks) {
        newErrors[`questions.${idx}.marks`] = 'Marks are required';
      } else if (isNaN(parseInt(question.marks)) || parseInt(question.marks) <= 0) {
        newErrors[`questions.${idx}.marks`] = 'Marks must be a positive number';
      }
      
      if (question.type === 'mcq') {
        // Ensure there are at least 2 options
        if (!question.options || question.options.length < 2) {
          newErrors[`questions.${idx}.options`] = 'At least 2 options are required';
        } else {
          // Check for empty options
          question.options.forEach((option, optIdx) => {
            if (!option.trim()) {
              newErrors[`questions.${idx}.options.${optIdx}`] = 'Option cannot be empty';
            }
          });
        }
        
        // Ensure correct answer is selected
        if (!question.correct_answer) {
          newErrors[`questions.${idx}.correct_answer`] = 'Correct answer is required';
        } else if (!question.options.includes(question.correct_answer)) {
          newErrors[`questions.${idx}.correct_answer`] = 'Correct answer must be one of the options';
        }
      } else {
        // For non-MCQ questions, ensure correct answer is provided
        if (!question.correct_answer) {
          newErrors[`questions.${idx}.correct_answer`] = 'Correct answer is required';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare submission data
      const submissionData = {
        ...formData,
        total_marks: calculateTotalMarks()
      };

      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        `http://localhost:8000/api/assessments/${assessment.id}/`,
        submissionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error updating assessment:', error);
      
      // Handle backend validation errors
      if (error.response?.data) {
        const backendErrors = {};
        Object.entries(error.response.data).forEach(([key, value]) => {
          backendErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ 
          form: 'Failed to update assessment. Please try again.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Update Assessment: {assessment.title}
      </Typography>
      
      <Box className={classes.formSection}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              variant="outlined" 
              className={classes.formField}
              error={!!errors.role}
            >
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Role"
              >
                {roles.map(role => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Institution ID"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              variant="outlined"
              className={classes.formField}
              error={!!errors.institution}
              helperText={errors.institution}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Assessment Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              variant="outlined"
              className={classes.formField}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              variant="outlined"
              multiline
              rows={3}
              className={classes.formField}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (minutes)"
              name="duration_minutes"
              type="number"
              value={formData.duration_minutes}
              onChange={handleInputChange}
              variant="outlined"
              className={classes.formField}
              error={!!errors.duration_minutes}
              helperText={errors.duration_minutes}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Total Marks (Auto-calculated)"
              value={calculateTotalMarks()}
              variant="outlined"
              disabled
              className={classes.formField}
              error={!!errors.total_marks}
              helperText={errors.total_marks || "Automatically calculated from question marks"}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />
      
      <Box className={classes.formSection}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Questions & Answers
        </Typography>
        
        {formData.questions.map((question, questionIndex) => (
          <Card key={questionIndex} className={classes.questionCard}>
            <Box className={classes.questionHeader}>
              <Typography variant="subtitle1">
                Question {questionIndex + 1}
              </Typography>
              <Box>
                <Box className={classes.moveButtons}>
                  <IconButton 
                    size="small" 
                    color="primary"
                    disabled={questionIndex === 0}
                    onClick={() => moveQuestion(questionIndex, 'up')}
                  >
                    <MoveUpIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="primary"
                    disabled={questionIndex === formData.questions.length - 1}
                    onClick={() => moveQuestion(questionIndex, 'down')}
                  >
                    <MoveDownIcon fontSize="small" />
                  </IconButton>
                </Box>
                <IconButton 
                  size="small" 
                  className={classes.deleteButton}
                  onClick={() => removeQuestion(questionIndex)}
                  disabled={formData.questions.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            
            <CardContent className={classes.questionContent}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Question Text"
                    value={question.question_text}
                    onChange={(e) => handleQuestionChange(questionIndex, 'question_text', e.target.value)}
                    variant="outlined"
                    multiline
                    rows={2}
                    error={!!errors[`questions.${questionIndex}.question_text`]}
                    helperText={errors[`questions.${questionIndex}.question_text`]}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl 
                    fullWidth 
                    variant="outlined"
                    error={!!errors[`questions.${questionIndex}.type`]}
                  >
                    <InputLabel>Question Type</InputLabel>
                    <Select
                      value={question.type}
                      onChange={(e) => handleQuestionChange(questionIndex, 'type', e.target.value)}
                      label="Question Type"
                    >
                      {questionTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors[`questions.${questionIndex}.type`] && (
                      <FormHelperText>{errors[`questions.${questionIndex}.type`]}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Marks"
                    type="number"
                    value={question.marks}
                    onChange={(e) => handleQuestionChange(questionIndex, 'marks', e.target.value)}
                    variant="outlined"
                    error={!!errors[`questions.${questionIndex}.marks`]}
                    helperText={errors[`questions.${questionIndex}.marks`]}
                  />
                </Grid>
                
                {question.type === 'mcq' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Options:
                    </Typography>
                    {question.options.map((option, optionIndex) => (
                      <Box key={optionIndex} className={classes.optionRow}>
                        <Typography className={classes.optionLabel}>
                          Option {optionIndex + 1}:
                        </Typography>
                        <TextField
                          className={classes.optionField}
                          value={option}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          variant="outlined"
                          size="small"
                          error={!!errors[`questions.${questionIndex}.options.${optionIndex}`]}
                          helperText={errors[`questions.${questionIndex}.options.${optionIndex}`]}
                        />
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => removeOption(questionIndex, optionIndex)}
                          disabled={question.options.length <= 2}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => addOption(questionIndex)}
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Add Option
                    </Button>
                    
                    {errors[`questions.${questionIndex}.options`] && (
                      <Typography className={classes.errorText}>
                        {errors[`questions.${questionIndex}.options`]}
                      </Typography>
                    )}
                    
                    <FormControl 
                      fullWidth 
                      variant="outlined" 
                      sx={{ mt: 2 }}
                      error={!!errors[`questions.${questionIndex}.correct_answer`]}
                    >
                      <InputLabel>Correct Answer</InputLabel>
                      <Select
                        value={question.correct_answer}
                        onChange={(e) => handleQuestionChange(questionIndex, 'correct_answer', e.target.value)}
                        label="Correct Answer"
                      >
                        {question.options.map((option, idx) => (
                          option.trim() && (
                            <MenuItem key={idx} value={option}>
                              {option}
                            </MenuItem>
                          )
                        ))}
                      </Select>
                      {errors[`questions.${questionIndex}.correct_answer`] && (
                        <FormHelperText>{errors[`questions.${questionIndex}.correct_answer`]}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                )}
                
                {question.type !== 'mcq' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Correct Answer"
                      value={question.correct_answer}
                      onChange={(e) => handleQuestionChange(questionIndex, 'correct_answer', e.target.value)}
                      variant="outlined"
                      multiline
                      rows={2}
                      error={!!errors[`questions.${questionIndex}.correct_answer`]}
                      helperText={errors[`questions.${questionIndex}.correct_answer`]}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        ))}
        
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addQuestion}
          className={classes.addButton}
        >
          Add Another Question
        </Button>
        
        {errors.form && (
          <Typography className={classes.errorText} sx={{ mt: 2 }}>
            {errors.form}
          </Typography>
        )}
      </Box>
      
      <Box className={classes.buttonGroup}>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          className={classes.saveButton}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Assessment'}
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateAssessment;