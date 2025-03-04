import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    marginBottom: '32px',
  },
  statsCard: {
    padding: '24px',
    textAlign: 'center',
    borderRadius: '12px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  totalAdminsCard: {
    backgroundColor: '#e3f2fd',
  },
  activeAdminsCard: {
    backgroundColor: '#e0f2f1',
  },
  collegeAdminCard: {
    backgroundColor: '#e8f5e9',
  },
  departmentAdminCard: {
    backgroundColor: '#fff3e0',
  },
  value: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1a237e',
    marginBottom: '8px',
  },
  label: {
    color: '#5c6b89',
    fontWeight: 500,
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginTop: '4px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
  },
  refreshButton: {
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'rotate(30deg)',
    },
  },
  sectionDivider: {
    margin: '24px 0',
  }
});

const AdminStats = () => {
  const classes = useStyles();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('https://lms1-1-p88i.onrender.com/api/admin-management/admin_stats/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch admin statistics');
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAdminStats();
  };

  if (loading && !refreshing) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error"
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={handleRefresh}
          >
            <RefreshIcon />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box className={classes.root}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
          Admin Overview
        </Typography>
        <IconButton 
          onClick={handleRefresh} 
          disabled={refreshing}
          color="primary"
          className={classes.refreshButton}
        >
          {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </Stack>
      
      <Grid container spacing={3}>
        {/* Total Admins Card */}
        <Grid item xs={12} md={3}>
          <Paper className={`${classes.statsCard} ${classes.totalAdminsCard}`}>
            <Typography className={classes.value}>
              {stats?.total_admins || 0}
            </Typography>
            <Typography className={classes.label}>Total Admin Accounts</Typography>
          </Paper>
        </Grid>

        {/* Active Admins Card */}
        <Grid item xs={12} md={3}>
          <Paper className={`${classes.statsCard} ${classes.activeAdminsCard}`}>
            <Typography className={classes.value}>
              {stats?.active_admins || 0}
            </Typography>
            <Typography className={classes.label}>Active Admins</Typography>
          </Paper>
        </Grid>

        {/* College Admins Card */}
        <Grid item xs={12} md={3}>
          <Paper className={`${classes.statsCard} ${classes.collegeAdminCard}`}>
            <Typography className={classes.value}>
              {stats?.role_distribution?.college_admin || 0}
            </Typography>
            <Typography className={classes.label}>College Admins</Typography>
          </Paper>
        </Grid>

        {/* Department Admins Card */}
        <Grid item xs={12} md={3}>
          <Paper className={`${classes.statsCard} ${classes.departmentAdminCard}`}>
            <Typography className={classes.value}>
              {stats?.role_distribution?.department_admin || 0}
            </Typography>
            <Typography className={classes.label}>Department Admins</Typography>
          </Paper>
        </Grid>
      </Grid>

      {stats?.department_coverage && (
        <>
          <Divider className={classes.sectionDivider} />
          <Typography variant="h6" sx={{ color: '#1a237e', mb: 2 }}>
            Department Coverage
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(stats.department_coverage).map(([department, count]) => (
              <Grid item xs={12} sm={6} md={4} key={department}>
                <Paper sx={{ p: 2, backgroundColor: '#f8fafd', borderRadius: '8px' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {department}
                  </Typography>
                  <Typography>
                    {count} admin{count !== 1 ? 's' : ''}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AdminStats;