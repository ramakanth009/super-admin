import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const useStyles = makeStyles({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '12px',
      minWidth: '800px',
    },
  },
  dialogTitle: {
    backgroundColor: '#1a237e',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  content: {
    padding: '24px',
  },
  notification: {
    marginBottom: '16px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  notificationContent: {
    padding: '16px',
  },
  notificationHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  message: {
    color: '#666666',
    marginTop: '8px',
  },
  timestamp: {
    color: '#999999',
    fontSize: '12px',
    marginTop: '8px',
    textAlign: 'right',
  },
  unread: {
    backgroundColor: '#f8fafd',
  },
  chipLabel: {
    fontSize: '12px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
  },
  emptyIcon: {
    fontSize: '48px',
    color: '#cccccc',
    marginBottom: '16px',
  },
});

const ViewNotifications = ({ studentId, open, onClose }) => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && studentId) {
      fetchNotifications();
    }
  }, [studentId, open]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(
        `https://lms1-1-p88i.onrender.com/api/student-management/${studentId}/notifications/`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      // Using the structure from the API documentation
      setNotifications(data.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assessment':
        return <AssessmentIcon color="primary" />;
      case 'curriculum':
        return <SchoolIcon color="success" />;
      case 'deadline':
        return <ScheduleIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'profile_update_permission':
        return <InfoIcon color="secondary" />;
      case 'profile_update_request':
        return <InfoIcon color="info" />;
      case 'profile_creation':
        return <InfoIcon color="success" />;
      case 'student_assignment':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getNotificationChip = (type) => {
    const types = {
      assessment: { label: 'Assessment', color: 'primary' },
      curriculum: { label: 'Curriculum', color: 'success' },
      deadline: { label: 'Deadline', color: 'error' },
      warning: { label: 'Warning', color: 'warning' },
      profile_update_permission: { label: 'Profile Update', color: 'secondary' },
      profile_update_request: { label: 'Update Request', color: 'info' },
      profile_creation: { label: 'Profile', color: 'success' },
      student_assignment: { label: 'Assignment', color: 'info' },
      info: { label: 'Info', color: 'info' }
    };

    const notificationType = types[type] || types.info;

    return (
      <Chip
        label={notificationType.label}
        color={notificationType.color}
        size="small"
        classes={{ label: classes.chipLabel }}
      />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={classes.dialog}
    >
      <DialogTitle className={classes.dialogTitle}>
        <NotificationsIcon />
        Student Notifications
      </DialogTitle>

      <DialogContent className={classes.content}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : notifications.length === 0 ? (
          <Box className={classes.emptyState}>
            <NotificationsOffIcon className={classes.emptyIcon} />
            <Typography variant="h6" color="textSecondary">
              No notifications found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This student has no notifications at the moment
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification) => (
              <Paper 
                key={notification.id}
                className={`${classes.notification} ${!notification.is_read ? classes.unread : ''}`}
                elevation={1}
              >
                <Box className={classes.notificationContent}>
                  <Box className={classes.notificationHeader}>
                    <Box className={classes.title}>
                      {getNotificationIcon(notification.notification_type)}
                      <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        {notification.title}
                      </Typography>
                      {getNotificationChip(notification.notification_type)}
                    </Box>
                    <IconButton size="small">
                      {notification.is_read ? (
                        <NotificationsOffIcon color="disabled" />
                      ) : (
                        <NotificationsActiveIcon color="primary" />
                      )}
                    </IconButton>
                  </Box>
                  <Typography className={classes.message}>
                    {notification.message}
                  </Typography>
                  <Typography className={classes.timestamp}>
                    {formatDate(notification.created_at)}
                  </Typography>
                </Box>
                {notification.notification_type === 'deadline' && (
                  <Box sx={{ p: 2, bgcolor: '#fff4e5', borderRadius: '0 0 8px 8px' }}>
                    <Typography variant="body2" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon fontSize="small" />
                      Due: {formatDate(notification.due_date)}
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewNotifications;