import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
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
});

const InstitutionForm = ({
  open,
  onClose,
  onSubmit,
  selectedInstitution,
  loading,
  initialFormData = {
    name: "",
    code: "",
    address: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    established_year: "",
    city: "",
    state: "",
  }
}) => {
  const classes = useStyles();
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Update form data when selectedInstitution changes
  useEffect(() => {
    if (selectedInstitution) {
      setFormData({
        name: selectedInstitution.name || "",
        code: selectedInstitution.code || "",
        address: selectedInstitution.address || "",
        contact_email: selectedInstitution.contact_email || "",
        contact_phone: selectedInstitution.contact_phone || "",
        website: selectedInstitution.website || "",
        established_year: selectedInstitution.established_year ? selectedInstitution.established_year.toString() : "",
        city: selectedInstitution.city || "",
        state: selectedInstitution.state || "",
      });
    } else {
      setFormData(initialFormData);
    }
    setFormErrors({});
  }, [selectedInstitution, open]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.code) errors.code = "Code is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.contact_email) {
      errors.contact_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      errors.contact_email = "Invalid email format";
    }
    if (!formData.contact_phone) {
      errors.contact_phone = "Phone number is required";
    }
    if (!formData.established_year) {
      errors.established_year = "Established year is required";
    } else {
      const year = parseInt(formData.established_year);
      const currentYear = new Date().getFullYear();
      if (year < 1800 || year > currentYear) {
        errors.established_year = "Invalid year";
      }
    }
    if (!formData.city) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCloseForm = () => {
    setFormData(initialFormData);
    setFormErrors({});
    onClose();
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseForm}
      className={classes.dialog}
    >
      <DialogTitle className={classes.dialogTitle}>
        {selectedInstitution ? "Edit Institution" : "Add New Institution"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Institution Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={selectedInstitution?.total_users > 0}
              className={classes.formField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Institution Code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              error={!!formErrors.code}
              helperText={formErrors.code}
              disabled={selectedInstitution?.total_users > 0}
              className={classes.formField}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              error={!!formErrors.address}
              helperText={formErrors.address}
              multiline
              rows={2}
              className={classes.formField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              error={!!formErrors.city}
              helperText={formErrors.city}
              className={classes.formField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              error={!!formErrors.state}
              helperText={formErrors.state}
              className={classes.formField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Email"
              value={formData.contact_email}
              onChange={(e) =>
                setFormData({ ...formData, contact_email: e.target.value })
              }
              error={!!formErrors.contact_email}
              helperText={formErrors.contact_email}
              className={classes.formField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Phone"
              value={formData.contact_phone}
              onChange={(e) =>
                setFormData({ ...formData, contact_phone: e.target.value })
              }
              error={!!formErrors.contact_phone}
              helperText={formErrors.contact_phone}
              className={classes.formField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              error={!!formErrors.website}
              helperText={formErrors.website}
              className={classes.formField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Established Year"
              type="number"
              value={formData.established_year}
              onChange={(e) =>
                setFormData({ ...formData, established_year: e.target.value })
              }
              error={!!formErrors.established_year}
              helperText={formErrors.established_year}
              className={classes.formField}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button
          onClick={handleCloseForm}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          className={classes.addButton}
        >
          {loading ? "Saving..." : selectedInstitution ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstitutionForm;