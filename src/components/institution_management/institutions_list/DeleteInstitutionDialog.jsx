import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  DialogContentText,
  CircularProgress
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '12px',
      minWidth: '400px',
    },
  },
  dialogTitle: {
    backgroundColor: '#f8fafd',
    borderBottom: '1px solid #e0e7ff',
    padding: '20px 24px',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  warningAlert: {
    marginTop: '16px',
  },
});

const DeleteInstitutionDialog = ({
  open,
  onClose,
  onDelete,
  institution,
  loading
}) => {
  const classes = useStyles();

  if (!institution) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={classes.dialog}
    >
      <DialogTitle className={classes.dialogTitle}>
        Delete Institution
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {institution.name}? This
          action cannot be undone.
          {institution.total_users > 0 && (
            <Alert severity="warning" className={classes.warningAlert}>
              This institution has active users. Consider deactivating it
              instead of deleting.
            </Alert>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onDelete}
          className={classes.deleteButton}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteInstitutionDialog;