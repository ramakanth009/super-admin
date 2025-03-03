import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Paper
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// Updated permissions based on backend AdminPermission model
const PERMISSIONS_CONFIG = {
  COLLEGE_ADMIN: {
    DEFAULT: [
      'view_college_analytics',
      'manage_college_settings'
    ],
    OPTIONAL: [
      'manage_career_paths',
      'manage_assessments'
    ]
  },
  DEPARTMENT_ADMIN: {
    DEFAULT: [
      'view_department_analytics',
      'manage_department_students'
    ],
    OPTIONAL: [
      'edit_career_paths',
      'edit_assessments'
    ]
  }
};

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
    padding: '24px !important',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    color: '#1a237e',
    marginBottom: '16px',
    fontWeight: 600,
  },
  permissionGroup: {
    marginBottom: '16px',
  },
  defaultPermission: {
    opacity: 0.7,
  },
  divider: {
    margin: '24px 0',
  },
  infoAlert: {
    marginBottom: '16px',
  },
  submitButton: {
    backgroundColor: '#1a237e',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#0d147a',
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  refreshButton: {
    marginLeft: '10px',
    fontSize: '0.8rem',
  }
});

const AdminPermissionsDialog = ({ open, onClose, selectedAdmin, onSuccess }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [optionalPermissionsState, setOptionalPermissionsState] = useState({});
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  useEffect(() => {
    if (open) {
      setError(null);
      fetchAdminPermissions();
    }
  }, [open]);

  const fetchAdminPermissions = async () => {
    if (!selectedAdmin || !selectedAdmin.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.get(
        `http://localhost:8000/api/admin-management/${selectedAdmin.id}/permissions/`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Using the new API response format from the documentation
      const permissionsResponse = response.data.permissions || [];
      
      // Extract just the permission names that are assigned
      const assignedPermissions = permissionsResponse
        .filter(perm => perm.is_assigned)
        .map(perm => perm.permission);
      
      setCurrentPermissions(assignedPermissions);
      
      const role = selectedAdmin.role === 'college_admin' ? 'COLLEGE_ADMIN' : 'DEPARTMENT_ADMIN';
      const optionalPerms = PERMISSIONS_CONFIG[role].OPTIONAL;
      
      // Set state for optional permissions based on what's currently assigned
      const optionalState = {};
      optionalPerms.forEach(perm => {
        // Check if this optional permission is currently assigned
        const foundPerm = permissionsResponse.find(p => p.permission === perm);
        optionalState[perm] = foundPerm ? foundPerm.is_assigned : false;
      });
      
      setOptionalPermissionsState(optionalState);
      setLastRefreshed(new Date());
      setRefreshing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permission) => {
    setOptionalPermissionsState(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const role = selectedAdmin.role === 'college_admin' ? 'COLLEGE_ADMIN' : 'DEPARTMENT_ADMIN';
      const defaultPerms = PERMISSIONS_CONFIG[role].DEFAULT;
      
      const selectedOptionalPerms = Object.entries(optionalPermissionsState)
        .filter(([_, isSelected]) => isSelected)
        .map(([perm]) => perm);
      
      const allPermissions = [...defaultPerms, ...selectedOptionalPerms];

      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post(
        `http://localhost:8000/api/admin-management/${selectedAdmin.id}/manage_permissions/`,
        { permissions: allPermissions },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      showAlert(response.data.message || 'Permissions updated successfully');
      
      if (onSuccess) {
        onSuccess({
          adminId: selectedAdmin.id,
          permissions: allPermissions
        });
      }
      
      await fetchAdminPermissions();
      
      setTimeout(() => {
        if (open) onClose();
      }, 1500);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update permissions';
      showAlert(errorMsg, 'error');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const refreshPermissions = () => {
    setRefreshing(true);
    fetchAdminPermissions();
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
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

  if (!selectedAdmin) return null;

  const role = selectedAdmin.role === 'college_admin' ? 'COLLEGE_ADMIN' : 'DEPARTMENT_ADMIN';
  const { DEFAULT: defaultPermissions, OPTIONAL: optionalPermissions } = PERMISSIONS_CONFIG[role];

  return (
    <>
      <Dialog
        open={open}
        onClose={() => !loading && onClose()}
        className={classes.dialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className={classes.dialogTitle}>
          Manage Permissions - {selectedAdmin.email}
        </DialogTitle>

        <DialogContent className={classes.contentPadding}>
          {error && (
            <Alert 
              severity="error" 
              className={classes.infoAlert}
              action={
                <Button color="inherit" size="small" onClick={refreshPermissions}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Box className={classes.loadingContainer}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box className={classes.section}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" className={classes.sectionTitle}>
                    Default Permissions
                  </Typography>
                  {!loading && (
                    <Button 
                      color="primary" 
                      size="small" 
                      onClick={refreshPermissions}
                      disabled={refreshing}
                      className={classes.refreshButton}
                    >
                      {refreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  )}
                </Box>
                <FormGroup className={classes.permissionGroup}>
                  {defaultPermissions.map(permission => (
                    <FormControlLabel
                      key={permission}
                      control={<Checkbox checked disabled />}
                      label={formatPermissionLabel(permission)}
                      className={classes.defaultPermission}
                    />
                  ))}
                </FormGroup>
                <Typography variant="caption" color="textSecondary">
                  These permissions are always enabled and cannot be changed.
                </Typography>
              </Box>

              <Divider className={classes.divider} />

              <Box>
                <Typography variant="h6" className={classes.sectionTitle}>
                  Optional Permissions
                </Typography>
                <Alert severity="info" className={classes.infoAlert}>
                  Select additional permissions for this {selectedAdmin.role === 'college_admin' ? 'college' : 'department'} admin
                </Alert>
                <FormGroup>
                  {optionalPermissions.map(permission => (
                    <FormControlLabel
                      key={permission}
                      control={
                        <Checkbox
                          checked={!!optionalPermissionsState[permission]}
                          onChange={() => handlePermissionToggle(permission)}
                          disabled={loading}
                        />
                      }
                      label={
                        <Box component="span">
                          {formatPermissionLabel(permission)}
                          {optionalPermissionsState[permission] && 
                            <Typography component="span" color="primary" sx={{ ml: 1, fontSize: '0.75rem' }}>
                              (enabled)
                            </Typography>
                          }
                        </Box>
                      }
                    />
                  ))}
                </FormGroup>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Current enabled optional permissions: {Object.entries(optionalPermissionsState)
                    .filter(([_, isEnabled]) => isEnabled)
                    .map(([perm]) => formatPermissionLabel(perm))
                    .join(', ') || 'None'}
                </Alert>
                <Typography variant="caption" color="textSecondary">
                  Last updated permissions from server: {refreshing ? 'Refreshing...' : lastRefreshed ? lastRefreshed.toLocaleTimeString() : 'Just now'}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            className={classes.submitButton}
          >
            {loading ? 'Updating...' : 'Update Permissions'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.show}
        autoHideDuration={6000}
        onClose={() => setAlert({ show: false, message: '', severity: 'success' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlert({ show: false, message: '', severity: 'success' })}
          severity={alert.severity}
          elevation={6}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminPermissionsDialog;