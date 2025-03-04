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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
  DialogContentText,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  School as CurriculumIcon,
  Timeline as ProgressIcon,
  // Notifications as NotificationIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import ViewAssessments from "./view_assessments/Viewassessment";
import ViewCurriculum from "./view_curriculum/Viewcurriculum";
import ViewProgress from "./view_progress/Viewprogress";
// import ViewNotifications from "./view_notifications/viewnotifications";
import StudentStats from './StudentStats';
import StudentForm from './StudentForm';
import StudentFilters from './StudentFilters';

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
    alignItems: "center",
  },
  headerTitle: {
    color: "#1a237e !important",
    fontWeight: "600 !important",
    fontSize: "24px",
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
  dialog: {
    "& .MuiDialog-paper": {
      borderRadius: "12px",
      minWidth: "600px",
    },
  },
  dialogTitle: {
    backgroundColor: "#f8fafd",
    borderBottom: "1px solid #e0e7ff",
    padding: "20px 24px",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#d32f2f",
    },
  },
  profileActionButton: {
    marginLeft: "8px",
  },
  warningDialog: {
    "& .MuiDialog-paper": {
      borderRadius: "12px",
      minWidth: "400px",
    },
  },
});

const StudentManagement = () => {
  const classes = useStyles();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openAssessments, setOpenAssessments] = useState(false);
  const [openCurriculum, setOpenCurriculum] = useState(false);
  const [openProgress, setOpenProgress] = useState(false);
  // const [openNotifications, setOpenNotifications] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProfileRequestDialog, setOpenProfileRequestDialog] = useState(false);
  const [openDisableProfileDialog, setOpenDisableProfileDialog] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    institution: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });

  const [profileRequestData, setProfileRequestData] = useState({
    duration_hours: 24,
    reason: "",
  });

  const [disableProfileReason, setDisableProfileReason] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchInstitutions();
  }, []);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://lms1-1-p88i.onrender.com/api/student-management/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("https://lms1-1-p88i.onrender.com/api/institutions/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setInstitutions(data);
    } catch (error) {
      setError("Failed to fetch institutions");
    }
  };

  const validateForm = (data) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!data.username) {
      errors.username = "Username is required";
    } else if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters long";
    }

    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (!data.institution) {
      errors.institution = "Institution is required";
    }

    return errors;
  };

  const handleCreateStudent = async () => {
    try {
      const errors = validateForm(formData);
      setFormErrors(errors);

      if (Object.keys(errors).length > 0) {
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://lms1-1-p88i.onrender.com/api/student-management/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.detail || "Failed to create student");
      }

      setAlert({
        show: true,
        message: "Student created successfully",
        severity: "success",
      });

      fetchStudents();
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      setAlert({
        show: true,
        message: error.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (studentId, currentStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(
        `https://lms1-1-p88i.onrender.com/api/student-management/${studentId}/update_status/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_active: !currentStatus }),
        }
      );
      fetchStudents();
    } catch (error) {
      setError("Failed to update student status");
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://lms1-1-p88i.onrender.com/api/student-management/${selectedStudent.id}/delete_student/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete student");

      setStudents(students.filter((s) => s.id !== selectedStudent.id));
      setOpenDeleteDialog(false);
      setSelectedStudent(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileRequest = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://lms1-1-p88i.onrender.com/api/student-management/${selectedStudent.id}/handle_profile_request/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileRequestData),
        }
      );

      if (!response.ok) throw new Error("Failed to process profile request");

      fetchStudents();
      setOpenProfileRequestDialog(false);
      setSelectedStudent(null);
      setProfileRequestData({ duration_hours: 24, reason: "" });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://lms1-1-p88i.onrender.com/api/student-management/${selectedStudent.id}/disable_profile_update/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: disableProfileReason }),
        }
      );

      if (!response.ok) throw new Error("Failed to disable profile updates");

      fetchStudents();
      setOpenDisableProfileDialog(false);
      setSelectedStudent(null);
      setDisableProfileReason("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...students];
    
    if (filters.department) {
      filtered = filtered.filter(student => student.department === filters.department);
    }
    
    if (filters.institution_name) {
      filtered = filtered.filter(student => 
        student.institution_details?.name?.toLowerCase().includes(filters.institution_name.toLowerCase())
      );
    }
    
    if (filters.is_active !== '') {
      filtered = filtered.filter(student => 
        student.is_active === (filters.is_active === 'true')
      );
    }
    
    if (filters.profile_completed !== '') {
      filtered = filtered.filter(student => 
        student.profile_completed === (filters.profile_completed === 'true')
      );
    }
    
    if (filters.can_update_profile !== '') {
      filtered = filtered.filter(student => 
        student.can_update_profile === (filters.can_update_profile === 'true')
      );
    }
    
    setFilteredStudents(filtered);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      password: "",
      institution: "",
    });
    setFormErrors({});
  };

  return (
    <Box className={classes.root}>
      {/* Replace Stats Section with StudentStats component */}
      <StudentStats />

      {/* Header Section */}
      <Box className={classes.header}>
        <Typography className={classes.headerTitle}>
          Student Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className={classes.addButton}
        >
          Add Student
        </Button>
      </Box>

      {/* Add StudentFilters component */}
      <StudentFilters onFilterChange={handleFilterChange} />

      {/* Main Table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow className={classes.tableHeader}>
              <TableCell className={classes.tableHeaderCell}>ID</TableCell>
              <TableCell className={classes.tableHeaderCell}>
                Username
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>Email</TableCell>
              <TableCell className={classes.tableHeaderCell}>
                Institution
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>
                Department
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>Status</TableCell>
              <TableCell className={classes.tableHeaderCell}>Profile</TableCell>
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
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No students found matching the filters
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id} className={classes.tableRow}>
                  <TableCell className={classes.tableCell}>
                    {student.id}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {student.username}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {student.email}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {student.institution_details?.name}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {student.department || "Not Set"}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Chip
                      label={student.is_active ? "Active" : "Inactive"}
                      color={student.is_active ? "success" : "error"}
                      onClick={() =>
                        handleStatusToggle(student.id, student.is_active)
                      }
                    />
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {student.can_update_profile ? (
                      <Chip
                        label="Can Update"
                        color="success"
                        onClick={() => {
                          setSelectedStudent(student);
                          setOpenDisableProfileDialog(true);
                        }}
                        icon={<CheckCircleIcon />}
                      />
                    ) : (
                      <Chip
                        label="Locked"
                        color="default"
                        onClick={() => {
                          setSelectedStudent(student);
                          setOpenProfileRequestDialog(true);
                        }}
                        icon={<BlockIcon />}
                      />
                    )}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <IconButton
                      color="primary"
                      title="View Assessments"
                      onClick={() => {
                        setSelectedStudent(student);
                        setOpenAssessments(true);
                      }}
                    >
                      <AssessmentIcon />
                    </IconButton>

                    <IconButton
                      color="secondary"
                      title="View Curriculum"
                      onClick={() => {
                        setSelectedStudent(student);
                        setOpenCurriculum(true);
                      }}
                    >
                      <CurriculumIcon />
                    </IconButton>

                    <IconButton
                      color="info"
                      title="View Progress"
                      onClick={() => {
                        setSelectedStudent(student);
                        setOpenProgress(true);
                      }}
                    >
                      <ProgressIcon />
                    </IconButton>

                    {/* <IconButton
                      color="warning"
                      title="View Notifications"
                      onClick={() => {
                        setSelectedStudent(student);
                        setOpenNotifications(true);
                      }}
                    >
                      <NotificationIcon />
                    </IconButton> */}

                    <IconButton
                      color="error"
                      title="Delete Student"
                      onClick={() => {
                        setSelectedStudent(student);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Import the StudentForm component */}
      <StudentForm
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        institutions={institutions}
        loading={loading}
        onSubmit={handleCreateStudent}
      />

      {/* Profile Request Dialog */}
      <Dialog
        open={openProfileRequestDialog}
        onClose={() => setOpenProfileRequestDialog(false)}
        className={classes.dialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          Enable Profile Updates
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              fullWidth
              type="number"
              label="Duration (hours)"
              value={profileRequestData.duration_hours}
              onChange={(e) =>
                setProfileRequestData({
                  ...profileRequestData,
                  duration_hours: parseInt(e.target.value),
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason"
              value={profileRequestData.reason}
              onChange={(e) =>
                setProfileRequestData({
                  ...profileRequestData,
                  reason: e.target.value,
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => setOpenProfileRequestDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleProfileRequest}
            variant="contained"
            className={classes.addButton}
            disabled={loading}
          >
            {loading ? "Processing..." : "Enable Updates"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Disable Profile Dialog */}
      <Dialog
        open={openDisableProfileDialog}
        onClose={() => setOpenDisableProfileDialog(false)}
        className={classes.dialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          Disable Profile Updates
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason"
            value={disableProfileReason}
            onChange={(e) => setDisableProfileReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => setOpenDisableProfileDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDisableProfile}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? "Processing..." : "Disable Updates"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        className={classes.warningDialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          Delete Student Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ pt: 2 }}>
            Are you sure you want to delete {selectedStudent?.email}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            className={classes.deleteButton}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Other Dialogs */}
      <ViewAssessments
        studentId={selectedStudent?.id}
        open={openAssessments}
        onClose={() => {
          setOpenAssessments(false);
          setSelectedStudent(null);
        }}
      />

      <ViewCurriculum
        studentId={selectedStudent?.id}
        open={openCurriculum}
        onClose={() => {
          setOpenCurriculum(false);
          setSelectedStudent(null);
        }}
      />

      <ViewProgress
        studentId={selectedStudent?.id}
        open={openProgress}
        onClose={() => {
          setOpenProgress(false);
          setSelectedStudent(null);
        }}
      />

      {/* <ViewNotifications
        studentId={selectedStudent?.id}
        open={openNotifications}
        onClose={() => {
          setOpenNotifications(false);
          setSelectedStudent(null);
        }}
      /> */}

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>

      {/* Success/Error Alert Snackbar */}
      <Snackbar
        open={alert.show}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, show: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, show: false })}
          severity={alert.severity}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentManagement;