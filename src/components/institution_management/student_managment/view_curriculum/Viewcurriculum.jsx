import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Assignment as AssignmentIcon,
  Folder as FolderIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

const useStyles = makeStyles({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '12px',
      minWidth: '800px',
    },
  },
  dialogTitle: {
    backgroundColor: '#1a237e',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  content: {
    padding: '24px',
  },
  accordion: {
    marginBottom: '16px !important',
    border: '1px solid #e0e0e0 !important',
    borderRadius: '8px !important',
    '&:before': {
      display: 'none !important',
    },
  },
  accordionSummary: {
    backgroundColor: '#f8fafd',
    borderRadius: '8px 8px 0 0',
  },
  moduleTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  },
  roleChip: {
    marginLeft: 'auto',
  },
  topic: {
    marginBottom: '8px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  projectSection: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f8fafd',
    borderRadius: '4px',
  },
  projectList: {
    marginTop: '8px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
  },
  emptyIcon: {
    fontSize: '48px !important',
    color: '#cccccc',
    marginBottom: '16px',
  },
  fileUrl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#1a237e',
    textDecoration: 'none',
    marginTop: '16px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  divider: {
    margin: '16px 0 !important',
  },
  topicChip: {
    margin: '4px !important',
  },
  contentDescription: {
    color: '#666666',
    marginBottom: '16px',
  },
});

const ViewCurriculum = ({ studentId, open, onClose }) => {
  const classes = useStyles();
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && studentId) {
      fetchCurriculum();
    }
  }, [studentId, open]);

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(
        `https://lms1-1-p88i.onrender.com/api/student-management/${studentId}/curriculum/`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Student profile not found');
      }

      const data = await response.json();
      // Using the structure from the API documentation
      setCurriculum(data.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      student: 'primary',
      software_developer: 'success',
      data_scientist: 'warning',
      network_engineer: 'info',
      default: 'default'
    };
    return colors[role] || colors.default;
  };

  const formatRole = (role) => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={classes.dialog}
    >
      <DialogTitle className={classes.dialogTitle}>
        <SchoolIcon />
        Student Curriculum
      </DialogTitle>

      <DialogContent className={classes.content}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : curriculum.length === 0 ? (
          <Box className={classes.emptyState}>
            <SchoolIcon className={classes.emptyIcon} />
            <Typography variant="h6" color="textSecondary">
              No curriculum found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              No curriculum has been assigned to this student yet
            </Typography>
          </Box>
        ) : (
          curriculum.map((item) => (
            <Accordion key={item.id} className={classes.accordion}>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                className={classes.accordionSummary}
              >
                <Box className={classes.moduleTitle}>
                  <FolderIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {item.title}
                  </Typography>
                  <Chip 
                    label={formatRole(item.role)}
                    color={getRoleColor(item.role)}
                    size="small"
                    className={classes.roleChip}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {item.description && (
                  <Typography className={classes.contentDescription}>
                    {item.description}
                  </Typography>
                )}

                {item.content.modules && (
                  <>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Modules
                    </Typography>
                    <List>
                      {item.content.modules.map((module, moduleIndex) => (
                        <Paper key={moduleIndex} className={classes.topic}>
                          <ListItem>
                            <ListItemIcon>
                              {module.completed ? (
                                <CheckCircleIcon color="success" />
                              ) : (
                                <RadioButtonUncheckedIcon color="disabled" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={module.name}
                              secondary={
                                <Box mt={1}>
                                  {module.topics.map((topic, topicIndex) => (
                                    <Chip
                                      key={topicIndex}
                                      label={topic}
                                      size="small"
                                      className={classes.topicChip}
                                      icon={<CodeIcon />}
                                    />
                                  ))}
                                </Box>
                              }
                            />
                          </ListItem>
                        </Paper>
                      ))}
                    </List>
                  </>
                )}

                {item.content.recommended_projects && (
                  <>
                    <Divider className={classes.divider} />
                    <Box className={classes.projectSection}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Recommended Projects
                      </Typography>
                      <List className={classes.projectList}>
                        {item.content.recommended_projects.map((project, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <AssignmentIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={project} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </>
                )}

                {item.file_url && (
                  <a 
                    href={item.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={classes.fileUrl}
                  >
                    <LinkIcon />
                    <Typography>Download Resources</Typography>
                  </a>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCurriculum;
