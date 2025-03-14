import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BarChart as StatsIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import InstitutionStats from "./institutionstats/Institutionsstats";
import InstitutionDetails from "./InstitutionDetails";
import OverallStats from './OverallStats';
import InstitutionFilters from './InstitutionFilters';
import InstitutionForm from './InstitutionForm';
import DeleteInstitutionDialog from './DeleteInstitutionDialog';

const useStyles = makeStyles({
  root: {
    padding: "24px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",  // Changed from center to flex-start for better alignment with filters
  },
  headerTitle: {
    color: "#1a237e !important",
    fontWeight: "600 !important",
    fontSize: "24px",
  },
  headerActions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  addButton: {
    backgroundColor: "#1a237e",
    color: "#ffffff",
    padding: "8px 24px",
    "&:hover": {
      backgroundColor: "#0d147a",
    },
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  tableHeader: {
    backgroundColor: "#f8fafd",
  },
  tableHeaderCell: {
    color: "#5c6b89",
    fontWeight: 600,
    padding: "16px",
    borderBottom: "2px solid #e0e7ff",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "#f8fafd",
    },
  },
  tableCell: {
    padding: "16px",
  },
  statusChip: {
    minWidth: "80px",
    cursor: "pointer",
  },
  userCountChip: {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
    fontWeight: 500,
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
  },
  resultsInfo: {
    color: "#666666",
  },
  statsDialog: {
    "& .MuiDialog-paper": {
      maxWidth: "800px",
      width: "100%",
    },
  },
  detailsDialog: {
    "& .MuiDialog-paper": {
      maxWidth: "900px",
      width: "100%",
    },
  },
  filtersContainer: {
    marginBottom: "16px",
  },
});

const InstitutionsList = () => {
  const classes = useStyles();
  const [institutions, setInstitutions] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async (filters = {}) => {
    setLoading(true);
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.is_active !== undefined && filters.is_active !== '') 
        queryParams.append('is_active', filters.is_active);
      
      const queryString = queryParams.toString();
      const url = `http://localhost:8000/api/institutions/${queryString ? `?${queryString}` : ''}`;
      
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstitutions(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    fetchInstitutions(filters);
  };

  const handleError = (error) => {
    let errorMessage = "An error occurred";

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    // Handle specific backend error cases
    if (error.response?.status === 400) {
      if (error.response.data.name) {
        errorMessage = `Name error: ${error.response.data.name[0]}`;
      }
      if (error.response.data.code) {
        errorMessage = `Code error: ${error.response.data.code[0]}`;
      }
    }

    showAlert(errorMessage, "error");
  };

  const handleEditClick = (institution) => {
    if (!institution.is_active) {
      showAlert(
        "Cannot edit inactive institution. Please activate it first.",
        "warning"
      );
      return;
    }

    setSelectedInstitution(institution);
    setOpenForm(true);
  };
  
  const handleStatusToggle = async (institution) => {
    try {
      const token = localStorage.getItem("accessToken");
      const endpoint = `http://localhost:8000/api/institutions/${institution.id}/${institution.is_active ? "deactivate" : "activate"}/`;

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showAlert(
        response.data.message ||
          `Institution ${institution.is_active ? "deactivated" : "activated"} successfully`
      );
      fetchInstitutions(activeFilters);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const requestData = {
        ...formData,
        code: formData.code.toUpperCase(),
        established_year: parseInt(formData.established_year),
      };

      let response;
      if (selectedInstitution) {
        response = await axios.put(
          `http://localhost:8000/api/institutions/${selectedInstitution.id}/`,
          requestData,
          config
        );
        showAlert(
          response.data.message ||
            `Institution "${formData.name}" updated successfully`
        );
      } else {
        response = await axios.post(
          "http://localhost:8000/api/institutions/",
          requestData,
          config
        );
        showAlert(
          response.data.message ||
            `Institution "${formData.name}" created successfully`
        );
      }

      setOpenForm(false);
      fetchInstitutions(activeFilters);
      setSelectedInstitution(null);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedInstitution) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `http://localhost:8000/api/institutions/${selectedInstitution.id}/`,
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      showAlert(`Institution "${selectedInstitution.name}" deleted successfully`);
      setOpenDeleteDialog(false);
      setSelectedInstitution(null);
      fetchInstitutions(activeFilters);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity = "success") => {
    setAlert({
      show: true,
      message,
      severity,
    });
  };

  return (
    <Box className={classes.root}>
      <OverallStats />
      
      <Box className={classes.header}>
        <Typography variant="h5" className={classes.headerTitle}>
          Institutions Management
        </Typography>
        
        <Box className={classes.filtersContainer}>
          <InstitutionFilters onFilterChange={handleFilterChange} />
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          className={classes.addButton}
        >
          Add Institution
        </Button>
      </Box>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow className={classes.tableHeader}>
              <TableCell className={classes.tableHeaderCell}>ID</TableCell>
              <TableCell className={classes.tableHeaderCell}>Name</TableCell>
              <TableCell className={classes.tableHeaderCell}>Code</TableCell>
              <TableCell className={classes.tableHeaderCell}>Location</TableCell>
              <TableCell className={classes.tableHeaderCell}>
                Contact Info
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>Year</TableCell>
              <TableCell className={classes.tableHeaderCell}>Status</TableCell>
              <TableCell className={classes.tableHeaderCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : institutions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No institutions found matching the applied filters.
                </TableCell>
              </TableRow>
            ) : (
              institutions.map((institution) => (
                <TableRow key={institution.id} className={classes.tableRow}>
                  <TableCell className={classes.tableCell}>
                    {institution.id}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {institution.name}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {institution.code}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <div>{institution.city}</div>
                    <div>{institution.state}</div>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <div>{institution.contact_email}</div>
                    <div>{institution.contact_phone}</div>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {institution.established_year}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Chip
                      label={institution.is_active ? "Active" : "Inactive"}
                      color={institution.is_active ? "success" : "error"}
                      onClick={() => handleStatusToggle(institution)}
                      className={classes.statusChip}
                    />
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <IconButton
                      onClick={() => {
                        setSelectedInstitution(institution);
                        setOpenDetailsDialog(true);
                      }}
                      color="primary"
                      title="View details"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditClick(institution)}
                      color="primary"
                      disabled={!institution.is_active}
                      title={
                        !institution.is_active
                          ? "Cannot edit inactive institution"
                          : "Edit institution"
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedInstitution(institution);
                        setOpenDeleteDialog(true);
                      }}
                      color="error"
                      title="Delete institution"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedInstitution(institution);
                        setOpenStatsDialog(true);
                      }}
                      color="success"
                      title="View statistics"
                    >
                      <StatsIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Institution Form Dialog */}
      <InstitutionForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedInstitution(null);
        }}
        onSubmit={handleSubmit}
        selectedInstitution={selectedInstitution}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteInstitutionDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={handleDelete}
        institution={selectedInstitution}
        loading={loading}
      />

      {/* Stats Dialog */}
      <Dialog
        open={openStatsDialog}
        onClose={() => setOpenStatsDialog(false)}
        maxWidth="md"
        fullWidth
        className={classes.statsDialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          Institution Statistics
        </DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          {selectedInstitution && (
            <InstitutionStats institutionId={selectedInstitution.id} />
          )}
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => setOpenStatsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        className={classes.detailsDialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          Institution Details
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          {selectedInstitution && (
            <InstitutionDetails institutionId={selectedInstitution.id} />
          )}
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Global Alert Snackbar */}
      <Snackbar
        open={alert.show}
        autoHideDuration={6000}
        onClose={() =>
          setAlert({ show: false, message: "", severity: "success" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() =>
            setAlert({ show: false, message: "", severity: "success" })
          }
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

export default InstitutionsList;