import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

// Import form components
import BasicDetailsForm from './forms/BasicDetailsForm';
import ModulesForm from './forms/ModulesForm';
import ProjectsForm from './forms/ProjectsForm';
import SupportingMaterialsForm from './forms/SupportingMaterialsForm';

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: '24px',
  },
  paper: {
    padding: '24px',
    marginBottom: '24px',
    borderRadius: '8px',
  },
  sectionTitle: {
    marginBottom: '16px',
    fontWeight: 600,
    color: '#1a237e',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  saveButton: {
    backgroundColor: '#1a237e',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#0d147a',
    },
  },
  errorText: {
    color: '#f44336',
    marginTop: '8px',
    fontSize: '0.75rem',
  }
});

const UpdateCareerPath = ({ curriculum, onSuccess, onCancel }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [institutions, setInstitutions] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    role: '',
    title: '',
    description: '',
    modules: [{ name: '', topics: [''] }],
    recommended_projects: [''],
    file_url: '',
    institution: ''
  });
  
  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Fetch institutions
    fetchInstitutions();
    
    // Initialize form data with curriculum data if available
    if (curriculum) {
      initializeFormData(curriculum);
    }
  }, [curriculum]);

  const initializeFormData = (data) => {
    // Extract modules and projects from content
    const modules = data.content?.modules || [{ name: '', topics: [''] }];
    const recommended_projects = data.content?.recommended_projects || [''];
    
    setFormData({
      role: data.role || '',
      title: data.title || '',
      description: data.description || '',
      modules: modules,
      recommended_projects: recommended_projects,
      file_url: data.file_url || '',
      institution: data.institution || ''
    });
    
    setInitialLoading(false);
  };

  const fetchInstitutions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('https://lms1-1-p88i.onrender.com/api/institutions/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInstitutions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setAlert({
        open: true,
        message: 'Failed to fetch institutions',
        severity: 'error'
      });
    }
  };

  // Handle basic details form fields
  const handleBasicDetailsChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: ''
      }));
    }
  };

  // Handle modules form
  const handleModuleChange = (modules) => {
    setFormData({
      ...formData,
      modules
    });
    
    // Clear module-related errors
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith('modules')) {
        delete newErrors[key];
      }
    });
    
    setErrors(newErrors);
  };

  // Handle projects form
  const handleProjectsChange = (projects) => {
    setFormData({
      ...formData,
      recommended_projects: projects
    });
  };

  // Handle supporting materials form
  const handleSupportingMaterialsChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate basic fields
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.institution) newErrors.institution = 'Institution ID is required';
    
    // Validate modules
    formData.modules.forEach((module, idx) => {
      if (!module.name) {
        newErrors[`modules.${idx}.name`] = 'Module name is required';
      }
      
      if (!module.topics || module.topics.length === 0) {
        newErrors[`modules.${idx}.topics`] = 'At least one topic is required';
      } else {
        // Check for empty topics
        module.topics.forEach((topic, topicIdx) => {
          if (!topic.trim()) {
            newErrors[`modules.${idx}.topics.${topicIdx}`] = 'Topic cannot be empty';
          }
        });
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      setAlert({
        open: true,
        message: 'Please fix the errors in the form',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Format data for API
      const apiData = {
        role: formData.role,
        title: formData.title,
        description: formData.description,
        content: {
          modules: formData.modules.map(module => ({
            name: module.name,
            topics: module.topics.filter(topic => topic.trim() !== '')
          })),
          recommended_projects: formData.recommended_projects.filter(project => project.trim() !== '')
        },
        file_url: formData.file_url,
        institution: parseInt(formData.institution, 10)
      };

      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        `https://lms1-1-p88i.onrender.com/api/curriculum/${curriculum.id}/`,
        apiData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setAlert({
        open: true,
        message: 'Career path updated successfully!',
        severity: 'success'
      });
      
      // Call the success callback with the response data
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error updating career path:', error);
      
      // Handle backend validation errors
      if (error.response?.data) {
        const backendErrors = {};
        Object.entries(error.response.data).forEach(([key, value]) => {
          backendErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setErrors(backendErrors);
      }
      
      let errorMessage = 'Failed to update career path';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setAlert({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({...alert, open: false});
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
        Update Career Path: {curriculum.title}
      </Typography>
      
      {loading && (
        <Box className={classes.loadingOverlay}>
          <CircularProgress size={60} />
        </Box>
      )}

      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Basic Details
        </Typography>
        <BasicDetailsForm 
          formData={formData} 
          onChange={handleBasicDetailsChange} 
        />
      </Paper>

      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Modules & Topics
        </Typography>
        <ModulesForm 
          modules={formData.modules} 
          onChange={handleModuleChange} 
        />
      </Paper>

      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Recommended Projects
        </Typography>
        <ProjectsForm 
          projects={formData.recommended_projects} 
          onChange={handleProjectsChange} 
        />
      </Paper>

      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Supporting Materials
        </Typography>
        <SupportingMaterialsForm 
          formData={formData} 
          onChange={handleSupportingMaterialsChange} 
        />
      </Paper>

      {errors.form && (
        <Typography className={classes.errorText}>
          {errors.form}
        </Typography>
      )}

      <Box className={classes.buttonsContainer}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={loading}
          className={classes.saveButton}
        >
          {loading ? "Updating..." : "Update Career Path"}
        </Button>
      </Box>

      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateCareerPath;