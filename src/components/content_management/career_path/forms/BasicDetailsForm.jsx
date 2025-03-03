import React from 'react';
import { makeStyles } from '@mui/styles';
import { 
  Grid,
  TextField,
  Box
} from '@mui/material';

const useStyles = makeStyles({
  formField: {
    marginBottom: '16px',
  },
  requiredLabel: {
    color: 'red',
    marginLeft: '4px',
  },
  formControl: {
    minWidth: '100%',
  },
});

const BasicDetailsForm = ({ formData, onChange }) => {
  const classes = useStyles();

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Role"
          name="role"
          variant="outlined"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g., Full Stack Web Developer"
          required
          className={classes.formField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          variant="outlined"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Full Stack Web Development"
          required
          className={classes.formField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          name="description"
          variant="outlined"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter a comprehensive description of the career path..."
          required
          multiline
          rows={4}
          className={classes.formField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default BasicDetailsForm;