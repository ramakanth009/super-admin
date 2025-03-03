import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Grid,
  TextField,
  Button,
  FormHelperText,
  Box,
  Tooltip,
  IconButton,
  InputAdornment
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import axios from 'axios';

const useStyles = makeStyles({
  formField: {
    marginBottom: '16px',
    width: '100%',
  },
  requiredLabel: {
    color: 'red',
    marginLeft: '4px',
  },
  browseButton: {
    marginLeft: '16px !important',
  },
  fileUpload: {
    display: 'none',
  },
  helpIcon: {
    fontSize: '16px',
    color: '#666',
  },
});

const SupportingMaterialsForm = ({ formData, onChange }) => {
  const classes = useStyles();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, you'd fetch institutions from the API
    // For demo purposes, we'll use mock data
    setInstitutions([
      { id: 9, name: 'Example University' },
      { id: 10, name: 'Sample College' }
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleFileChange = (e) => {
    // In a real app, you'd upload the file to a server
    // For demo purposes, we'll just update the URL field
    const file = e.target.files[0];
    if (file) {
      // Mock file upload - in real app, you'd upload to server and get URL
      const mockUrl = `https://example.com/curriculum/${file.name}`;
      onChange('file_url', mockUrl);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center">
          <TextField
            className={classes.formField}
            label="File URL"
            name="file_url"
            variant="outlined"
            value={formData.file_url}
            onChange={handleChange}
            placeholder="e.g., https://example.com/curriculum/webdev.pdf"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="URL for curriculum resources, documents, or materials">
                    <IconButton edge="end">
                      <HelpOutlineIcon className={classes.helpIcon} />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            component="label"
            className={classes.browseButton}
          >
            Browse
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
            />
          </Button>
        </Box>
        <FormHelperText>
          Provide a URL to supporting materials for the curriculum
        </FormHelperText>
      </Grid>

      <Grid item xs={12}>
        <TextField
          className={classes.formField}
          label="Institution ID"
          name="institution"
          variant="outlined"
          value={formData.institution}
          onChange={handleChange}
          placeholder="e.g., 10"
          required
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="ID of the institution this curriculum belongs to">
                  <IconButton edge="end">
                    <HelpOutlineIcon className={classes.helpIcon} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <FormHelperText>
          Enter the ID of the institution (e.g., 9 for Example University, 10 for Sample College)
        </FormHelperText>
      </Grid>
    </Grid>
  );
};

export default SupportingMaterialsForm;