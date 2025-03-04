import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Stack 
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
  institutionsCard: {
    backgroundColor: '#e3f2fd',
  },
  usersCard: {
    backgroundColor: '#e8f5e9',
  },
  adminCard: {
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
  }
});

const OverallStats = () => {
  const classes = useStyles();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverallStats();
  }, []);

  const fetchOverallStats = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('https://lms1-1-p88i.onrender.com/api/institutions/overall_stats/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch overall statistics');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOverallStats();
  };

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const { institutions_summary, user_distribution } = stats || {};

  return (
    <Box className={classes.root}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
          Platform Overview
        </Typography>
        <IconButton 
          onClick={handleRefresh} 
          disabled={refreshing}
          color="primary"
        >
          {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </Stack>
      
      <Grid container spacing={3}>
        {/* Institutions Stats */}
        <Grid item xs={12} md={4}>
          <Paper className={`${classes.statsCard} ${classes.institutionsCard}`}>
            <Typography className={classes.value}>
              {institutions_summary?.total || 0}
            </Typography>
            <Typography className={classes.label}>Total Institutions</Typography>
            <Typography className={classes.subtitle}>
              Active: {institutions_summary?.active || 0} | 
              Inactive: {institutions_summary?.inactive || 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Users Stats */}
        <Grid item xs={12} md={4}>
          <Paper className={`${classes.statsCard} ${classes.usersCard}`}>
            <Typography className={classes.value}>
              {user_distribution?.total_users || 0}
            </Typography>
            <Typography className={classes.label}>Total Users</Typography>
            <Typography className={classes.subtitle}>
              Students: {user_distribution?.total_students || 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Admins Stats */}
        <Grid item xs={12} md={4}>
          <Paper className={`${classes.statsCard} ${classes.adminCard}`}>
            <Typography className={classes.value}>
              {user_distribution?.department_admins || 0}
            </Typography>
            <Typography className={classes.label}>Department Admins</Typography>
            <Typography className={classes.subtitle}>
              College Admins:  {user_distribution?.college_admins || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverallStats;
