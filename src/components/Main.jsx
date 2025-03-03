import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Sidebar from './Sidebar';
import NavBar from './Navbar';
import Dashboard from './dashboard/Dashboard';
import InstitutionsList from './institution_management/institutions_list/Institutions_list';
import AdminAccessControl from './institution_management/admin_access_control/Admin_access_control';
import CareerPath from './content_management/career_path/Career_path';
import AssessmentCenter from './content_management/assessment_center/Assessment';
import StudentManagement from './institution_management/student_managment/Student_management';
// import PerformanceMetrics from './report_analytics/performance_metrics/Performance_metrics';
// import SystemLogs from './report_analytics/system_logs/System_logs';
import Login from './login_page/Login';
import { AuthContext } from '../App';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  contentWrapper: {
    display: 'flex',
    flex: 1,
  },
  mainContent: {
    marginLeft: '260px', // Width of the sidebar
    padding: '84px 20px 20px',
    flexGrow: 1,
    transition: 'margin-left 0.3s',
    width: 'calc(100% - 260px)',
  },
  fullWidth: {
    marginLeft: 0,
    width: '100%',
  },
});

const Main = () => {
  const classes = useStyles();
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  // Check if the current route is login
  const isLoginPage = location.pathname === '/login';

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and on login page, redirect to dashboard
  if (isAuthenticated && isLoginPage) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and trying to access a route other than login or dashboard, allow access
  return (
    <Box className={classes.root}>
      {isAuthenticated && <NavBar />}
      <Box className={classes.contentWrapper}>
        {isAuthenticated && <Sidebar />}
        <Box className={isAuthenticated ? classes.mainContent : classes.fullWidth}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/institutions" element={<InstitutionsList />} />
            <Route path="/admin-access" element={<AdminAccessControl />} />
            <Route path="/student-management" element={<StudentManagement />} />
            <Route path="/career-path" element={<CareerPath />} />
            <Route path="/assessment" element={<AssessmentCenter />} />
            {/* <Route path="/performance" element={<PerformanceMetrics />} /> */}
            {/* <Route path="/logs" element={<SystemLogs />} /> */}
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Main;