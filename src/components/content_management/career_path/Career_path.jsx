import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
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
import CareerPathList from './CareerPathList';
import CreateCareerPath from './CreateCareerPath';
import UpdateCareerPath from './UpdateCareerPath';
import CareerPathDetails from './CareerPathDetails';
import CareerPathFilters from './CareerPathFilters';
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

const CareerPath = () => {
  const classes = useStyles();
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
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
    fetchCurriculums();
  }, []);

  const fetchCurriculums = async (filterParams = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      const appliedFilters = { ...filters, ...filterParams };
      
      if (appliedFilters.role) queryParams.append('role', appliedFilters.role);
      if (appliedFilters.institution) queryParams.append('institution', appliedFilters.institution);
      
      const queryString = queryParams.toString();
      const url = `http://localhost:8000/api/curriculum/${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCurriculums(response.data);
    } catch (error) {
      console.error('Error fetching curriculums:', error);
      showAlert('Failed to fetch career paths', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCurriculums();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchCurriculums(newFilters);
  };

  const handleCreateCareerPath = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleEditCareerPath = (curriculum) => {
    setSelectedCurriculum(curriculum);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedCurriculum(null);
  };

  const handleCareerPathCreated = () => {
    setOpenCreateDialog(false);
    fetchCurriculums();
    showAlert('Career path created successfully', 'success');
  };

  const handleCareerPathUpdated = () => {
    setOpenEditDialog(false);
    fetchCurriculums();
    showAlert('Career path updated successfully', 'success');
  };

  const handleViewDetails = (curriculum) => {
    setSelectedCurriculum(curriculum);
    setViewingDetails(true);
  };

  const handleCloseDetails = () => {
    setViewingDetails(false);
    setSelectedCurriculum(null);
  };

  const handleDeleteCareerPath = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8000/api/curriculum/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchCurriculums();
      showAlert('Career path deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting career path:', error);
      showAlert('Failed to delete career path', 'error');
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
          Career Path Management
        </Typography>
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCareerPath}
            className={classes.addButton}
          >
            Create Career Path
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
        <CareerPathFilters onFilterChange={handleFilterChange} />
      </Box>

      <Box className={classes.content}>
        {loading ? (
          <Box className={classes.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : (
          <CareerPathList 
            curriculums={curriculums} 
            onViewDetails={handleViewDetails} 
            onDelete={handleDeleteCareerPath}
            onEdit={handleEditCareerPath}
          />
        )}
      </Box>

      {/* Create Career Path Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={handleCloseCreateDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create New Career Path</DialogTitle>
        <DialogContent>
          <CreateCareerPath 
            onSuccess={handleCareerPathCreated} 
            onCancel={handleCloseCreateDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Career Path Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Career Path</DialogTitle>
        <DialogContent>
          {selectedCurriculum && (
            <UpdateCareerPath 
              curriculum={selectedCurriculum}
              onSuccess={handleCareerPathUpdated} 
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Career Path Details Dialog */}
      <Dialog 
        open={viewingDetails} 
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Career Path Details</DialogTitle>
        <DialogContent>
          {selectedCurriculum && (
            <CareerPathDetails curriculum={selectedCurriculum} />
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

export default CareerPath;