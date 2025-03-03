import React from 'react';
import { makeStyles } from '@mui/styles';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

const useStyles = makeStyles({
  projectsContainer: {
    padding: '16px',
  },
  projectContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  projectInput: {
    flexGrow: 1,
  },
  addButton: {
    marginTop: '8px',
    color: '#1a237e',
  },
  deleteButton: {
    marginLeft: '8px',
  },
});

const ProjectsForm = ({ projects, onChange }) => {
  const classes = useStyles();

  // Add a new project
  const handleAddProject = () => {
    onChange([...projects, '']);
  };

  // Update project value
  const handleProjectChange = (index, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = value;
    onChange(updatedProjects);
  };

  // Delete a project
  const handleDeleteProject = (index) => {
    const updatedProjects = projects.filter((_, projectIndex) => projectIndex !== index);
    onChange(updatedProjects);
  };

  return (
    <Box className={classes.projectsContainer}>
      {projects.map((project, index) => (
        <Box key={index} className={classes.projectContainer}>
          <TextField
            className={classes.projectInput}
            value={project}
            onChange={(e) => handleProjectChange(index, e.target.value)}
            placeholder="e.g., Personal Portfolio Website"
            variant="outlined"
            size="small"
            fullWidth
          />
          {projects.length > 1 && (
            <IconButton
              onClick={() => handleDeleteProject(index)}
              className={classes.deleteButton}
              color="error"
              size="small"
            >
              <ClearIcon />
            </IconButton>
          )}
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddProject}
        className={classes.addButton}
      >
        Add Another Project
      </Button>
    </Box>
  );
};

export default ProjectsForm;