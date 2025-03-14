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
  Grid,
  Paper,
  LinearProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
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
  statCard: {
    padding: '20px',
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  progressBar: {
    height: '8px',
    borderRadius: '4px',
  },
  label: {
    color: '#666666',
    marginBottom: '4px',
  },
  value: {
    color: '#1a237e',
    fontWeight: 600,
  },
  overallStats: {
    backgroundColor: '#f8fafd',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  profileDetails: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
  },
  progressMetric: {
    textAlign: 'center',
    padding: '16px',
  },
  progressValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1a237e',
    marginBottom: '8px',
  },
  progressLabel: {
    color: '#666666',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
  },
  emptyIcon: {
    fontSize: '48px !important',
    color: '#cccccc',
    marginBottom: '16px',
  },
});

const ViewProgress = ({ studentId, open, onClose }) => {
  const classes = useStyles();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && studentId) {
      fetchProgress();
    }
  }, [studentId, open]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(
        `http://localhost:8000/api/student-management/${studentId}/progress/`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch progress data');
      }

      const data = await response.json();
      // Using the structure from the API documentation
      setProgress(data.data || {});
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const ProgressCard = ({ title, value, total, icon: Icon, color }) => (
    <Paper className={classes.statCard}>
      <Box display="flex" alignItems="center" mb={2}>
        <Icon sx={{ color: color, mr: 1 }} />
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
      </Box>
      <Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="textSecondary">
            Progress
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {value}/{total}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={total > 0 ? (value / total) * 100 : 0}
          className={classes.progressBar}
          sx={{ backgroundColor: `${color}20`, '& .MuiLinearProgress-bar': { backgroundColor: color } }}
        />
      </Box>
    </Paper>
  );

  if (loading) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className={classes.dialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          <TrendingUpIcon />
          Student Progress Report
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className={classes.dialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          <TrendingUpIcon />
          Student Progress Report
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (!progress) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className={classes.dialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          <TrendingUpIcon />
          Student Progress Report
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Box className={classes.emptyState}>
            <TrendingUpIcon className={classes.emptyIcon} />
            <Typography variant="h6" color="textSecondary">
              No progress data found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              No progress data available for this student
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Extract data from the progress object
  const { profile, curriculum = [], assessments = [] } = progress;
  const curriculumCount = curriculum.length;
  const completedCurriculum = curriculum.filter(item => item.completed).length;
  const assessmentCount = assessments.length;
  const completedAssessments = assessments.filter(a => a.status === 'evaluated').length;
  
  const avgScore = assessments.length > 0 
    ? assessments
        .filter(a => a.status === 'evaluated' && a.score)
        .reduce((sum, a) => sum + a.score, 0) / 
      assessments.filter(a => a.status === 'evaluated' && a.score).length
    : 0;

  const totalItems = curriculumCount + assessmentCount;
  const completedItems = completedCurriculum + completedAssessments;
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={classes.dialog}
    >
      <DialogTitle className={classes.dialogTitle}>
        <TrendingUpIcon />
        Student Progress Report
      </DialogTitle>

      <DialogContent className={classes.content}>
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <ProgressCard
              title="Curriculum Progress"
              value={completedCurriculum}
              total={curriculumCount}
              icon={SchoolIcon}
              color="#2196f3"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ProgressCard
              title="Assessment Progress"
              value={completedAssessments}
              total={assessmentCount}
              icon={AssessmentIcon}
              color="#4caf50"
            />
          </Grid>
        </Grid>

        <Paper className={classes.overallStats}>
          <Typography variant="h6" gutterBottom>
            Overall Progress Statistics
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box className={classes.progressMetric}>
                <Typography className={classes.progressValue}>
                  {completionPercentage.toFixed(1)}%
                </Typography>
                <Typography className={classes.progressLabel}>
                  Overall Completion
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className={classes.progressMetric}>
                <Typography className={classes.progressValue}>
                  {avgScore.toFixed(1)}%
                </Typography>
                <Typography className={classes.progressLabel}>
                  Average Assessment Score
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className={classes.progressMetric}>
                <Typography className={classes.progressValue}>
                  {assessmentCount - completedAssessments}
                </Typography>
                <Typography className={classes.progressLabel}>
                  Pending Assessments
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.profileDetails}>
          <Typography variant="h6" gutterBottom>
            Student Profile Details
          </Typography>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} md={6}>
              <Typography className={classes.label}>
                Preferred Role
              </Typography>
              <Typography className={classes.value}>
                {profile?.preferred_role || 'Not set'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className={classes.label}>
                Department
              </Typography>
              <Typography className={classes.value}>
                {profile?.department || 'Not set'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className={classes.label}>
                Email
              </Typography>
              <Typography className={classes.value}>
                {profile?.email || 'Not available'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className={classes.label}>
                Status
              </Typography>
              <Typography className={classes.value}>
                {profile?.is_active ? 'Active' : 'Inactive'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProgress;