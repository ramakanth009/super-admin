import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Box,
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
  contentPadding: {
    padding: '24px',
  },
  label: {
    color: '#666',
    fontWeight: 500,
    marginBottom: '4px',
  },
  value: {
    color: '#1a237e',
    fontWeight: 600,
  },
  sectionTitle: {
    color: '#1a237e',
    marginBottom: '16px',
  },
  permissionChip: {
    margin: '4px',
  },
  permissionsSection: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f8fafd',
    borderRadius: '8px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  }
});

const ViewAdminDialog = ({ open, onClose, admin }) => {
  const classes = useStyles();
  const [adminDetails, setAdminDetails] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (admin && open) {
      setPermissions([]);
      setError(null);
      fetchAdminDetails();
    }
  }, [admin, open]);

  const fetchAdminDetails = async () => {
    if (!admin || !admin.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      
      // Fetch admin details
      const detailsResponse = await axios.get(
        `http://localhost:8000/api/admin-management/${admin.id}/`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setAdminDetails(detailsResponse.data);
      
      // Fetch permissions
      const permissionsResponse = await axios.get(
        `http://localhost:8000/api/admin-management/${admin.id}/permissions/`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Extract permissions from the response according to the API format
      const permissionsData = permissionsResponse.data?.permissions || [];
      
      // Extract just the permission names for display
      const activePermissions = permissionsData
        .filter(perm => perm.is_assigned)
        .map(perm => perm.permission);
      
      setPermissions(activePermissions);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const formatPermissionLabel = (permission) => {
    if (typeof permission !== 'string') {
      return String(permission);
    }
    
    return permission
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Use adminDetails if available, otherwise fall back to the admin prop
  const displayAdmin = adminDetails || admin;

  if (!displayAdmin) return null;

  if (loading) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className={classes.dialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          Admin Details
        </DialogTitle>
        <DialogContent className={classes.contentPadding}>
          <Box className={classes.loadingContainer}>
            <CircularProgress />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={classes.dialog}
    >
      <DialogTitle className={classes.dialogTitle}>
        Admin Details
      </DialogTitle>
      <DialogContent className={classes.contentPadding}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Email</Typography>
                <Typography className={classes.value}>{displayAdmin.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Username</Typography>
                <Typography className={classes.value}>{displayAdmin.username}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Role</Typography>
                <Typography className={classes.value}>
                  {displayAdmin.role === 'college_admin' ? 'College Admin' : 'Department Admin'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Status</Typography>
                <Chip
                  label={displayAdmin.is_active ? 'Active' : 'Inactive'}
                  color={displayAdmin.is_active ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Institution Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Institution Name</Typography>
                <Typography className={classes.value}>
                  {displayAdmin.institution_details?.name || displayAdmin.institution?.name || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Institution Code</Typography>
                <Typography className={classes.value}>
                  {displayAdmin.institution_details?.code || displayAdmin.institution?.code || '-'}
                </Typography>
              </Grid>
              {displayAdmin.department && (
                <Grid item xs={12}>
                  <Typography className={classes.label}>Department</Typography>
                  <Typography className={classes.value}>{displayAdmin.department}</Typography>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box className={classes.permissionsSection}>
              <Typography variant="h6" className={classes.sectionTitle}>
                Permissions
              </Typography>
              {permissions.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No permissions assigned
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {permissions.map((permission, index) => (
                    <Chip
                      key={index}
                      label={formatPermissionLabel(permission)}
                      className={classes.permissionChip}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAdminDialog;