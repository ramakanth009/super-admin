import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginBottom: '20px',
  },
  tableHeader: {
    backgroundColor: '#f8fafd',
  },
  tableHeaderCell: {
    color: '#5c6b89',
    fontWeight: 600,
    padding: '16px',
    borderBottom: '2px solid #e0e7ff',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: '#f8fafd',
    },
  },
  tableCell: {
    padding: '16px',
  },
  statusChip: {
    minWidth: '60px',
    cursor: 'pointer',
  },
  usernameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
});

const AdminList = ({
  admins,
  loading,
  loadingAdminId,
  error,
  institutions,
  onViewDetails,
  onEditUsername,
  onManagePermissions,
  onStatusToggle,
  onDelete,
  onRetry
}) => {
  const classes = useStyles();

  if (loading && !loadingAdminId) {
    return (
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow className={classes.tableHeader}>
              <TableCell className={classes.tableHeaderCell}>ID</TableCell>
              <TableCell className={classes.tableHeaderCell}>Email</TableCell>
              <TableCell className={classes.tableHeaderCell}>Username</TableCell>
              <TableCell className={classes.tableHeaderCell}>Role</TableCell>
              <TableCell className={classes.tableHeaderCell}>Institution</TableCell>
              <TableCell className={classes.tableHeaderCell}>Department</TableCell>
              <TableCell className={classes.tableHeaderCell}>Status</TableCell>
              <TableCell className={classes.tableHeaderCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (admins.length === 0) {
    return (
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow className={classes.tableHeader}>
              <TableCell className={classes.tableHeaderCell}>ID</TableCell>
              <TableCell className={classes.tableHeaderCell}>Email</TableCell>
              <TableCell className={classes.tableHeaderCell}>Username</TableCell>
              <TableCell className={classes.tableHeaderCell}>Role</TableCell>
              <TableCell className={classes.tableHeaderCell}>Institution</TableCell>
              <TableCell className={classes.tableHeaderCell}>Department</TableCell>
              <TableCell className={classes.tableHeaderCell}>Status</TableCell>
              <TableCell className={classes.tableHeaderCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body1">
                  No admins found matching the applied filters.
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table>
        <TableHead>
          <TableRow className={classes.tableHeader}>
            <TableCell className={classes.tableHeaderCell}>ID</TableCell>
            <TableCell className={classes.tableHeaderCell}>Email</TableCell>
            <TableCell className={classes.tableHeaderCell}>Username</TableCell>
            <TableCell className={classes.tableHeaderCell}>Role</TableCell>
            <TableCell className={classes.tableHeaderCell}>Institution</TableCell>
            <TableCell className={classes.tableHeaderCell}>Department</TableCell>
            <TableCell className={classes.tableHeaderCell}>Status</TableCell>
            <TableCell className={classes.tableHeaderCell}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id} className={classes.tableRow}>
              <TableCell>{admin.id}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <Box className={classes.usernameCell}>
                  {admin.username}
                  <IconButton
                    size="small"
                    onClick={() => onEditUsername(admin)}
                    title="Edit username"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={
                    admin.role === "college_admin"
                      ? "College Admin"
                      : "Department Admin"
                  }
                  color={
                    admin.role === "college_admin" ? "primary" : "secondary"
                  }
                />
              </TableCell>
              <TableCell>
                {admin?.institution
                  ? typeof admin.institution === "object"
                    ? admin.institution.name
                    : typeof admin.institution === "number"
                      ? institutions.find((i) => i.id === admin.institution)
                          ?.name || "-"
                      : "-"
                  : "-"}
              </TableCell>
              <TableCell>{admin.department || "-"}</TableCell>
              <TableCell>
                <Chip
                  label={
                    loadingAdminId === admin.id
                      ? "Updating..."
                      : admin.is_active
                        ? "Active"
                        : "Inactive"
                  }
                  color={admin.is_active ? "success" : "error"}
                  className={classes.statusChip}
                  onClick={() => onStatusToggle(admin)}
                  disabled={loadingAdminId !== null}
                />
              </TableCell>

              <TableCell>
                <IconButton
                  onClick={() => onDelete(admin)}
                  color="error"
                  title="Delete admin"
                  disabled={admin.assigned_students?.length > 0}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={() => onViewDetails(admin)}
                  color="primary"
                  title="View details"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  onClick={() => onManagePermissions(admin)}
                  color="primary"
                  title="Manage permissions"
                >
                  <SecurityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminList;