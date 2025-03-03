import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  DashboardOutlined as DashboardIcon,
  Business,
  AdminPanelSettings,
  School,
  Assessment,
  Timeline,
  ListAlt,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { AuthContext } from '../App'; // Import AuthContext

const useStyles = makeStyles({
  sidebar: {
    width: '260px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e0e0e0',
    overflowY: 'auto',
    position: 'fixed',
    bottom: 0,
    left: 0,
    top: '64px',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarContent: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  sidebarItem: {
    padding: '8px 16px',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#f5f5f5',
    },
  },
  sectionTitle: {
    padding: '16px',
    color: '#666666',
    fontWeight: 'bold',
  },
  activeTab: {
    backgroundColor: '#e3f2fd',
    '&:hover': {
      backgroundColor: '#e3f2fd',
    },
  },
  logoutSection: {
    borderTop: '1px solid #e0e0e0',
    marginTop: 'auto',
  },
  logoutButton: {
    padding: '16px',
    '&:hover': {
      backgroundColor: '#fff1f0',
      cursor: 'pointer',
    },
    '& .MuiListItemIcon-root': {
      color: '#ff4d4f',
    },
    '& .MuiListItemText-primary': {
      color: '#ff4d4f',
    },
  },
});

const menuSections = [
  {
    heading: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }
    ]
  },
  {
    heading: 'Institution Management',
    items: [
      { id: 'institutions', label: 'Institutions', icon: <Business />, path: '/institutions' },
      { id: 'admin-access', label: 'Admins Access Control', icon: <AdminPanelSettings />, path: '/admin-access' },
      { id: 'student-management', label: 'Student Management', icon: <School />, path: '/student-management' }
    ]
  },
  {
    heading: 'Content Management',
    items: [
      { id: 'career-path', label: 'Career Path', icon: <School />, path: '/career-path' },
      { id: 'assessment', label: 'Assessment Center', icon: <Assessment />, path: '/assessment' }
    ]
  },
  // {
    // heading: 'Reports & Analytics',
    // items: [
      // { id: 'performance', label: 'Performance Metrics', icon: <Timeline />, path: '/performance' },
      // { id: 'logs', label: 'System Logs', icon: <ListAlt />, path: '/logs' }
    // ]
  // }
];

const Sidebar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useContext(AuthContext); // Use AuthContext

  const handleTabClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('rememberedEmail');
    
    // Update authentication context
    setIsAuthenticated(false);
    
    // Navigate to login
    navigate('/login', { replace: true });
  };

  return (
    <Paper className={classes.sidebar}>
      <Box className={classes.sidebarContent}>
        <List>
          {menuSections.map((section, index) => (
            <React.Fragment key={index}>
              <Typography className={classes.sectionTitle}>
                {section.heading}
              </Typography>
              {section.items.map((item) => (
                <ListItem
                  key={item.id}
                  button
                  className={`${classes.sidebarItem} ${
                    location.pathname === item.path ? classes.activeTab : ''
                  }`}
                  onClick={() => handleTabClick(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
              {index < menuSections.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
      
      {/* Logout Section */}
      <Box className={classes.logoutSection}>
        <ListItem 
          button 
          className={classes.logoutButton}
          onClick={handleLogout}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Paper>
  );
};

export default Sidebar;