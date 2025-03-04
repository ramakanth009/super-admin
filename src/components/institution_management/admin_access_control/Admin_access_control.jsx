import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

// Import existing components
import AdminForm from "./AdminForm";
import AdminPermissionsDialog from "./AdminPermissionsDialog";
import ViewAdminDialog from "./ViewAdminDialog";
import AdminFilters from "./AdminFilters";
import AdminStats from "./AdminStats";

// Import new components
import AdminList from "./AdminList";
import UsernameEditDialog from "./UsernameEditDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

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
    alignItems: "flex-start",
  },
  headerTitle: {
    color: "#1a237e",
    fontWeight: 600,
    fontSize: "24px",
  },
  addButton: {
    backgroundColor: "#1a237e",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#0d147a",
    },
  },
  headerContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    flex: 1,
  },
  filterSection: {
    marginBottom: "24px",
  },
});

const ADMIN_API_BASE = "https://lms1-1-p88i.onrender.com/api/admin-management";

const AdminAccessControl = () => {
  const classes = useStyles();
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAdminId, setLoadingAdminId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editingError, setEditingError] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });
  const [activeFilters, setActiveFilters] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    admin_type: "",
    institution: "",
    department: "",
    permissions: [],
  });

  useEffect(() => {
    fetchAdmins();
    fetchInstitutions();
  }, []);

  const fetchAdmins = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.is_active !== undefined && filters.is_active !== '') 
        queryParams.append('is_active', filters.is_active);
      if (filters.institution_name) 
        queryParams.append('institution_name', filters.institution_name);
      
      const queryString = queryParams.toString();
      const url = `${ADMIN_API_BASE}/${queryString ? `?${queryString}` : ''}`;
      
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Ensure we're getting the full response data including nested institution details
      const adminList = response.data.results || response.data;
      setAdmins(Array.isArray(adminList) ? adminList : []);
    } catch (error) {
      setError(error.message || "Failed to fetch admins");
      handleError(error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    fetchAdmins(filters);
  };

  const fetchInstitutions = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://lms1-1-p88i.onrender.com/api/institutions/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInstitutions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      handleError(error);
      setInstitutions([]);
    }
  };

  const handleStatusToggle = async (admin) => {
    if (loadingAdminId !== null) return;

    try {
      setLoadingAdminId(admin.id);

      if (admin.is_active && admin.role === "department_admin") {
        const activeDeptAdmins = admins.filter(
          (a) =>
            a.role === "department_admin" &&
            a.department === admin.department &&
            a.institution.id === admin.institution.id &&
            a.is_active &&
            a.id !== admin.id
        ).length;

        if (activeDeptAdmins === 0) {
          throw new Error(
            `Cannot deactivate the only active admin for ${admin.department} department`
          );
        }
      }

      const token = localStorage.getItem("accessToken");
      const endpoint = `${ADMIN_API_BASE}/${admin.id}/${
        admin.is_active ? "deactivate" : "activate"
      }/`;

      await axios.post(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAdmins((prevAdmins) =>
        prevAdmins.map((a) =>
          a.id === admin.id ? { ...a, is_active: !admin.is_active } : a
        )
      );

      showAlert(
        `Admin ${admin.is_active ? "deactivated" : "activated"} successfully`
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingAdminId(null);
    }
  };

  const handleSubmitAdmin = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const adminData = {
        admin_type: formData.admin_type,
        email: formData.email,
        username: formData.username,
        institution: formData.institution,
        department:
          formData.admin_type === "department"
            ? formData.department
            : undefined,
      };

      if (!isEditing || formData.password) {
        adminData.password = formData.password;
      }

      let response;
      if (isEditing) {
        response = await axios.put(
          `${ADMIN_API_BASE}/${selectedAdmin.id}/`,
          adminData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        response = await axios.post(ADMIN_API_BASE + "/", adminData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      showAlert(
        response.data.message ||
          `Admin ${isEditing ? "updated" : "created"} successfully`
      );
      setOpenDialog(false);
      fetchAdmins(activeFilters);
      resetForm();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionUpdate = async (updatedData) => {
    try {
      // Update local state with new permissions
      setAdmins(prevAdmins => prevAdmins.map(admin => 
        admin.id === updatedData.adminId
          ? { ...admin, permissions: updatedData.permissions }
          : admin
      ));
      
      // Show success message
      showAlert('Permissions updated successfully');
      
      // Refresh the admin list to get latest data
      await fetchAdmins(activeFilters);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    let errorMessage = "An error occurred";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    showAlert(errorMessage, "error");
  };
  
  const handleOpenPermissionsDialog = (admin) => {
    setSelectedAdmin({
      ...admin,
      role: admin.role === 'college_admin' ? 'college_admin' : 'department_admin'
    });
    setOpenPermissionsDialog(true);
  };
  
  const showAlert = (message, severity = "success") => {
    setAlert({
      show: true,
      message,
      severity,
    });
  };

  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      password: "",
      admin_type: "",
      institution: "",
      department: "",
      permissions: selectedAdmin?.permissions || [],
    });
    setSelectedAdmin(null);
    setIsEditing(false);
  };

  const handleEditUsernameClick = (admin) => {
    setSelectedAdmin(admin);
    setEditUsername(admin.username);
    setOpenEditDialog(true);
  };

  const handleUsernameUpdate = async () => {
    try {
      setLoading(true);
      setEditingError("");

      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `${ADMIN_API_BASE}/${selectedAdmin.id}/`,
        { username: editUsername },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the admins list with the new username
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.id === selectedAdmin.id
            ? { ...admin, username: editUsername }
            : admin
        )
      );

      showAlert("Username updated successfully");
      setOpenEditDialog(false);
    } catch (error) {
      setEditingError(
        error.response?.data?.message ||
          error.response?.data?.username?.[0] ||
          "Failed to update username"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${ADMIN_API_BASE}/${selectedAdmin.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmins(admins.filter((admin) => admin.id !== selectedAdmin.id));
      showAlert("Admin deleted successfully");
      setOpenDeleteDialog(false);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (admin) => {
    setSelectedAdmin(admin);
    setOpenDeleteDialog(true);
  };

  const handleViewDetails = (admin) => {
    setSelectedAdmin(admin);
    setOpenViewDialog(true);
  };

  return (
    <Box className={classes.root}>
      <AdminStats />
      
      <Box className={classes.header}>
        <Box className={classes.headerContent}>
          <Typography variant="h5" className={classes.headerTitle}>
            Admin Access Control
          </Typography>
          
          <Box className={classes.filterSection}>
            <AdminFilters onFilterChange={handleFilterChange} />
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className={classes.addButton}
        >
          Add Admin
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchAdmins(activeFilters)}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <AdminList 
        admins={admins}
        loading={loading}
        loadingAdminId={loadingAdminId}
        error={error}
        institutions={institutions}
        onViewDetails={handleViewDetails}
        onEditUsername={handleEditUsernameClick}
        onManagePermissions={handleOpenPermissionsDialog}
        onStatusToggle={handleStatusToggle}
        onDelete={handleOpenDeleteDialog}
        onRetry={() => fetchAdmins(activeFilters)}
      />

      {/* Username Edit Dialog */}
      <UsernameEditDialog 
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        admin={selectedAdmin}
        editUsername={editUsername}
        setEditUsername={setEditUsername}
        editingError={editingError}
        loading={loading}
        onSubmit={handleUsernameUpdate}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={handleDelete}
        loading={loading}
        title="Delete Admin Account"
        contentText={`Are you sure you want to delete ${selectedAdmin?.email}? This action cannot be undone.`}
        showWarning={selectedAdmin?.assigned_students?.length > 0}
        warningText="Cannot delete admin with assigned students. Please reassign students first."
      />
      
      {/* Admin Form Dialog */}
      <AdminForm
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          resetForm();
        }}
        formData={formData}
        setFormData={setFormData}
        institutions={institutions}
        loading={loading}
        onSubmit={handleSubmitAdmin}
        isEditing={isEditing}
      />

      {/* Admin Permissions Dialog */}
      <AdminPermissionsDialog
        open={openPermissionsDialog}
        onClose={() => {
          setOpenPermissionsDialog(false);
          resetForm();
        }}
        selectedAdmin={selectedAdmin}
        onSuccess={handlePermissionUpdate}
      />

      {/* View Admin Details Dialog */}
      <ViewAdminDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        admin={selectedAdmin}
      />

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.show}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, show: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, show: false })}
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

export default AdminAccessControl;