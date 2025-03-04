import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    padding: '24px',
  },
  title: {
    marginBottom: '24px',
    color: '#1a237e',
    fontWeight: 600,
  },
  card: {
    padding: '24px',
    textAlign: 'center',
    borderRadius: '8px',
    transition: 'box-shadow 0.3s',
    '&:hover': {
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  },
  cardTitle: {
    color: '#666',
    marginBottom: '8px',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 600,
    color: '#1a237e',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '250px',
  },
  summarySection: {
    marginTop: '32px',
  },
  summaryTitle: {
    marginBottom: '16px',
    color: '#333',
  },
  summaryPaper: {
    padding: '16px',
    backgroundColor: '#f8fafd',
  },
  summaryText: {
    color: '#666',
  },
  // Define specific colors for different cards
  blueCard: {
    backgroundColor: '#e3f2fd',
  },
  greenCard: {
    backgroundColor: '#e8f5e9',
  },
  redCard: {
    backgroundColor: '#ffebee',
  },
  purpleCard: {
    backgroundColor: '#f3e5f5',
  },
  indigoCard: {
    backgroundColor: '#e8eaf6',
  },
  pinkCard: {
    backgroundColor: '#fce4ec',
  },
});

const InstitutionStats = ({ institutionId }) => {
  const classes = useStyles();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://lms1-1-p88i.onrender.com/api/institutions/${institutionId}/stats/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        sx={{ mt: 2 }}
        action={
          <Button color="inherit" size="small" onClick={fetchStats}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.user_summary?.total_users || 0,
      className: classes.blueCard
    },
    {
      title: 'College Admins',
      value: stats?.user_summary?.college_admins || 0,
      className: classes.greenCard
    },
    {
      title: 'Department Admins',
      value: stats?.user_summary?.department_admins || 0,
      className: classes.purpleCard
    },
    {
      title: 'Total Students',
      value: stats?.user_summary?.total_students || 0,
      className: classes.indigoCard
    },
    {
      title: 'Active Assessments',
      value: stats?.academic_stats?.active_assessments || 0,
      className: classes.pinkCard
    },
    {
      title: 'Total Curriculum',
      value: stats?.academic_stats?.total_curriculum || 0,
      className: classes.redCard
    }
  ];

  return (
    <Box className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        Institution Statistics
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper className={`${classes.card} ${stat.className}`}>
              <Typography className={classes.cardTitle}>
                {stat.title}
              </Typography>
              <Typography className={classes.cardValue}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box className={classes.summarySection}>
        <Typography variant="h6" className={classes.summaryTitle}>
          Department Distribution
        </Typography>
        <Paper className={classes.summaryPaper}>
          <Grid container spacing={2}>
            {Object.entries(stats?.department_distribution || {}).map(([dept, count]) => (
              <Grid item xs={12} md={6} key={dept}>
                <Typography className={classes.summaryText}>
                  {dept}: {count} admin{count !== 1 ? 's' : ''}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      {stats?.academic_stats && (
        <Box className={classes.summarySection}>
          <Typography variant="h6" className={classes.summaryTitle}>
            Academic Performance
          </Typography>
          <Paper className={classes.summaryPaper}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography className={classes.summaryText}>
                  Student Performance: {stats.academic_stats.student_performance}%
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography className={classes.summaryText}>
                  Assessment Completion Rate: {stats.academic_stats.assessment_completion_rate}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default InstitutionStats;