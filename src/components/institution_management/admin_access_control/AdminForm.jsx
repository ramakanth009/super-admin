import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '12px',
      minWidth: '600px',
    },
  },
  dialogTitle: {
    backgroundColor: '#f8fafd',
    borderBottom: '1px solid #e0e7ff',
    padding: '20px 24px',
  },
  formField: {
    marginBottom: '16px',
  },
  addButton: {
    backgroundColor: '#1a237e',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#0d147a',
    },
  },
  contentPadding: {
    padding: '24px !important',
  },
  formHelper: {
    marginTop: '8px',
    color: '#666666',
  },
});

// List of available departments
const departments = [
  'Civil Engineering',
  'Information Technology',
  'Electrical and Electronics Engineering',
  'Electrical and Communication Engineering',
  'Mechanical Engineering',
  'Computer Science and Engineering',
  'Aerospace Engineering'
];

// Default permissions configuration
const DEFAULT_PERMISSIONS = {
  college: [
    'view_college_analytics',
    'manage_college_settings'
  ],
  department: [
    'view_department_analytics',
    'manage_department_students'
  ]
};

const AdminForm = ({
  open,
  onClose,
  formData,
  setFormData,
  institutions,
  loading,
  onSubmit,
  isEditing = false,
}) => {
  const classes = useStyles();
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    const errors = validateForm(formData, isEditing);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Add default permissions based on admin type before submitting
      const updatedFormData = { ...formData };
      
      // Only add default permissions for new admins
      if (!isEditing && formData.admin_type) {
        updatedFormData.default_permissions = DEFAULT_PERMISSIONS[formData.admin_type];
      }
      
      // Update the form data with default permissions
      setFormData(updatedFormData);
      
      // Pass the updated form data to parent component for submission
      onSubmit(updatedFormData);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={classes.dialog}
      maxWidth="md"
    >
      <DialogTitle className={classes.dialogTitle}>
        {isEditing ? 'Edit Admin' : 'Add New Admin'}
      </DialogTitle>
      <DialogContent className={classes.contentPadding}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading || isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              error={!!formErrors.username}
              helperText={formErrors.username}
              disabled={loading || isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={isEditing ? "New Password (optional)" : "Password"}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="caption" className={classes.formHelper}>
              {isEditing ? 'Leave blank to keep current password' : 'Password must be at least 8 characters long'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.admin_type}>
              <InputLabel>Admin Type</InputLabel>
              <Select
                value={formData.admin_type}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    admin_type: e.target.value,
                    department: e.target.value === 'college' ? '' : formData.department
                  });
                }}
                label="Admin Type"
                disabled={loading || isEditing}
              >
                <MenuItem value="college">College Admin</MenuItem>
                <MenuItem value="department">Department Admin</MenuItem>
              </Select>
              {formErrors.admin_type && (
                <FormHelperText>{formErrors.admin_type}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.institution}>
              <InputLabel>Institution</InputLabel>
              <Select
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                label="Institution"
                disabled={loading || isEditing}
              >
                {institutions.map((institution) => (
                  <MenuItem key={institution.id} value={institution.id}>
                    {institution.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.institution && (
                <FormHelperText>{formErrors.institution}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          {formData.admin_type === 'department' && (
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.department}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  label="Department"
                  disabled={loading}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.department && (
                  <FormHelperText>{formErrors.department}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          className={classes.addButton}
        >
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Admin' : 'Create Admin')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateForm = (data, isEditing) => {
  const errors = {};
  
  if (!isEditing) {  // Only validate these fields for new admin creation
    // Email validation
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (!data.username) {
      errors.username = 'Username is required';
    } else if (data.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }

    // Password validation
    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    // Admin type validation
    if (!data.admin_type) {
      errors.admin_type = 'Admin type is required';
    }

    // Institution validation
    if (!data.institution) {
      errors.institution = 'Institution is required';
    }
  } else if (data.password && data.password.length < 8) {
    // Only validate password length if a new password is provided during edit
    errors.password = 'Password must be at least 8 characters long';
  }

  // Department validation for department admin
  if (data.admin_type === 'department' && !data.department) {
    errors.department = 'Department is required for department admin';
  }

  return errors;
};

export default AdminForm;