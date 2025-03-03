import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
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
  contentPadding: {
    padding: '24px !important',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  }
});

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onDelete,
  title,
  contentText,
  warningText,
  loading,
  showWarning,
  deleteButtonText = "Delete"
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={classes.dialog}
    >
      <DialogTitle className={classes.dialogTitle}>
        {title || "Delete Confirmation"}
      </DialogTitle>
      <DialogContent className={classes.contentPadding}>
        <DialogContentText>
          {contentText}
          {showWarning && warningText && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {warningText}
            </Alert>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onDelete}
          disabled={loading}
          className={classes.deleteButton}
        >
          {loading ? <CircularProgress size={24} /> : deleteButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;