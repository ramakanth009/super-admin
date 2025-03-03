import React from 'react';
import { makeStyles } from '@mui/styles';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Divider,
  Typography,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

const useStyles = makeStyles({
  moduleContainer: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  moduleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  topicContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  topicInput: {
    flexGrow: 1,
  },
  addButton: {
    marginTop: '16px',
    color: '#1a237e',
  },
  addModuleButton: {
    marginTop: '16px',
    color: '#1a237e',
  },
  requiredLabel: {
    color: 'red',
    marginLeft: '4px',
  },
  deleteButton: {
    marginLeft: '8px',
  },
});

const ModulesForm = ({ modules, onChange }) => {
  const classes = useStyles();

  // Add a new module
  const handleAddModule = () => {
    const updatedModules = [...modules, { name: '', topics: [''] }];
    onChange(updatedModules);
  };

  // Delete a module
  const handleDeleteModule = (moduleIndex) => {
    const updatedModules = modules.filter((_, index) => index !== moduleIndex);
    onChange(updatedModules);
  };

  // Update module name
  const handleModuleNameChange = (moduleIndex, name) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].name = name;
    onChange(updatedModules);
  };

  // Add a new topic to a module
  const handleAddTopic = (moduleIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].topics.push('');
    onChange(updatedModules);
  };

  // Update topic value
  const handleTopicChange = (moduleIndex, topicIndex, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].topics[topicIndex] = value;
    onChange(updatedModules);
  };

  // Delete a topic
  const handleDeleteTopic = (moduleIndex, topicIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].topics = updatedModules[moduleIndex].topics.filter(
      (_, index) => index !== topicIndex
    );
    onChange(updatedModules);
  };

  return (
    <Box>
      {modules.map((module, moduleIndex) => (
        <Box key={moduleIndex} className={classes.moduleContainer}>
          <Box className={classes.moduleHeader}>
            <TextField
              fullWidth
              label="Module Name"
              required
              value={module.name}
              onChange={(e) => handleModuleNameChange(moduleIndex, e.target.value)}
              placeholder="e.g., Frontend Fundamentals"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
            {modules.length > 1 && (
              <IconButton
                onClick={() => handleDeleteModule(moduleIndex)}
                className={classes.deleteButton}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <Divider sx={{ marginBottom: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Topics<span className={classes.requiredLabel}>*</span>
          </Typography>

          {module.topics.map((topic, topicIndex) => (
            <Box key={topicIndex} className={classes.topicContainer}>
              <TextField
                className={classes.topicInput}
                value={topic}
                onChange={(e) => handleTopicChange(moduleIndex, topicIndex, e.target.value)}
                placeholder="Enter a topic"
                variant="outlined"
                size="small"
                fullWidth
              />
              {module.topics.length > 1 && (
                <IconButton
                  onClick={() => handleDeleteTopic(moduleIndex, topicIndex)}
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
            onClick={() => handleAddTopic(moduleIndex)}
            className={classes.addButton}
            size="small"
          >
            Add Another Topic
          </Button>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        onClick={handleAddModule}
        className={classes.addModuleButton}
      >
        Add Another Module
      </Button>
    </Box>
  );
};

export default ModulesForm;