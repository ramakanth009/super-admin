import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  editDialog: {
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
  submitButton: {
    backgroundColor: '#1a237e',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#0d147a',
    },
  }
});

const UsernameEditDialog = ({
  open,
  onClose,
  admin,
  editUsername,
  setEditUsername,
  editingError,
  loading,
  onSubmit
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={classes.editDialog}
    >
      <DialogTitle className={classes.dialogTitle}>Edit Username</DialogTitle>
      <DialogContent className={classes.contentPadding}>
        <TextField
          fullWidth
          label="Username"
          value={editUsername}
          onChange={(e) => setEditUsername(e.target.value)}
          error={!!editingError}
          helperText={editingError}
          disabled={loading}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={loading || !editUsername.trim()}
          className={classes.submitButton}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsernameEditDialog;