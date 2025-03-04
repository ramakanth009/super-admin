import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  IconButton,
  CircularProgress,
  Stack,
  Alert 
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const useStyles = makeStyles({
  statsContainer: {
    marginBottom: '32px',
  },
  statCard: {
    padding: '20px',
    textAlign: 'center',
    borderRadius: '8px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  statTitle: {
    color: '#666',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1a237e',
  },
});

const StudentStats = () => {
  const classes = useStyles();
  const [stats, setStats] = useState({
    total_students: 0,
    active_students: 0,
    profiles_completed: 0,
    completion_rate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setError(null);
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        'https://lms1-1-p88i.onrender.com/api/student-management/stats/',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600 }}>
          Student Statistics
        </Typography>
        <IconButton 
          onClick={handleRefresh} 
          disabled={refreshing}
          color="primary"
        >
          {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </Stack>

      <Grid container spacing={3} className={classes.statsContainer}>
        <Grid item xs={12} md={3}>
          <Paper className={classes.statCard} style={{ backgroundColor: '#e3f2fd' }}>
            <Typography className={classes.statTitle}>Total Students</Typography>
            <Typography className={classes.statValue}>
              {stats.total_students}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className={classes.statCard} style={{ backgroundColor: '#e8f5e9' }}>
            <Typography className={classes.statTitle}>Active Students</Typography>
            <Typography className={classes.statValue}>
              {stats.active_students}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className={classes.statCard} style={{ backgroundColor: '#fff3e0' }}>
            <Typography className={classes.statTitle}>Profiles Completed</Typography>
            <Typography className={classes.statValue}>
              {stats.profiles_completed}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className={classes.statCard} style={{ backgroundColor: '#f3e5f5' }}>
            <Typography className={classes.statTitle}>Completion Rate</Typography>
            <Typography className={classes.statValue}>
              {stats.completion_rate}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentStats;
