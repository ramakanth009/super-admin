// import React, { useState } from 'react';
// import { 
//   Box, 
//   Typography,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   AppBar,
//   Toolbar,
//   IconButton,
//   InputBase,
//   Badge,
//   Avatar,
//   Paper,
//   Divider,
//   ListItemButton
// } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import {
//   DashboardOutlined as DashboardIcon,
//   Business,
//   AdminPanelSettings,
//   School,
//   Assessment,
//   Timeline,
//   ListAlt,
//   Notifications,
//   Search,
//   Person,
//   KeyboardArrowDown,
//   KeyboardArrowRight,
// } from '@mui/icons-material';

// const useStyles = makeStyles({
//   root: {
//     display: 'flex',
//     flexDirection: 'column',
//     minHeight: '100vh',
//     backgroundColor: '#f5f5f5 !important',
//   },
//   appBar: {
//     backgroundColor: '#ffffff !important',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1) !important',
//     zIndex: '1201 !important',
//   },
//   toolbar: {
//     display: 'flex !important',
//     justifyContent: 'space-between !important',
//     padding: '0 20px !important',
//   },
//   search: {
//     position: 'relative !important',
//     borderRadius: '20px !important',
//     backgroundColor: '#f5f5f5 !important',
//     marginRight: '16px !important',
//     width: '400px !important',
//     '&:hover': {
//       backgroundColor: '#eeeeee !important',
//     },
//   },
//   searchIcon: {
//     padding: '0 16px !important',
//     height: '100% !important',
//     position: 'absolute !important',
//     display: 'flex !important',
//     alignItems: 'center !important',
//     justifyContent: 'center !important',
//     color: '#666666 !important',
//   },
//   inputRoot: {
//     width: '100% !important',
//   },
//   inputInput: {
//     padding: '8px 8px 8px 48px !important',
//     width: '100% !important',
//   },
//   notification: {
//     marginRight: '16px !important',
//   },
//   profileSection: {
//     display: 'flex !important',
//     alignItems: 'center !important',
//     cursor: 'pointer !important',
//   },
//   content: {
//     flexGrow: 1,
//     padding: '80px 20px 20px 20px !important',
//   },
//   sidebar: {
//     width: '260px !important',
//     backgroundColor: '#ffffff !important',
//     borderRight: '1px solid #e0e0e0 !important',
//     overflowY: 'auto !important',
//     position: 'fixed !important',
//     bottom: '0 !important',
//     left: '0 !important',
//     top: '64px !important',
//   },
//   sidebarItem: {
//     padding: '8px 16px !important',
//     '&:hover': {
//       cursor: 'pointer !important',
//       backgroundColor: '#f5f5f5 !important',
//     },
//   },
//   sectionTitle: {
//     padding: '16px !important',
//     color: '#666666 !important',
//     fontWeight: 'bold !important',
//   },
//   activeTab: {
//     backgroundColor: '#e3f2fd !important',
//     '&:hover': {
//       backgroundColor: '#e3f2fd !important',
//     },
//   },
//   mainContent: {
//     marginLeft: '260px !important',
//     padding: '20px !important',
//   },
// });

// const DashboardLayout = () => {
//   const classes = useStyles();
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [notificationCount, setNotificationCount] = useState(3);

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   const menuSections = [
//     {
//       heading: 'Overview',
//       items: [
//         { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> }
//       ]
//     },
//     {
//       heading: 'Institution Management',
//       items: [
//         { id: 'institutions', label: 'Institutions List', icon: <Business /> },
//         { id: 'admin-access', label: 'Admin Access Control', icon: <AdminPanelSettings /> }
//       ]
//     },
//     {
//       heading: 'Content Management',
//       items: [
//         { id: 'career-path', label: 'Career Path', icon: <School /> },
//         { id: 'assessment', label: 'Assessment Center', icon: <Assessment /> }
//       ]
//     },
//     {
//       heading: 'Reports & Analytics',
//       items: [
//         { id: 'performance', label: 'Performance Metrics', icon: <Timeline /> },
//         { id: 'logs', label: 'System Logs', icon: <ListAlt /> }
//       ]
//     }
//   ];

//   return (
//     <Box className={classes.root}>
//       {/* Navigation Bar */}
//       <AppBar position="fixed" className={classes.appBar}>
//         <Toolbar className={classes.toolbar}>
//           <Typography variant="h6" style={{ color: '#333333' }}>
//             Gigaversity
//           </Typography>

//           {/* Search Bar */}
//           <Paper component="form" className={classes.search}>
//             <Box className={classes.searchIcon}>
//               <Search />
//             </Box>
//             <InputBase
//               placeholder="Search..."
//               classes={{
//                 root: classes.inputRoot,
//                 input: classes.inputInput,
//               }}
//             />
//           </Paper>

//           {/* Notifications and Profile */}
//           <Box display="flex" alignItems="center">
//             <IconButton className={classes.notification}>
//               <Badge badgeContent={notificationCount} color="error">
//                 <Notifications />
//               </Badge>
//             </IconButton>
            
//             <Box className={classes.profileSection}>
//               <Avatar sx={{ marginRight: 1 }}>A</Avatar>
//               <Typography color="textPrimary">Admin User</Typography>
//             </Box>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar */}
//       <Paper className={classes.sidebar}>
//         <List>
//           {menuSections.map((section, index) => (
//             <React.Fragment key={index}>
//               <Typography className={classes.sectionTitle}>
//                 {section.heading}
//               </Typography>
//               {section.items.map((item) => (
//                 <ListItem
//                   key={item.id}
//                   button
//                   className={`${classes.sidebarItem} ${
//                     activeTab === item.id ? classes.activeTab : ''
//                   }`}
//                   onClick={() => handleTabClick(item.id)}
//                 >
//                   <ListItemIcon>{item.icon}</ListItemIcon>
//                   <ListItemText primary={item.label} />
//                 </ListItem>
//               ))}
//               {index < menuSections.length - 1 && <Divider />}
//             </React.Fragment>
//           ))}
//         </List>
//       </Paper>

//       {/* Main Content */}
//       <Box className={classes.mainContent}>
//         <Typography variant="h4" gutterBottom>
//           {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
//         </Typography>
//         {/* Content for each tab will be rendered here */}
//         <Typography>
//           Content for {activeTab} will be displayed here
//         </Typography>
//       </Box>
//     </Box>
//   );
// };
// export default DashboardLayout;
import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography>
        Welcome to your dashboard
      </Typography>
    </Box>
  );
};

export default Dashboard;