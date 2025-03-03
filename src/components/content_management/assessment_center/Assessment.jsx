import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import AssessmentList from './AssessmentList';
import CreateAssessment from './CreateAssessment';
import UpdateAssessment from './UpdateAssessment';
import AssessmentDetails from './AssessmentDetails';
import AssessmentFilters from './AssessmentFilters';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    padding: '24px',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#1a237e',
    fontWeight: 600,
    fontSize: '24px',
  },
  tabsContainer: {
    marginBottom: '24px',
  },
  tab: {
    fontWeight: 500,
  },
  addButton: {
    backgroundColor: '#1a237e',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#0d147a',
    },
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    padding: '20px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  filtersContainer: {
    marginBottom: '16px',
  },
  refreshButton: {
    marginLeft: '16px',
  },
});

const AssessmentCenter = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [filters, setFilters] = useState({
    role: '',
    institution: ''
  });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async (filterParams = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      const appliedFilters = { ...filters, ...filterParams };
      
      if (appliedFilters.role) queryParams.append('role', appliedFilters.role);
      if (appliedFilters.institution) queryParams.append('institution', appliedFilters.institution);
      
      const queryString = queryParams.toString();
      const url = `http://localhost:8000/api/assessments/${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAssessments(response.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      showAlert('Failed to fetch assessments', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAssessments();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchAssessments(newFilters);
  };

  const handleCreateAssessment = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleEditAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedAssessment(null);
  };

  const handleAssessmentCreated = () => {
    setOpenCreateDialog(false);
    fetchAssessments();
    showAlert('Assessment created successfully', 'success');
  };

  const handleAssessmentUpdated = () => {
    setOpenEditDialog(false);
    fetchAssessments();
    showAlert('Assessment updated successfully', 'success');
  };

  const handleViewDetails = (assessment) => {
    setSelectedAssessment(assessment);
    setViewingDetails(true);
  };

  const handleCloseDetails = () => {
    setViewingDetails(false);
    setSelectedAssessment(null);
  };

  const handleDeleteAssessment = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8000/api/assessments/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchAssessments();
      showAlert('Assessment deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting assessment:', error);
      showAlert('Failed to delete assessment', 'error');
    }
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h5" className={classes.headerTitle}>
          Assessment Center
        </Typography>
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateAssessment}
            className={classes.addButton}
          >
            Create Assessment
          </Button>
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing || loading}
            color="primary"
            className={classes.refreshButton}
          >
            {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Box>
      </Box>

      <Box className={classes.filtersContainer}>
        <AssessmentFilters onFilterChange={handleFilterChange} />
      </Box>

      <Box className={classes.content}>
        {loading ? (
          <Box className={classes.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : (
          <AssessmentList 
            assessments={assessments} 
            onViewDetails={handleViewDetails} 
            onDelete={handleDeleteAssessment}
            onEdit={handleEditAssessment}
          />
        )}
      </Box>

      {/* Create Assessment Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={handleCloseCreateDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create New Assessment</DialogTitle>
        <DialogContent>
          <CreateAssessment 
            onSuccess={handleAssessmentCreated} 
            onCancel={handleCloseCreateDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Assessment Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Assessment</DialogTitle>
        <DialogContent>
          {selectedAssessment && (
            <UpdateAssessment 
              assessment={selectedAssessment}
              onSuccess={handleAssessmentUpdated} 
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Assessment Details Dialog */}
      <Dialog 
        open={viewingDetails} 
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Assessment Details</DialogTitle>
        <DialogContent>
          {selectedAssessment && (
            <AssessmentDetails assessment={selectedAssessment} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          elevation={6} 
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssessmentCenter;