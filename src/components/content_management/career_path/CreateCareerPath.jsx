// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Grid,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   CircularProgress,
//   Divider,
//   IconButton,
//   FormHelperText,
//   Card,
//   CardHeader,
//   CardContent
// } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   ArrowUpward as MoveUpIcon,
//   ArrowDownward as MoveDownIcon,
//   Clear as ClearIcon
// } from '@mui/icons-material';
// import axios from 'axios';

// const useStyles = makeStyles({
//   root: {
//     width: '100%',
//   },
//   formSection: {
//     marginBottom: '24px',
//   },
//   sectionTitle: {
//     color: '#1a237e',
//     fontWeight: 600,
//     marginBottom: '16px',
//   },
//   moduleCard: {
//     marginBottom: '24px',
//     position: 'relative',
//     border: '1px solid #e0e7ff',
//   },
//   moduleHeader: {
//     backgroundColor: '#f8fafd',
//     padding: '12px 16px',
//     borderBottom: '1px solid #e0e7ff',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   moduleContent: {
//     padding: '16px',
//   },
//   deleteButton: {
//     color: '#f44336',
//   },
//   topicRow: {
//     display: 'flex',
//     alignItems: 'center',
//     marginBottom: '12px',
//   },
//   topicField: {
//     flexGrow: 1,
//     marginRight: '8px',
//   },
//   topicLabel: {
//     minWidth: '80px',
//     marginRight: '8px',
//     color: '#666',
//   },
//   projectRow: {
//     display: 'flex',
//     alignItems: 'center',
//     marginBottom: '12px',
//   },
//   projectField: {
//     flexGrow: 1,
//     marginRight: '8px',
//   },
//   addButton: {
//     marginTop: '16px',
//     backgroundColor: '#1a237e',
//     color: '#ffffff',
//     '&:hover': {
//       backgroundColor: '#0d147a',
//     },
//   },
//   saveButton: {
//     backgroundColor: '#1a237e',
//     color: '#ffffff',
//     '&:hover': {
//       backgroundColor: '#0d147a',
//     },
//   },
//   moveButtons: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   errorText: {
//     color: '#f44336',
//     marginTop: '8px',
//     fontSize: '0.75rem',
//   },
//   buttonGroup: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     gap: '12px',
//     marginTop: '24px',
//   },
//   formField: {
//     marginBottom: '16px',
//   },
// });

// const roles = [
//   { value: 'student', label: 'Student' },
//   { value: 'software_developer', label: 'Software Developer' },
//   { value: 'data_scientist', label: 'Data Scientist' },
//   { value: 'network_engineer', label: 'Network Engineer' },
//   { value: 'computer_science', label: 'Computer Science' }
// ];

// const CreateCareerPath = ({ onSuccess, onCancel }) => {
//   const classes = useStyles();
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [institutions, setInstitutions] = useState([]);
  
//   const [formData, setFormData] = useState({
//     role: '',
//     title: '',
//     description: '',
//     modules: [
//       {
//         name: '',
//         topics: ['']
//       }
//     ],
//     recommended_projects: [''],
//     file_url: '',
//     institution: ''
//   });

//   useEffect(() => {
//     fetchInstitutions();
//   }, []);

//   const fetchInstitutions = async () => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await axios.get('https://lms1-1-p88i.onrender.com/api/institutions/', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setInstitutions(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error('Error fetching institutions:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
    
//     // Clear error when field is edited
//     if (errors[name]) {
//       setErrors(prevErrors => ({
//         ...prevErrors,
//         [name]: ''
//       }));
//     }
//   };

//   // Module management
//   const handleModuleChange = (index, field, value) => {
//     const updatedModules = [...formData.modules];
//     updatedModules[index] = {
//       ...updatedModules[index],
//       [field]: value
//     };
    
//     setFormData(prevData => ({
//       ...prevData,
//       modules: updatedModules
//     }));
    
//     // Clear module-specific error
//     if (errors[`modules.${index}.${field}`]) {
//       setErrors(prevErrors => ({
//         ...prevErrors,
//         [`modules.${index}.${field}`]: ''
//       }));
//     }
//   };

//   const handleTopicChange = (moduleIndex, topicIndex, value) => {
//     const updatedModules = [...formData.modules];
//     const updatedTopics = [...updatedModules[moduleIndex].topics];
//     updatedTopics[topicIndex] = value;
    
//     updatedModules[moduleIndex] = {
//       ...updatedModules[moduleIndex],
//       topics: updatedTopics
//     };
    
//     setFormData(prevData => ({
//       ...prevData,
//       modules: updatedModules
//     }));
//   };

//   const addTopic = (moduleIndex) => {
//     const updatedModules = [...formData.modules];
//     updatedModules[moduleIndex].topics.push('');
    
//     setFormData(prevData => ({
//       ...prevData,
//       modules: updatedModules
//     }));
//   };

//   const removeTopic = (moduleIndex, topicIndex) => {
//     const updatedModules = [...formData.modules];
//     updatedModules[moduleIndex].topics.splice(topicIndex, 1);
    
//     setFormData(prevData => ({
//       ...prevData,
//       modules: updatedModules
//     }));
//   };

//   const addModule = () => {
//     setFormData(prevData => ({
//       ...prevData,
//       modules: [
//         ...prevData.modules,
//         {
//           name: '',
//           topics: ['']
//         }
//       ]
//     }));
//   };

//   const removeModule = (index) => {
//     if (formData.modules.length === 1) {
//       return; // Prevent removing the last module
//     }
    
//     const updatedModules = [...formData.modules];
//     updatedModules.splice(index, 1);
    
//     setFormData(prevData => ({
//       ...prevData,
//       modules: updatedModules
//     }));
//   };

//   const moveModule = (index, direction) => {
//     if (
//       (direction === 'up' && index === 0) || 
//       (direction === 'down' && index === formData.modules.length - 1)
//     ) {
//       return; // Prevent invalid moves
//     }
    
//     const updatedModules = [...formData.modules];
//     const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
//     // Swap modules
//     [updatedModules[index], updatedModules[targetIndex]] = 
//       [updatedModules[targetIndex], updatedModules[index]];
    
//     setFormData(prevData => ({
//       ...prevData,
//       modules: updatedModules
//     }));
//   };

//   // Project management
//   const handleProjectChange = (index, value) => {
//     const updatedProjects = [...formData.recommended_projects];
//     updatedProjects[index] = value;
    
//     setFormData(prevData => ({
//       ...prevData,
//       recommended_projects: updatedProjects
//     }));
//   };

//   const addProject = () => {
//     setFormData(prevData => ({
//       ...prevData,
//       recommended_projects: [...prevData.recommended_projects, '']
//     }));
//   };

//   const removeProject = (index) => {
//     if (formData.recommended_projects.length === 1) {
//       return; // Prevent removing the last project
//     }
    
//     const updatedProjects = [...formData.recommended_projects];
//     updatedProjects.splice(index, 1);
    
//     setFormData(prevData => ({
//       ...prevData,
//       recommended_projects: updatedProjects
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Validate basic fields
//     if (!formData.role) newErrors.role = 'Role is required';
//     if (!formData.title) newErrors.title = 'Title is required';
//     if (!formData.description) newErrors.description = 'Description is required';
//     if (!formData.institution) newErrors.institution = 'Institution ID is required';
    
//     // Validate modules
//     formData.modules.forEach((module, idx) => {
//       if (!module.name) {
//         newErrors[`modules.${idx}.name`] = 'Module name is required';
//       }
      
//       if (!module.topics || module.topics.length === 0) {
//         newErrors[`modules.${idx}.topics`] = 'At least one topic is required';
//       } else {
//         // Check for empty topics
//         module.topics.forEach((topic, topicIdx) => {
//           if (!topic.trim()) {
//             newErrors[`modules.${idx}.topics.${topicIdx}`] = 'Topic cannot be empty';
//           }
//         });
//       }
//     });
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     // Validate form before submission
//     if (!validateForm()) {
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       // Prepare submission data
//       const submissionData = {
//         role: formData.role,
//         title: formData.title,
//         description: formData.description,
//         content: {
//           modules: formData.modules.map(module => ({
//             name: module.name,
//             topics: module.topics.filter(topic => topic.trim() !== '')
//           })),
//           recommended_projects: formData.recommended_projects.filter(project => project.trim() !== '')
//         },
//         file_url: formData.file_url,
//         institution: parseInt(formData.institution, 10)
//       };

//       const token = localStorage.getItem('accessToken');
//       const response = await axios.post(
//         'https://lms1-1-p88i.onrender.com/api/curriculum/',
//         submissionData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.status === 201 || response.status === 200) {
//         onSuccess(response.data);
//       }
//     } catch (error) {
//       console.error('Error creating career path:', error);
      
//       // Handle backend validation errors
//       if (error.response?.data) {
//         const backendErrors = {};
//         Object.entries(error.response.data).forEach(([key, value]) => {
//           backendErrors[key] = Array.isArray(value) ? value[0] : value;
//         });
//         setErrors(backendErrors);
//       } else {
//         setErrors({ 
//           form: 'Failed to create career path. Please try again.' 
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box className={classes.root}>
//       <Box className={classes.formSection}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <FormControl 
//               fullWidth 
//               variant="outlined" 
//               className={classes.formField}
//               error={!!errors.role}
//             >
//               <InputLabel>Role</InputLabel>
//               <Select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleInputChange}
//                 label="Role"
//               >
//                 {roles.map(role => (
//                   <MenuItem key={role.value} value={role.value}>
//                     {role.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//               {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
//             </FormControl>
//           </Grid>
          
//           <Grid item xs={12} sm={6}>
//             <FormControl 
//               fullWidth 
//               variant="outlined" 
//               className={classes.formField}
//               error={!!errors.institution}
//             >
//               <InputLabel>Institution</InputLabel>
//               <Select
//                 name="institution"
//                 value={formData.institution}
//                 onChange={handleInputChange}
//                 label="Institution"
//               >
//                 <MenuItem value="">Select Institution</MenuItem>
//                 {institutions.map(institution => (
//                   <MenuItem key={institution.id} value={institution.id}>
//                     {institution.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//               {errors.institution && <FormHelperText>{errors.institution}</FormHelperText>}
//             </FormControl>
//           </Grid>
          
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Title"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               variant="outlined"
//               className={classes.formField}
//               error={!!errors.title}
//               helperText={errors.title}
//               placeholder="e.g., Full Stack Web Development"
//             />
//           </Grid>
          
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Description"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               variant="outlined"
//               multiline
//               rows={3}
//               className={classes.formField}
//               error={!!errors.description}
//               helperText={errors.description}
//               placeholder="Enter a comprehensive description of the career path"
//             />
//           </Grid>
          
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Supporting Materials URL (Optional)"
//               name="file_url"
//               value={formData.file_url}
//               onChange={handleInputChange}
//               variant="outlined"
//               className={classes.formField}
//               placeholder="e.g., https://example.com/materials.pdf"
//             />
//           </Grid>
//         </Grid>
//       </Box>

//       <Divider sx={{ my: 3 }} />
      
//       <Box className={classes.formSection}>
//         <Typography variant="h6" className={classes.sectionTitle}>
//           Modules & Topics
//         </Typography>
        
//         {formData.modules.map((module, moduleIndex) => (
//           <Card key={moduleIndex} className={classes.moduleCard}>
//             <Box className={classes.moduleHeader}>
//               <Typography variant="subtitle1">
//                 Module {moduleIndex + 1}
//               </Typography>
//               <Box display="flex" alignItems="center">
//                 <Box className={classes.moveButtons}>
//                   <IconButton 
//                     size="small" 
//                     color="primary"
//                     disabled={moduleIndex === 0}
//                     onClick={() => moveModule(moduleIndex, 'up')}
//                   >
//                     <MoveUpIcon fontSize="small" />
//                   </IconButton>
//                   <IconButton 
//                     size="small" 
//                     color="primary"
//                     disabled={moduleIndex === formData.modules.length - 1}
//                     onClick={() => moveModule(moduleIndex, 'down')}
//                   >
//                     <MoveDownIcon fontSize="small" />
//                   </IconButton>
//                 </Box>
//                 <IconButton 
//                   size="small" 
//                   className={classes.deleteButton}
//                   onClick={() => removeModule(moduleIndex)}
//                   disabled={formData.modules.length === 1}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </Box>
//             </Box>
            
//             <CardContent className={classes.moduleContent}>
//               <TextField
//                 fullWidth
//                 label="Module Name"
//                 value={module.name}
//                 onChange={(e) => handleModuleChange(moduleIndex, 'name', e.target.value)}
//                 variant="outlined"
//                 className={classes.formField}
//                 placeholder="e.g., Frontend Fundamentals"
//                 error={!!errors[`modules.${moduleIndex}.name`]}
//                 helperText={errors[`modules.${moduleIndex}.name`]}
//               />
              
//               <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
//                 Topics
//               </Typography>
              
//               {module.topics.map((topic, topicIndex) => (
//                 <Box key={topicIndex} className={classes.topicRow}>
//                   <TextField
//                     className={classes.topicField}
//                     value={topic}
//                     onChange={(e) => handleTopicChange(moduleIndex, topicIndex, e.target.value)}
//                     placeholder={`Topic ${topicIndex + 1}`}
//                     variant="outlined"
//                     size="small"
//                     error={!!errors[`modules.${moduleIndex}.topics.${topicIndex}`]}
//                     helperText={errors[`modules.${moduleIndex}.topics.${topicIndex}`]}
//                   />
//                   <IconButton 
//                     size="small" 
//                     color="error"
//                     onClick={() => removeTopic(moduleIndex, topicIndex)}
//                     disabled={module.topics.length <= 1}
//                   >
//                     <ClearIcon fontSize="small" />
//                   </IconButton>
//                 </Box>
//               ))}
              
//               <Button
//                 startIcon={<AddIcon />}
//                 onClick={() => addTopic(moduleIndex)}
//                 size="small"
//                 sx={{ mt: 1 }}
//               >
//                 Add Topic
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
        
//         <Button
//           variant="outlined"
//           startIcon={<AddIcon />}
//           onClick={addModule}
//           className={classes.addButton}
//         >
//           Add Another Module
//         </Button>
//       </Box>

//       <Divider sx={{ my: 3 }} />
      
//       <Box className={classes.formSection}>
//         <Typography variant="h6" className={classes.sectionTitle}>
//           Recommended Projects
//         </Typography>
        
//         {formData.recommended_projects.map((project, index) => (
//           <Box key={index} className={classes.projectRow}>
//             <TextField
//               className={classes.projectField}
//               value={project}
//               onChange={(e) => handleProjectChange(index, e.target.value)}
//               placeholder={`Project ${index + 1}`}
//               variant="outlined"
//               size="small"
//             />
//             <IconButton 
//               size="small" 
//               color="error"
//               onClick={() => removeProject(index)}
//               disabled={formData.recommended_projects.length <= 1}
//             >
//               <ClearIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         ))}
        
//         <Button
//           startIcon={<AddIcon />}
//           onClick={addProject}
//           size="small"
//           sx={{ mt: 1 }}
//         >
//           Add Project
//         </Button>
//       </Box>
      
//       {errors.form && (
//         <Typography className={classes.errorText} sx={{ mt: 2 }}>
//           {errors.form}
//         </Typography>
//       )}
      
//       <Box className={classes.buttonGroup}>
//         <Button 
//           variant="outlined" 
//           color="primary"
//           onClick={onCancel}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           className={classes.saveButton}
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : 'Create Career Path'}
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default CreateCareerPath;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Grid,
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

const CreateCareerPath = ({ onSuccess, onCancel }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
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
    fetchInstitutions();
  }, []);

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
      const response = await axios.post(
        'https://lms1-1-p88i.onrender.com/api/curriculum/',
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
        message: 'Career path created successfully!',
        severity: 'success'
      });
      
      // Call the success callback with the response data
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error creating career path:', error);
      
      // Handle backend validation errors
      if (error.response?.data) {
        const backendErrors = {};
        Object.entries(error.response.data).forEach(([key, value]) => {
          backendErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setErrors(backendErrors);
      }
      
      let errorMessage = 'Failed to create career path';
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

  return (
    <Box className={classes.root}>
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
          {loading ? "Creating..." : "Create Career Path"}
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

export default CreateCareerPath;