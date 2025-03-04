import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import axios from 'axios';

const useStyles = makeStyles({
  notificationIcon: {
    color: '#ffffff !important', // Bright red color
    marginRight: '16px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  popover: {
    width: 360,
    maxHeight: 480,
    overflow: 'hidden',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#f5f7fa',
  },
  notificationTitle: {
    fontWeight: 'bold !important',
  },
  markAllBtn: {
    textTransform: 'none !important',
    fontWeight: 'bold !important',
  },
  notificationsList: {
    maxHeight: 400,
    overflow: 'auto',
    padding: 0,
  },
  notificationItem: {
    padding: '10px 16px !important',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#f5f7fa',
    },
  },
  unreadNotification: {
    borderLeft: '3px solid #1a237e',
    backgroundColor: 'rgba(26, 35, 126, 0.05)',
  },
  notificationTitle: {
    fontWeight: 'bold !important',
    fontSize: '14px !important',
    color: '#1a1a1a',
    marginBottom: '4px !important',
  },
  notificationMessage: {
    fontSize: '13px !important',
    color: '#666666',
    marginBottom: '4px !important',
  },
  notificationTime: {
    fontSize: '12px !important',
    color: '#999999',
  },
  emptyMessage: {
    padding: '24px 16px',
    textAlign: 'center',
    color: '#666666',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0',
  },
});

const Notifications = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  // Fetch notifications on component mount and when popover opens
  useEffect(() => {
    if (anchorEl) {
      fetchNotifications();
    }
  }, [anchorEl]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('https://lms1-1-p88i.onrender.com/api/profiles/my_notifications/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNotifications = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    setMarkingAllRead(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('https://lms1-1-p88i.onrender.com/api/profiles/mark_all_notifications_read/', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update UI without making another API call
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({
          ...notification,
          is_read: true
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`https://lms1-1-p88i.onrender.com/api/profiles/${id}/mark_notification_read/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update UI without making another API call
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
    }
  };

  // Format date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  return (
    <>
      <IconButton 
        aria-describedby={id}
        className={classes.notificationIcon} 
        onClick={handleOpenNotifications}
        size="large"
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseNotifications}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          className: classes.popover,
          elevation: 3,
        }}
      >
        <Box className={classes.notificationHeader}>
          <Typography variant="subtitle1" className={classes.notificationTitle}>
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Typography>
          <Button
            size="small"
            color="primary"
            className={classes.markAllBtn}
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || markingAllRead}
          >
            {markingAllRead ? 'Marking...' : 'Mark all read'}
          </Button>
        </Box>
        
        <Divider />
        
        <List className={classes.notificationsList}>
          {loading ? (
            <Box className={classes.loadingContainer}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Typography className={classes.emptyMessage}>
              No notifications
            </Typography>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  className={`${classes.notificationItem} ${!notification.is_read ? classes.unreadNotification : ''}`}
                  onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography className={classes.notificationTitle}>
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography className={classes.notificationMessage}>
                          {notification.message}
                        </Typography>
                        <Typography className={classes.notificationTime}>
                          {formatDate(notification.created_at)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default Notifications;